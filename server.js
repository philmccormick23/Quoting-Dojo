var express = require("express");
console.log("Let's find out what express is", express);
// invoke express and store the result in the variable app
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(bodyParser.urlencoded({ extended: true }));
const flash = require('express-flash');
app.use(flash());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quoting_dojo', { useNewUrlParser: true });

var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2},
    quote: {type: String, required: true, minlength: 2},
}, { timestamps: true });

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

app.get('/', function (req, res) {

    res.render("index");
});

app.post('/newQuote', function (req, res) {
    const quote = new Quote({name: req.body.name, quote: req.body.quote});
    quote.save(function(err){
        if(err) {
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/');
        } 
        else { 
            res.redirect('/quotes');
        }
        
        }); 
});

app.get('/quotes', function(req, res){
    console.log("Getting Quotes Page...")
    Quote.find({}, function(err, quotes){
        if(err){
            console.log("There was an error with db...")
            res.render('index');
            }
        else {
            res.render('quotes', {quotes: quotes});
        }
    });
})

// tell the express app to listen on port 8000, always put this at the end of your server.js file
app.listen(8000, function () {
    console.log("listening on port 8000");
})
