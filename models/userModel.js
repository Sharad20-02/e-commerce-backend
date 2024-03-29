const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const cartSchema = new mongoose.Schema({
  id: String,
  quantity: Number,
});

const bookSchema = new mongoose.Schema({
  id:String,
  location: String,
  bookedOn: {
    type:Date,
    default: Date.now()
  },
  appointmentDate:String,
  appointmentTime:String,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [cartSchema],
  book:[bookSchema]
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
