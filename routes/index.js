const express       = require('express');
const router        = express.Router();
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
////////////////////////////////////////////////////////////////////////////////

//Set up Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/stats');
mongoose.Promise = require('bluebird');

//Schemas

//Routes
router.get('/', (req, res) => {
  res.send("Routes are connected!");
});

//Export router
module.exports = router;
