const express = require('express');
const {
  login,
  register,
  addToCart,
  removeFromCart,
  calculateTotalPrice,
  bookAppointment,
  cancelAppointment,
  getAllAppointments,
} = require('../controllers/userController');
const {
  addProduct,
  filterProducts,
  sortByPrice,
} = require('../controllers/productController');

const router = express.Router();

router.post('/user/login', login);
router.post('/user/register', register);
router.post('/user/addtocart', addToCart);
router.post('/user/removefromcart', removeFromCart);
router.post('/user/totalprice', calculateTotalPrice);
router.post('/user/bookAppointment', bookAppointment);
router.post('/user/cancelAppointment', cancelAppointment);
router.post('/user/getAllAppointments', getAllAppointments);

router.post('/product/add', addProduct);
router.post('/product/filter', filterProducts);
router.get('/product/sortbyprice', sortByPrice);

module.exports = router;
