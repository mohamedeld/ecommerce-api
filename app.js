const express = require('express');
require('dotenv').config();
require("express-async-errors")
const connectToDb = require('./db');
const app = express();


app.use(express.json());

const PORT = process.env.PORT || 5000;


app.use((req,res,next)=>{
  res.status(404).json({
    message:"Not found"
  })
})

const starter = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit the process if the connection fails
  }
}


starter()