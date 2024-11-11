import express from 'express';

const customerRouter = express.Router();

customerRouter.post('/add', addCustomerData);
customerRouter.get('/all', getAllCustomers);
customerRouter.get('/filter', getCustomersByFilters);

export default customerRouter;
