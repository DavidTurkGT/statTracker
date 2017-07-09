const express       = require('express');
const router        = express.Router();
const mongoose      = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stats');
mongoose.Promise    = require('bluebird');
const Schema        = mongoose.Schema;
////////////////////////////////////////////////////////////////////////////////
//Schemas
const activitySchema = new Schema({
  name: { type: String, required: true, unique: true},
  values: [{
    type: Number,
    default: 1
  }]
});
activitySchema.virtual('link').get( function(){
  return "/activities/"+this.id;
})

//Models
const Activity = mongoose.model("Activity", activitySchema);

//Routes
//TODO: add authentication
router.get('/', async (req, res) => {
  //Show a list of all activities I am tracking, and links to their individual pages
  let activities = await Activity.find()
    .catch( (err) => res.status(500).send("Internal server error"));
  res.setHeader('Content-Type','application/json');
  res.status(200).json(activities);
});

router.post('/', async (req, res) => {
  //Create a new activity for me to track.
  //TODO: validate data for a new acitivity
  console.log("Body received: ", req.body);
  let newActivity = new Activity({
    name: req.body.name,
    values: []
  });
  await newActivity.save()
    .catch( (err) => res.status(500).send("Internal server error"));
  res.status(200).send("New activity: " + newActivity.name + " created");
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
