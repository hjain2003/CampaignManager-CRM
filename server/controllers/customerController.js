import Customer from '../models/Customer.js';

// Add a new customer
export const addCustomerData = async (req, res) => {
  try {
    const { name, email, phone, orderValueTillDate, lastVisited, totalVisitCount } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      phone,
      orderValueTillDate,
      lastVisited,
      totalVisitCount,
    });

    await newCustomer.save();

    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    res.status(400).json({ message: 'Error adding customer', error: error.message });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// Get customers by filters 
export const getCustomersByFilters = async (req, res) => {
  const { minOrderValue, maxOrderValue, lastVisitedBefore, lastVisitedAfter, minVisitCount } = req.query;
  const filters = {};

  if (minOrderValue) filters.orderValueTillDate = { $gte: parseFloat(minOrderValue) };
  if (maxOrderValue) filters.orderValueTillDate = { ...filters.orderValueTillDate, $lte: parseFloat(maxOrderValue) };
  if (lastVisitedBefore) filters.lastVisited = { $lt: new Date(lastVisitedBefore) };
  if (lastVisitedAfter) filters.lastVisited = { ...filters.lastVisited, $gt: new Date(lastVisitedAfter) };
  if (minVisitCount) filters.totalVisitCount = { $gte: parseInt(minVisitCount) };

  try {
    const customers = await Customer.find(filters);
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers by filters', error: error.message });
  }
};
