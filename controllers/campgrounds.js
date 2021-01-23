const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');

module.exports.getIndex = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.getNew = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.postNew = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = req.files.map(f => ({url: f.path, filename: f.filename }));
  await campground.save();
  
  req.flash('success', 'Successfully added a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.getDetails = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');

  if (!campground) {
    req.flash('error', 'No campground was found with the ID provided.');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/details', { campground });
};

module.exports.getEdit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground) {
    req.flash('error', 'No campground was found with the ID provided.');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/edit', { campground });
};

module.exports.putEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(f => ({url: f.path, filename: f.filename }));
    campground.images.push(...images);
    await campground.save();
  
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }

      const query = { $pull: { images: { filename: { $in: req.body.deleteImages }}}};
      await campground.updateOne(query);
    }
  
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
  
    for (let image of campground.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
  
    await Campground.findByIdAndDelete(campground._id);
  
    req.flash('success', 'Campground deleted successfully!');
    res.redirect('/campgrounds');
};
