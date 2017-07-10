const express         = require('express');
const bodyParser      = require('body-parser');
const validator       = require('express-validator');
const morgan          = require('morgan');
const router          = require('./routes');

////////////////////////////////////////////////////////////////////////////////
const app = express();

//BodyParser
app.use( bodyParser.urlencoded( {extended: true} ) );
app.use( bodyParser.json() );
app.use( validator() );

//Morgan
app.use( morgan('dev') );



//Set the port
app.set('port', (process.env.PORT || 3000) );

//Bring in routes
app.use(router);

//Set up listener
app.listen(app.get('port'), () =>
  console.log("App listening on port ", app.get('port') ) );
