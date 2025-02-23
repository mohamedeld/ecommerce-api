const express = require('express');
require('dotenv').config();
require("express-async-errors")
const connectToDb = require('./db');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandlerMiddleare = require('./middleware/error-handler');
const userRoutes = require('./routes/userRoute');
const app = express();


app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 5000;


app.use((req,res,next)=>{
  res.status(404).json({
    message:"Not found"
  })
})

app.use(errorHandlerMiddleare);
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