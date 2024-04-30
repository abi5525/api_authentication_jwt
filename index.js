const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');

//IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// CONNECT DB
mongoose.connect(process.env.DB_CONNECT);

// Check if the connection is successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB database");
});

//MIDDLEWARES
app.use(express.json());



//ROUTE MIDDLEWARES
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(3000, ()=> console.log(`server running `))