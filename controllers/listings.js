const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    let allListings = await Listing.find({});
    res.render('index', {listings: allListings});
}

module.exports.renderNewForm =  (req,res) => {
    res.render('new');
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Cannot find that listing");
        return res.redirect('/listings');
    }
    res.render('show', {list: listing});
}

module.exports.createListing = async (req,res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1, 
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url, filename};
    listing.geometry = response.body.features[0].geometry;
    let savedListing = await listing.save();
    req.flash("success", "Successfully added a new listing");
    res.redirect('/listings');
}


module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing");
        return res.redirect('/listings');
    }
    res.render("edit", {list: listing });
}


module.exports.updateListing = async (req,res) => {
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.list});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${Listing._id}`);
}


module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}