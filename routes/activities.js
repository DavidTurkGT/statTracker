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
  statistic: { type: String, required: true},
  values: [{
    stat: { type: Number, default: 1},
    date: { type: Date, default: new Date() }
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

router.get('/:id', async (req, res) => {
  //Show information about one activity I am tracking, and give me the data I have recorded for that activity.
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: activity not found");
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(activity);
});

router.put('/:id', async (req, res) => {
  //Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: activity not found")
  let oldName = activity.name;
  activity.name = req.body.name || oldName;
  activity = await activity.save()
    .catch( (err) => res.status(500).send("Internal server error") )
  if(oldName === activity.name){
    res.status(304).send("No body sent. Nothing to update!");
  }
  res.status(200).send("Successfully updated " + oldName + " to " + activity.name);
});

router.delete('/:id', async (req, res) => {
  //Delete one activity I am tracking. This should remove tracked data for that activity as well.
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: acitivity not found");
  activity.remove()
  .then( (activity) => res.status(200).send("Activity " + activity.name + " deleted") )
  .catch( (err) => res.status(500).send("Internal server error") );
});

router.post('/:id/stats', async (req, res) => {
  //Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
  //TODO: body validation
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: no activity found");
  //TODO: find if date already matches something in the array and update
  req.body.date = req.body.date ? new Date(req.body.date) : new Date();
  let newStat = {
    stat: req.body.stat,
    date: new Date()
  };
  let match = false;
  activity.values.every( (element, index, array) => {
    if( element.date.getTime() === req.body.date.getTime() ){
      array[index].stat = newStat.stat;
      match = true;
    }
  });
  if(!match){
    activity.values.push(newStat);
  }
  activity = await activity.save()
  .catch( (err) => res.status(500).send("Internal server error") );
  res.status(200).send("Successfully updated activity: " + activity.name + " with the statistic of: " + newStat.stat);
});

//Export router
module.exports = router;
