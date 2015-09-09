/*========================================
              REQUIREMENtS
========================================*/
var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    session = require('express-session'),
    path = require('path'),
    ejs = require('ejs'),
    keygen = require('keygenerator'),
    methodOverride = require('method-override'),
    app = express();

// use ejs
app.set('view engine', 'ejs');
// use method over-ride
app.use(methodOverride('_method'));
// use body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));
    
// create the session
app.use(
  session({
    // use keygen to generate a secret key for us
    secret: keygen._({specials: true}),
    resave: false,
    saveUninitialized: true
  })
);

// extending the `req` object to help manage sessions
app.use(function (req, res, next) {
  // login a user
  req.login = function (user) {
    req.session.userId = user._id;
  };
  // find the current user
  req.currentUser = function (cb) {
    db.User.
      findOne({ _id: req.session.userId },
      function (err, user) {
        req.user = user;
        cb(null, user);
      })
  };
  // logout the current user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }
  // call the next middleware in the stack
  next(); 
});

/*========================================
              ROUTES
========================================*/

app.get("/main", function(req, res) {
res.render("pages/main")
});

// login route
app.get("/login", function (req, res) {
  // send the login page
  res.render("pages/login");
});

// signup route
app.get(["/", "/signup"], function (req, res) {
  res.render("pages/signup");
});

// where the user submits the sign-up form
app.post(["/users", "/signup"], function signup(req, res) {
  // grab the user from the params
  var user = req.body.user;
  // pull out their information
  var firstName = user.firstName;
  var lastName = user.lastName;
  var userName = user.userName;
  var password = user.password;
  var about = user.about;
  // create the new user
  db.User.createSecure(firstName, lastName, userName, password, about, function(err, user) {
    if (err) {return console.log(err);}
    req.login(user);
    res.redirect("/profile"); 
  });
});

// where the user submits the login form
app.post(["/sessions", "/login"], function login(req, res) {
  var user = req.body.user;
  var userName = user.userName;
  var password = user.password;
  console.log(userName);

  db.User.authenticate(userName, password, function (err, user) {
    if (err) {return console.log(err);}
    // login the user
    req.login(user);
    console.log(req.session);
    // redirect to user profile
    res.redirect("/profile"); 
  });
});

// show the current user
app.get("/profile", function userShow(req, res) {
  req.currentUser(function (err, currentUser) {
    if (currentUser === null) {
      res.redirect("/signup")
    } else {
      res.render("pages/profile", {user: currentUser});
    }
  })
});

// logout the user
app.delete(["/sessions", "/logout"], function(req, res) {
  req.logout();
  res.redirect("/login");
});

var listener = app.listen(3000, function () {
  console.log("ALL systems online on port " + listener.address().port);
});
