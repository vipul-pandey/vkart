import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRouter from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`payment-service running on port ${port}`);
});
