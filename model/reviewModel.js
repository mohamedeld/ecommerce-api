const { Schema, model, models } = require('mongoose');


const reviewSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide review title'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide review rating'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide review comment'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }
},{timestamps:true})

// user has only one review per product
reviewSchema.index({product:1,user:1},{unique:true});

const Review = models?.Review || model('Review', reviewSchema);

module.exports = Review;