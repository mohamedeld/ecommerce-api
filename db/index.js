const mongoose= require('mongoose');

// Connect to MongoDB
const connectToDb = async()=>{
  try{
    mongoose.connect(process.env.DB_URL).then(() => console.log('MongoDB Connected'))
      .catch(err => console.log(err));
  }catch(error){
    console.log(error);
  }
}

module.exports = connectToDb;