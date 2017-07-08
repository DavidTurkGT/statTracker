const express           = require('express');
const router            = express.Router();
const activityRouter    = require('./activities');
const statsRouter       = require('./stats');
////////////////////////////////////////////////////////////////////////////////

//Import specific routers
router.use('/api/activities', activityRouter);
router.use('/api/stats', statsRouter);

//Routes
router.get('/', (req, res) => {
  res.redirect('/api');
});

router.get('/api', (req, res) => {
  res.status(200).send("API documentation!");
})

//Export router
module.exports = router;
