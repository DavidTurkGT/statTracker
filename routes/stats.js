const express         = require('express');
const router          = express.Router();
////////////////////////////////////////////////////////////////////////////////

//Routes
router.get('/:id', (req, res) => {
  //Remove tracked data for a day.
  res.status(200).send("Remove tracked data for a day.");
});

//Export routes
module.exports = router;
