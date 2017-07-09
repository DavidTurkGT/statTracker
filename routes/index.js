const express           = require('express');
const router            = express.Router();
const activityRouter    = require('./activities');
const statsRouter       = require('./stats');
////////////////////////////////////////////////////////////////////////////////

//Import specific routers
router.use('/api/', activityRouter);

//Routes
router.get('/', (req, res) => {
  res.redirect('/api');
});

//Export router
module.exports = router;
