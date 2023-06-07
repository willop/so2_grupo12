var express = require('express')
const cors = require('cors');
require('dotenv').config();

var app = express();
app.use(cors());

app.use('/system', require('./routes/route.js'));

app.listen(4000, function(){
    console.log('Server run on port 4000');
});