const UserModel = require('../models/userModel');
const ProductModel = require('../models/productModel');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(404).json({ msg: 'All fields are compulsory' });
    }

    const user = await UserModel.findOne({ email: email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ msg: 'user not found' });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(404).json({ msg: 'Invalid credentials' });
    }

    res.status(200).json({ msg: 'Login Sucessfull', user });
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.create({ name, email, password });

    return res.status(200).json({ msg: 'user created successfully', user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Failed to create user' });
  }
};

exports.removeFromCart = async (req, res, next) => {
  const { productid, userid } = req.body;
  try {
    const product = await ProductModel.findOne({ _id: productid });
    if (!product) {
      return res
        .status(400)
        .json({ success: 'false', msg: 'No product with such productid' });
    }
    const user = await UserModel.findOne({ _id: userid });
    if (!user) {
      res
        .status(400)
        .json({ success: 'false', msg: 'No user with such userid' });
    }
    let flag = false;
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].id == productid) {
        user.cart[i].quantity--;
        if (user.cart[i].quantity == 0) {
          user.cart.splice(i, 1);
        }
        flag = true;
        break;
      }
    }
    product.quantity++;
    product.save();
    user.save();
    res.status(200).json({ msg: 'successfully removed product', user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'bad request', error: error.message });
  }
};

exports.addToCart = async (req, res, next) => {
  const { productid, userid } = req.body;
  try {
    const product = await ProductModel.findOne({ _id: productid });
    if (!product) {
      return res
        .status(400)
        .json({ success: 'false', msg: 'No product with such productid' });
    }
    const user = await UserModel.findOne({ _id: userid });
    if (!user) {
      res
        .status(400)
        .json({ success: 'false', msg: 'No user with such userid' });
    }
    let flag = false;
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].id == productid) {
        user.cart[i].quantity++;
        flag = true;
        break;
      }
    }
    if (flag == false) {
      user.cart.push({ id: productid, quantity: 1 });
      user.save();
    }
    product.quantity--;
    product.save();
    res.status(200).json({ msg: 'successfully ordered product', user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'bad request', error: error.message });
  }
};

exports.calculateTotalPrice = async (req, res, next) =>{
  const {userid} = req.body;

  const user = await UserModel.findOne({_id:userid});
  if(!user){
    res.status(200).json({msg:"no user with such userid"});
  }
  const cart = user.cart;
  let price = 0;
  for(let i=0; i<cart.length; i++){
    const product = await ProductModel.findOne({_id:cart[i].id});
    price += (product.price * cart[i].quantity);
  }
  res.status(200).json({success:"true", totalCost:price});
}

exports.bookAppointment = async(req, res)=>{
  try {
    const { userid, productid, location, appointmentDate, appointmentTime } =
      req.body;

    const user = await UserModel.findOne({ _id: userid });
    if (!user) {
      return res.status(200).json({ msg: 'no user with such userid' });
    }
    let flag = false;
    for (let i = 0; i < user.book.length; i++) {
      if (user.book[i].id == productid) {
        flag = true;
        break;
      }
    }
    if (flag == true) {
      return res.status(200).json({ msg: 'Appointment already booked' });
    }
    user.book.push({
      id: productid,
      location,
      appointmentDate,
      appointmentTime,
    });
    user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'bad request', error: error.message });
  }
}

exports.cancelAppointment = async(req, res)=>{
  const {userid, productid} = req.body;
  try {
    const user = await UserModel.findOne({_id:userid});
    if(!user){
      return res.status(200).json({msg:"no such user"});
    }
    let flag = false;
    for(let i=0; i<user.book.length; i++){
      if(user.book[i].id == productid){
        await UserModel.updateOne(
          { _id: userid },
          { $pull: { book: { id: productid } } }
        );
        flag = true;
        break;
      }
    }
    if(flag == false){
      return res.status(200).json({msg:"No such product booked by the user"});
    }
    res.status(200).json({msg:"appointment cancelled successfully"});
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'bad request', error: error.message });
  }
}

exports.getAllAppointments = async(req, res)=>{
  const {userid} = req.body;
  const user = await UserModel.findOne({_id:userid});
  if(!user){
    return res.status(200).json({msg:"No such user found"});
  }
  const book = user.book;
  res.status(200).json({length:book.length, book});
}