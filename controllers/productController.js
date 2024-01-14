const UserModel = require('../models/userModel');
const ProductModel = require('../models/productModel');

exports.addProduct = async (req, res, next) => {
    const {name, description, type, image, price} = req.body;
    if(!name || !description || !price || !image){
        res.status(400).json({success:'False', msg:"Please provide complete details"})
    }
    const product = await ProductModel.create(req.body);
    res.status(200).json({success:'True. product added successfully', product});
}

exports.filterProducts = async(req, res, next)=>{
    const {type} = req.body;
    try {
        const products = await ProductModel.find({type:type});
        if(!products || products.length == 0){
            res.status(200).json({msg:"No products with such type"});
        }
        res.status(200).json({success:"true", len:products.length,products});
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'bad request', error: error.message });
    }
}

exports.sortByPrice = async(req, res, next)=>{
    try {
        const products = await ProductModel.find();
        products.sort((a, b)=> a.price - b.price);
        res.status(200).json({len:products.length, products});
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'bad request', error: error.message });
    }
}