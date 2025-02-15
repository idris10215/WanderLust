if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn, isOwner, isReviewAuthor } = require("./middleware.js");
const { savedRedirectUrl } = require("./middleware");
const listingController = require("./controllers/listings");
const reviewController = require("./controllers/reviews");
const userController = require("./controllers/users");
const multer  = require('multer');
const {storage} = require("./cloudConfig.js");

const upload = multer({ storage });

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.engine('ejs', ejsMate);

const dbUrl = process.env.ATLASDB_URL;

main().then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


const sessionOptions = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookies: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// app.get("/" , (req,res) => {
//     res.render('home');
// });

app.use(session(sessionOptions));
app.use(flash());   


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.listen(port, () => {    
    console.log(`Server is running on port ${port}`);
});


app.route('/listings')
    .get(listingController.index)
    //validateListing should be done
    .post(isLoggedIn,upload.single('listing[image]'), listingController.createListing);



app.get('/listings/new', isLoggedIn, listingController.renderNewForm);


app.route('/listings/:id')
    .get(listingController.showListing)
    //validateListing should be done for put
    .put(isLoggedIn, isOwner, listingController.updateListing)
    .delete(isLoggedIn, isOwner, upload.single('listing[image]'), listingController.destroyListing);


// Edit Route
app.get('/listings/:id/edit', isLoggedIn, isOwner, listingController.renderEditForm);



//Reviews
// Post route
app.post("/listings/:id/review", isLoggedIn, reviewController.createReview); 

//Delete route
app.delete("/listings/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);




//Register
app.route("/signup")
    .get(userController.renderSignup)
    .post(userController.signup);



//Login
app.route("/login")
    .get( userController.renderLogin)
    .post( savedRedirectUrl , passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), userController.login)



//Logout    
app.get("/logout", userController.logout);
 