const express         = require('express');
const router          = express.Router();
////////////////////////////////////////////////////////////////////////////////

//Routes
router.delete('/:id', (req, res) => {
  //TODO: Remove tracked data for a day.
  res.status(200).send("Remove tracked data for a day.");
});

//Export routes
module.exports = router;
