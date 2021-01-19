const joi = require('joi');

module.exports.campgroundValidationSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        image: joi.string().required()
    }).required()
});

module.exports.reviewValidationSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(0).max(5),
    body: joi.string().required()
  }).required()
});
