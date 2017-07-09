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

//Middleware
function validateActivity (req, res, next){
  req.checkBody("name","Activity name cannot be empty").notEmpty();
  req.checkBody("statistic","Activity statistic cannot be empty").notEmpty();

  let errors = req.validationErrors();
  if(errors){
    let msgs = [];
    errors.forEach( (err) => msgs.push(err.msg + "\n") );
    console.log("Messages: ", msgs);
    res.status(400).send("Invalid request body: \n" + msgs);
  }
  else next()

}

function validateStat (req, res, next){
  if(!req.body.stat) res.status(400).send("Invalid request body. Stat must not be empty");
  else if( Number(req.body.stat) ) next();
  else res.status(400).send("Invalid request body. Stat must be a number");
}

//Routes
//TODO: add authentication
router.get('/', (req, res) => {
  res.status(200).send("API documentation!");
})

router.get('/activities', async (req, res) => {
  //Show a list of all activities I am tracking, and links to their individual pages
  let activities = await Activity.find()
    .catch( (err) => res.status(500).send("Internal server error"));
  res.setHeader('Content-Type','application/json');
  res.status(200).json(activities);
});

router.post('/activities', validateActivity, async (req, res) => {
  //Create a new activity for me to track.
  console.log("Body received: ", req.body);
  let newActivity = new Activity({
    name: req.body.name,
    statistic: req.body.statistic,
    values: []
  });
  await newActivity.save()
    .catch( (err) => res.status(500).send("Internal server error"));
  res.status(200).send("New activity: " + newActivity.name + " created");
});

router.get('/activities/:id', async (req, res) => {
  //Show information about one activity I am tracking, and give me the data I have recorded for that activity.
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: activity not found");
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(activity);
});

router.put('/activities/:id', async (req, res) => {
  //Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: activity not found")
  let oldName = activity.name;
  let oldStat = activity.statistic;
  activity.name      = req.body.name || oldName;
  activity.statistic = req.body.statistic || oldStat;
  activity = await activity.save()
    .catch( (err) => res.status(500).send("Internal server error") )
  if(oldName === activity.name && oldStat === activity.statistic){
    res.status(304).send("No body sent. Nothing to update!");
  }
  else{
    res.status(200).send("Successfully updated " + oldName + " to " + activity.name);
  }
});

router.delete('/activities/:id', async (req, res) => {
  //Delete one activity I am tracking. This should remove tracked data for that activity as well.
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: acitivity not found");
  activity.remove()
  .then( (activity) => res.status(200).send("Activity " + activity.name + " deleted") )
  .catch( (err) => res.status(500).send("Internal server error") );
});

router.post('/activities/:id/stats', validateStat, async (req, res) => {
  //Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
  //TODO: body validation for posted stat
  let activity = await Activity.findById(req.params.id)
    .catch( (err) => res.status(400).send("Error: bad ID") );
  if(!activity) res.status(404).send("Error: no activity found");
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

router.delete('/stats/:id', async (req, res) => {
  //Remove tracked data for a day.
  let activity = await Activity.findOne({
    values: {$elemMatch: { _id: req.params.id}}
  })
  .catch( (err) => { res.status(400).send("Error: bad ID")});
  console.log("Activity found: ", activity);
  if(!activity) res.status(404).send("Error: no stat match")
  for(let i = 0; i < activity.values.length; i++){
    console.log("Value id: ", activity.values[i].id);
    console.log("ID received: ", req.params.id);
    if( activity.values[i].id === req.params.id){
      console.log("Match found!");
      let gone = activity.values.splice(i,1);
      console.log("Item removed: ", gone);
    }
  }
  console.log("Values now: ", activity.values);
  activity = await activity.save()
    .catch( (err) => res.status(500).send("Internal server error"));
  res.status(200).send("Successfully removed stat with the id: " + req.params.id);
});

//Export router
module.exports = router;
