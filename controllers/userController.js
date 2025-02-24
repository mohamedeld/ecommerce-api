const User = require('../model/userModel');
const {StatusCodes}=require('http-status-codes')
const jwt = require('jsonwebtoken');
const generateToken = require('../lib/jwtToken');
const e = require('cors');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
  }
  const newUser = new User({ name, email, password });
  const token = generateToken(newUser?._id);
  res.cookie('token',token,{httpOnly:true,
    expires:new Date(Date.now()+process.env.JWT_Cookie_EXPIRES*24*60*60*1000),
    secure:process.env.NODE_ENV==='production'
  });
  await newUser.save();
  res.status(StatusCodes.CREATED).json({ user: newUser });
}

const login = async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'Invalid credentials'});
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if(!isPasswordCorrect){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'Invalid credentials'});
  }
  const token = generateToken(user?._id);
  res.cookie('token',token,{httpOnly:true,
    expires:new Date(Date.now()+process.env.JWT_Cookie_EXPIRES*24*60*60*1000),
    secure:process.env.NODE_ENV==='production'
  });
  res.status(StatusCodes.OK).json({user
  });
}

const protect = async (req,res,next)=>{
  const authHeader = req.headers.authorization;
  
  if(!authHeader || !authHeader.startsWith('Bearer')){
    return res.status(StatusCodes.UNAUTHORIZED).json({message:'Not authorized to access this route'});
  }
  const token = authHeader.split(' ')[1];

  if(!token){
    return res.status(StatusCodes.UNAUTHORIZED).json({message:'Not authorized to access this route'});
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if(!user){
    return res.status(StatusCodes.UNAUTHORIZED).json({message:'No user found with this id'});
  }
  req.user = user;
  next();
}

const authorize = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return res.status(StatusCodes.FORBIDDEN).json({message:'You are not allowed to access this route'});
    }
    next();
  }
}

const logout = async (req,res)=>{
  res.cookie('token','',{
    httpOnly:true,
    expires:new Date(Date.now()),
    secure:process.env.NODE_ENV==='production'
  });

  res.status(StatusCodes.OK).json({message:'Logged out successfully'});
}

const getAllUsers = async (req,res)=>{
  const users = await User.find({});

  res.status(StatusCodes.OK).json({users});
}

const getSingleUser = async(req,res)=>{
  const {id} = req.params;
  const user = await User.findById(id);
  if(!user){
    return res.status(StatusCodes.NOT_FOUND).json({message:'User not found'});
  }
  res.status(StatusCodes.OK).json({user});
}

const currentUser = async (req,res)=>{
  res.status(StatusCodes.OK).json({user:req.user});
}

const updateUser = async (req,res)=>{
  const {id} = req.params;
  const {name,email,role} = req.body;
  const user = await User
  .findByIdAndUpdate(id,{name,email,role},{new:true,runValidators:true});
  if(!user){
    return res.status(StatusCodes.NOT_FOUND).json({message:'User not found'});
  }
  res.status(StatusCodes.OK).json({user});
}

const updateUserPassword = async (req,res)=>{
  const {id} = req.params;
  const {oldPassword, newPassword} = req.body;
  const user = await User.findById(id);
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if(!isPasswordCorrect){
    return res.status(StatusCodes.BAD_REQUEST).json({message:'Invalid credentials'});
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({message:'Password updated successfully'});
}
module.exports = {
  register,
  login,
  protect,
  authorize,
  logout,
  getAllUsers,
  getSingleUser,
  currentUser,
  updateUser,
  updateUserPassword
}