const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.postNew = async (req, res) => {
  const campground = await Campground.findById(req.params.campgroundId);

  if (!campground) {
    req.flash('error', 'No campground was found with the ID provided.');
    return res.redirect('/campgrounds');
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Review added successfully!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
  const { campgroundId, reviewId } = req.params;
  await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted succesfully');
  res.redirect(`/campgrounds/${campgroundId}`);
}
