const express = require('express'),
      logResponseTime = require('./controllers/util/response-time-logger'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server),
      
      
      bodyParser = require('body-parser'),
      cors = require('cors'),
      methodOverride = require('method-override'),
      moment = require('moment'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      multer = require('multer'),
      parser = require('parser'),
      request = require('request-promise-cache'),
      path = require('path'),
      dotenv = require('dotenv').config(),
      promise = require('promise'),
      expressWs = require('express-ws')(app);
      
app.use(logResponseTime);
      
const port = process.env.PORT;
      
app.set('socketio', io);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(process.env.DB)

//routes
const api_deliveryRoutes = require('./routes/api/delivery.js'),
      api_employmentRoutes = require('./routes/api/employment'),
      api_indexRoutes = require('./routes/api/index'),
      api_locationsRoutes = require('./routes/api/locations'),
      api_menuRoutes = require('./routes/api/menu'),
      api_ingredientRoutes = require('./routes/api/ingredients');


app.use('/delivery', api_deliveryRoutes);
app.use('/employment', api_employmentRoutes);
app.use('/', api_indexRoutes);
app.use('/location', api_locationsRoutes);
app.use('/menu', api_menuRoutes);
app.use('/ingredients', api_ingredientRoutes);

//Express Middleware
app.use(morgan('dev'));







module.exports = app;

app.start = app.listen = function(){
    return server.listen.apply(server, arguments)
}

app.start(process.env.PORT, () => {
    console.log('PL API V2 has started')
})