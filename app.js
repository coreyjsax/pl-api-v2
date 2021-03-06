const express = require('express'),
      logResponseTime = require('./controllers/util/response-time-logger'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      fileType = require('file-type'),
      jwt = require('jsonwebtoken'),
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
      passport = require('passport'),
      GoogleStrategy = require('passport-google-oauth-jwt').GoogleOauthJWTStrategy,
      expressValidator = require('express-validator'),
      agp = require('api-query-params'),
      helmet = require('helmet'),
      express_enforces_ssl = require('express-enforces-ssl'),
      expressWs = require('express-ws')(app);
 
require('./passport');     


mongoose.Promise = global.Promise;
      
app.use(logResponseTime);
      
const port = process.env.PORT;

app.use(passport.initialize());
      
app.set('socketio', io);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(helmet({ dnsPrefetchControl: { allow: true }}))

app.use(methodOverride("_method"));
app.use(expressValidator({
    
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + "/public"));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.DB)

app.enable('trust proxy');

app.use(express_enforces_ssl());

//routes
const //api routes
      api_deliveryRoutes = require('./routes/api/delivery.js'),
      api_employmentRoutes = require('./routes/api/employment'),
      api_indexRoutes = require('./routes/api/index'),
      api_locationsRoutes = require('./routes/api/locations'),
      api_menuRoutes = require('./routes/api/menu'),
      api_ingredientRoutes = require('./routes/api/ingredients'),
      api_itemRoutes = require('./routes/api/items'),
      api_categoryRoutes = require('./routes/api/category'),
      api_sectionRoutes = require('./routes/api/section'),
      //menu board routes
      menuBoardRoutes = require('./routes/menu_boards'),
      //admin panel routes
      admin_panel_index_routes = require('./routes/admin_panel/index'),
      admin_panel_menu_routes = require('./routes/admin_panel/menu'),
      admin_panel_location_routes = require('./routes/admin_panel/location'),
      //auth routes
      auth_routes = require('./routes/auth/auth'),
      //module routes
      untappd_routes = require('./modules/print_menus/routes/untappd'),
      
      user_routes = require('./routes/user');


app.use('/delivery', api_deliveryRoutes);
app.use('/employment', api_employmentRoutes);
app.use('/', api_indexRoutes);
app.use('/location', api_locationsRoutes);
app.use('/menu', api_menuRoutes);
app.use('/ingredients', api_ingredientRoutes);
app.use('/items', api_itemRoutes);
app.use('/category', api_categoryRoutes);
app.use('/admin', admin_panel_index_routes);
app.use('/admin-menu', admin_panel_menu_routes);
app.use('/admin-location', admin_panel_location_routes);
app.use('/auth', auth_routes);
app.use('/user', /*passport.authenticate('jwt', {session: false}),*/ user_routes);
app.use('/section', api_sectionRoutes)
app.use('/boards', menuBoardRoutes);

app.use('/untappd', untappd_routes);

//Express Middleware
app.use(morgan('dev'));







module.exports = app;

app.start = app.listen = function(){
    return server.listen.apply(server, arguments)
}

app.start(process.env.PORT, () => {
    console.log('PL API V2 has started')
})