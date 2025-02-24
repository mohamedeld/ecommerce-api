const Product = require('../model/productModel');
const Review = require('../model/reviewModel');

const {StatusCodes} = require("http-status-codes")


const createReview = async(req,res)=>{
  const {product:productId} = req.body;
  const isValidProduct = await Product
  .findById(productId);
  if(!isValidProduct){
    return res.status(StatusCodes.BAD_REQUEST).json({message:`Product not found with id ${productId}`});
  }
  const alreadyReviewed = await Review.findOne({product:productId,user:req.user.userId});
  if(alreadyReviewed){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'Product already reviewed'});
  }
  req.body.user = req.user.userId;
  req.body.product = req.params.id;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({review});
}

const getAllReviews = async(req,res)=>{
  const reviews = await Review.find({}).populate({
    path:'product',
    select:'name company price'
  }).populate({
    path:'user',
    select:'name email'
  });
  res.status(StatusCodes.OK).json({reviews});
}

const getSingleReview = async(req,res)=>{
  const {id:reviewId} = req.params;
  const review = await Review.findById(review);
    if(!review){
      return res.status(StatusCodes.NOT_FOUND).json({message:`Review not found with id ${reviewId}`});
    }
    res.status(StatusCodes.OK).json({review});
}

const updateReview = async(req,res)=>{
  const {id:reviewId} = req.params;
  const review = await Review.findByIdAndUpdate(reviewId,req.body,{new:true,runValidators:true});
  if(!review){
    return res.status(StatusCodes.NOT_FOUND).json({message:`Review not found with id ${reviewId}`});
  }
  res.status(StatusCodes.OK).json({review});
}

const deleteReview = async(req,res)=>{
  const {id:reviewId} = req.params;
  const review = await Review.findByIdAndDelete(reviewId);
  if(!review){
    return res.status(StatusCodes.NOT_FOUND).json({message:`Review not found with id ${reviewId}`});
  }
  res.status(StatusCodes.OK).json({review});
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
}