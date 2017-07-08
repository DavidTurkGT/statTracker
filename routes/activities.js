const express       = require('express');
const router        = express.Router();
////////////////////////////////////////////////////////////////////////////////

//Routes
router.get('/', (req, res) => {
  //Show a list of all activities I am tracking, and links to their individual pages
  res.status(200).send("Show a list of all activities I am tracking, and links to their individual pages");
});

router.post('/', (req, res) => {
  //Create a new activity for me to track.
  res.status(200).send("Create a new activity for me to track.");
});

router.get('/:id', (req, res) => {
  //Show information about one activity I am tracking, and give me the data I have recorded for that activity.
  res.status(200).send("Show information about one activity I am tracking, and give me the data I have recorded for that activity.");
});

router.put('/:id', (req, res) => {
  //Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
  res.status(200).send("Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.");
});

router.delete('/:id', (req, res) => {
  //Delete one activity I am tracking. This should remove tracked data for that activity as well.
  res.status(200).send("Delete one activity I am tracking. This should remove tracked data for that activity as well.");
});

router.post('/:id/stats', (req, res) => {
  //Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
  res.status(200).send("Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.");
});

//Export router
module.exports = router;
