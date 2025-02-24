const Product = require('../model/productModel');  
const path = require('path');
const {StatusCodes} = require("http-status-codes")
const createProduct = async(req,res)=>{
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({product});
}

const getAllProducts = async(req,res)=>{
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({products});
}

const getSingleProduct = async(req,res)=>{
  const {id:productId} = req.params;
  const product = await Product.findById(productId);
  if(!product){
    return res.status(StatusCodes.NOT_FOUND).json({message:`Product not found with id ${productId}`});
  }
  res.status(StatusCodes.OK).json({product});
}

const updateProduct = async(req,res)=>{
  const {id:productId} = req.params;
  const product = await Product.findByIdAndUpdate
  (productId,req.body,{new:true,runValidators:true});
  if(!product){
    return res.status(StatusCodes.NOT_FOUND).json({message:`Product not found with id ${productId}`});
  }
  res.status(StatusCodes.OK).json({product});
}

const deleteProduct = async(req,res)=>{
  const {id:productId} = req.params;
  const product = await Product.findByIdAndDelete(productId);
  if(!product){
    return res.status(StatusCodes.NOT_FOUND).json({message:`Product not found with id ${productId}`});
  }
  res.status(StatusCodes.OK).json({product});
}

const uploadImage = async(req,res)=>{
  if(!req?.files){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'Please upload an image'});
  }
  const {image} = req.files;
  if(!image.mimetype.startsWith('image')){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'Please upload an image file'});
  }
  const maxSize = 1024 * 1024;
  if(image.size > maxSize){
    return res.status(StatusCodes.BAD_REQUEST).json({message:`Please upload an image less than ${maxSize}`});
  }
  image.name = `photo_${req.params.id}${path.parse(image.name).ext}`;
  const imagePath = path.join(__dirname,`../public/uploads/${image.name}`);
  image.mv(imagePath,async(err)=>{
    if(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Problem with file upload'});
    }
    await Product.findByIdAndUpdate(req.params.id,{image:`/uploads/${image.name}`});
    res.status(StatusCodes.OK).json({image:`/uploads/${image.name}`});
  })
} 

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
}