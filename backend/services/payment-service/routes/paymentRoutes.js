import express from 'express';
const router = express.Router();

router.get('/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

router.get('/google', (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || '' });
});

export default router;
