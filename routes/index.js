const express       = require('express');
const router        = express.Router();
////////////////////////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
  res.send("Routes are connected!");
});

//Export router
module.exports = router;
