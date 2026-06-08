const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ DB Error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId:       { type: String, required: true },
  name:          String,
  phone:         String,
  email:         String,
  address:       String,
  city:          String,
  state:         String,
  pincode:       String,
  items:         String,
  subtotal:      Number,
  discount:      Number,
  couponCode:    String,
  shipping:      Number,
  total:         Number,
  paymentMethod: String,
  status:        { type: String, default: 'pending' },
  createdAt:     { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ── Routes ──────────────────────────────────────

// Test route
app.get('/', (req, res) => {
  res.json({ message: '✅ M&R Backend is running!' });
});

// Save order
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, orderId: order.orderId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all orders (admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
