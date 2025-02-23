const {Schema,model,models} = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const userSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'Email is not valid'
    }
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    default:'user',
    enum:['user','admin']
  }
})

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password);
}
userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    next();
  }
  this.password = await bcrypt.hash(this.password,10);
  next();
})
const User = models?.User ||  model('User',userSchema);
module.exports = User;