const Listing = require("./models/listing");
const Review = require("./models/review");
// const ExpressError = require("./ExpressError");
// const {listingSchema} = require("../schemas.js");


module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must login to add listings");
        return res.redirect("/login");
    } 
    next();
}

module.exports.savedRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing =  await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// module.exports.validateListing = (req, res, next) => {
//     const {error} = listingSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    }

    next();
}