const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config({path:'./.env'});
const ussdRoutes = require('./routes/ussd');
const validateUser = require('./middlewares/validateUser');
const port = process.env.PORT || 3000;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('*',validateUser,ussdRoutes);

app.listen(port,()=>{
    console.log('Server is listening on ',port);
});


