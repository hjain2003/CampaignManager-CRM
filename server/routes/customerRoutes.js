import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { addCustomerData, getAllCustomers, getCustomersByFilters } from '../controllers/customerController.js';

const customerRouter = express.Router();

customerRouter.post('/add', addCustomerData);
customerRouter.get('/all',authenticate, getAllCustomers);
customerRouter.get('/filter', authenticate,getCustomersByFilters);

export default customerRouter;
