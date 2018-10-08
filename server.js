var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcrypt-as-promised');
// const someHash =  require('someHash');
// const saltRounds = 10;
// const myPlaintestPassword = 's0/\/\P4$$wOrD';
// const someOtherPlaintextPassword = 'not_bacon';


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1) 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(flash());
// bcrypt.hash('my password', 10)
//   .then(console.log, console.error);
// // bcrypt.compare('my password', someHash)
// //   .then(console.log, console.error); 
// // bcrypt.compare('invalid password', someHash)
// //   .then(handleValidPassword)
// //   .catch(bcrypt.MISMATCH_ERROR, handleInvalidPassword)
// //   .catch(handleOtherErrors);
// bcrypt.genSalt(10)
//   .then(console.log, console.error);
// bcrypt.getRounds(someHash)
//   .then(console.log, console.error);

mongoose.connect('mongodb://localhost/basic_mongoose');
var UserSchema = new mongoose.Schema({
    email: {type:String, required: true},
    first_name: {type:String, required: true},
    last_name: {type:String, required: true},
    password: {type:String, required: true},
    // birthday: {type: Date(), required: true}

}, {timestamps: true})
mongoose.model("User", UserSchema);
var User = mongoose.model('User');
mongoose.Promise = global.Promise;
User.find({}, (err, users)=>{
})
app.get('/', (req,res)=>{
    console.log("Getting Index Page...")
    res.render('index')
})
app.post('/users', (req, res)=>{
    var user = new User({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password});
    bcrypt.hash(req.body.password, 10)
    .then(hashed_password => {
        user.password = hashed_password
    })
    .catch(error => {
        console.log(err)
    });
    user.save(function(err){
        if(err){
            console.log("We have an error!", err);
        for(var key in err.errors){
            req.flash('registration', err.errors[key].message);
        }
            res.redirect('/');
        }
        else {
            
            res.redirect('/users');
        }
    });
});
app.post('/sessions', (req, res) => {
    console.log(" req.body: ", req.body);
    User.findOne({email:req.body.email, password: req.body.password}, (err, users) => {
        if (err) {
            console.log("There was an error with database")
            res.render('index', err);
        }
        else {
            console.log("User posted to Session")
    		req.session.id = user._id;
            req.session.email = user.email;
            res.redirect('/');
        }
    })
})
app.get('/users', (req, res)=>{
    res.render('users')
})
app.listen(8000, () =>{
    console.log("listening on port 8000")
})