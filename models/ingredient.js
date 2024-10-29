const mongoose = require('mongoose');

const Ingredient = mongoose.model('Ingredient', {
    name: String,
    description: String,
    isAlcohol: Boolean,
    imagePath: String
});

module.exports = { Ingredient };