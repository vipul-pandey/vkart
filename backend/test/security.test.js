import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { Writable } from 'node:stream';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { generateToken, isAuth, isAdmin, mailgun } from '../utils.js';
import uploadRouter from '../routes/uploadRoutes.js';

process.env.JWT_SECRET = 'test-only-secret-not-for-production';
const admin = { _id: '507f1f77bcf86cd799439011', name: 'Test', email: 'test@example.invalid', isAdmin: true };

async function serve(t, app) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => {
    server.closeAllConnections();
    server.close(resolve);
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

function authResult(token) {
  let status;
  let body;
  let passed = false;
  const req = { headers: token ? { authorization: `Bearer ${token}` } : {} };
  const res = { status(value) { status = value; return this; }, send(value) { body = value; } };
  isAuth(req, res, () => { passed = true; });
  return { status, body, passed, user: req.user };
}

test('JWT signing preserves user claims and accepts valid HS256 tokens', () => {
  const token = generateToken(admin);
  const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  assert.equal(decoded._id, admin._id);
  assert.equal(decoded.exp - decoded.iat, 30 * 24 * 60 * 60);
  assert.equal(authResult(token).passed, true);
});

test('auth rejects missing, invalid, expired, unsigned and wrong-algorithm tokens', () => {
  const invalid = [
    undefined,
    'broken',
    jwt.sign(admin, 'wrong-secret'),
    jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: -1 }),
    jwt.sign(admin, '', { algorithm: 'none' }),
    jwt.sign(admin, process.env.JWT_SECRET, { algorithm: 'HS384' }),
  ];
  for (const token of invalid) {
    assert.equal(authResult(token).status, 401);
    assert.equal(authResult(token).passed, false);
  }
});

test('admin guard rejects normal users', () => {
  let status;
  isAdmin({ user: { isAdmin: false } }, {
    status(code) { status = code; return this; }, send() {},
  }, () => assert.fail('non-admin was allowed'));
  assert.equal(status, 401);
});

test('updated Mongoose loads existing models without a database connection', async () => {
  for (const name of ['user', 'product', 'order', 'banner']) {
    const { default: Model } = await import(`../models/${name}Model.js`);
    assert.ok(Model.schema);
  }
  assert.match(mongoose.version, /^6\./);
});

test('all monolith routes import with updated dependencies', async () => {
  for (const name of ['user', 'order', 'product', 'banner', 'seed']) {
    const { default: router } = await import(`../routes/${name}Routes.js`);
    assert.equal(typeof router, 'function');
  }
});

test('upload authorization, limits and Cloudinary success/failure paths', async (t) => {
  const app = express();
  app.use('/upload', uploadRouter);
  app.use((err, req, res, next) => res.status(500).json({ message: err.message }));
  const url = `${await serve(t, app)}/upload`;
  const authorization = `Bearer ${generateToken(admin)}`;
  assert.equal((await fetch(url, { method: 'POST' })).status, 401);
  assert.equal((await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${generateToken({ ...admin, isAdmin: false })}` } })).status, 401);
  assert.equal((await fetch(url, { method: 'POST', headers: { authorization } })).status, 400);

  const form = (size, field = 'file') => {
    const body = new FormData();
    body.append(field, new Blob([Buffer.alloc(size)], { type: 'image/png' }), 'test.png');
    return body;
  };
  assert.equal((await fetch(url, { method: 'POST', headers: { authorization }, body: form(5 * 1024 * 1024 + 1) })).status, 413);
  assert.equal((await fetch(url, { method: 'POST', headers: { authorization }, body: form(4, 'unexpected') })).status, 400);

  let fail = false;
  let uploadedBytes = 0;
  t.mock.method(cloudinary.uploader, 'upload_stream', (callback) => new Writable({
    write(chunk, encoding, done) { uploadedBytes += chunk.length; done(); },
    final(done) {
      callback(fail ? new Error('Mock upload failure') : null, fail ? undefined : { secure_url: 'https://example.invalid/image.png' });
      done();
    },
  }));
  const response = await fetch(url, { method: 'POST', headers: { authorization }, body: form(10) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).secure_url, 'https://example.invalid/image.png');
  assert.equal(uploadedBytes, 10);
  fail = true;
  assert.equal((await fetch(url, { method: 'POST', headers: { authorization }, body: form(10) })).status, 500);
});

test('database seed route rejects anonymous and non-admin requests before database access', async (t) => {
  const { default: seedRouter } = await import('../routes/seedRoutes.js');
  const app = express();
  app.use('/seed', seedRouter);
  const url = `${await serve(t, app)}/seed`;
  assert.equal((await fetch(url)).status, 401);
  assert.equal((await fetch(url, { headers: { authorization: `Bearer ${generateToken({ ...admin, isAdmin: false })}` } })).status, 401);
});

test('Mailgun adapter sends multipart request and supports legacy domain + callbacks', async (t) => {
  process.env.MAILGUN_API_KEY = 'test-key';
  process.env.MAILGUN_DOMIAN = 'legacy.example.invalid';
  delete process.env.MAILGUN_DOMAIN;
  let status = 200;
  const requests = [];
  const app = express();
  app.post('/v3/:domain/messages', (req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      requests.push({ domain: req.params.domain, auth: req.headers.authorization, contentType: req.headers['content-type'], body: Buffer.concat(chunks).toString() });
      res.status(status).json(status === 200 ? { id: 'test-id', message: 'Queued' } : { message: 'Rejected' });
    });
  });
  process.env.MAILGUN_API_URL = await serve(t, app);
  t.after(() => {
    for (const key of ['MAILGUN_API_KEY', 'MAILGUN_DOMAIN', 'MAILGUN_DOMIAN', 'MAILGUN_API_URL']) delete process.env[key];
  });
  const data = { from: 'sender@example.invalid', to: 'recipient@example.invalid', subject: 'Test', html: '<p>Test</p>' };
  const result = await new Promise((resolve, reject) => mailgun().messages().send(data, (err, value) => err ? reject(err) : resolve(value)));
  assert.equal(result.id, 'test-id');
  assert.equal(requests[0].domain, 'legacy.example.invalid');
  assert.equal(requests[0].auth, `Basic ${Buffer.from('api:test-key').toString('base64')}`);
  assert.match(requests[0].contentType, /multipart\/form-data/);
  assert.match(requests[0].body, /recipient@example.invalid/);
  process.env.MAILGUN_DOMAIN = 'correct.example.invalid';
  await mailgun().messages().send(data);
  assert.equal(requests[1].domain, 'correct.example.invalid');
  status = 400;
  const error = await new Promise((resolve) => mailgun().messages().send(data, (err) => resolve(err)));
  assert.ok(error);
});
