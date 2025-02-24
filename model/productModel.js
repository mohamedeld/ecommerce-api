const { Schema, model, models } = require('mongoose');


const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  image: {
    type: String,
    default: '/uploads/no-photo.jpg',
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['office', 'kitchen', 'bedroom'],
  },
  company: {
    type: String,
    required: [true, 'Please provide product company'],
    enum: {
      values: ['ikea', 'liddy', 'marcos'],
      message: '{VALUE} is not supported'
    }
  },
  colors: [{
    type: String,
    required: [true, 'Please provide product color'],
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Number,
    required: [true, 'Please provide product inventory'],
    default:15
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true} });


productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false, // true for one-to-one relationship
})

productSchema.pre('remove',async function(next){
  await this.mode('Review').deleteMany({product:this?._id})
  next();
})


const Product = models?.Product || model('Product', productSchema);
module.exports = Product;