const Joi = require("joi")

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null),
        propertyType : Joi.string().allow("",null),
        category : Joi.string().allow("",null),
        maxGuests : Joi.number().allow("",null),
        bedrooms : Joi.number().allow("",null),
        bathrooms : Joi.number().allow("",null),
        cleaningFee : Joi.number().allow("",null),
        serviceFee : Joi.number().allow("",null),
        cancellationPolicy : Joi.string().allow("",null),
        amenities : Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).allow(null),
        houseRulesText : Joi.string().allow("",null),
        accessibilityNotes : Joi.string().allow("",null),
        checkInInstructions : Joi.string().allow("",null),
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
})

module.exports.bookingSchema = Joi.object({
    checkIn : Joi.date().required(),
    checkOut : Joi.date().greater(Joi.ref('checkIn')).required(),
    guests : Joi.number().integer().min(1).required(),
})

module.exports.tripPlanSchema = Joi.object({
    destination : Joi.string().required(),
    totalBudget : Joi.number().min(500).required(),
    duration : Joi.number().integer().min(1).max(30).required(),
    travelers : Joi.number().integer().min(1).max(20).required(),
    interests : Joi.array().items(Joi.string().valid('adventure','culture','food','relaxation')).min(1).required(),
    sourceCity : Joi.string().allow("",null).optional(),
    transportPreference : Joi.string().valid('cheapest','fastest','no_preference').allow("",null).optional(),
    checkIn : Joi.date().allow("",null).optional(),
    checkOut : Joi.date().allow("",null).optional(),
    label : Joi.string().max(60).allow("",null).optional(),
})