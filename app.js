var express = require('express')
var app = express()
var mysql = require('mysql')
var myConnection  = require('express-myconnection')
var index = require('./routes/index')  //Index.js
var blog = require('./routes/blog') //blog.js
var expressValidator = require('express-validator')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
//Database Setup
var config = require('./config')
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port,
    database: config.database.db
}

app.use(myConnection(mysql, dbOptions, 'pool'))
app.use(expressValidator())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(cookieParser('keyboard cat'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())

//Routes
app.use('/', index)
app.use('/blog', blog)
app.use(express.static(__dirname + '/public/'));

//Server Connection
app.listen(3000, function(){
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})
//Set Engine to Embedded Java
app.set('view engine', 'ejs')
