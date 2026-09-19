import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const seedRouter = express.Router();

// This resets products and users: never allow unauthenticated visitors to run it.
seedRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
}));
export default seedRouter;
