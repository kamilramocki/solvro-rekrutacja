const mongoose = require('mongoose');

const Cocktail = mongoose.model('Cocktail', {
    name: String,
    category: String,
    instruction: String,
    ingredients: [{
        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        count: Number
    }],
});

module.exports = { Cocktail };