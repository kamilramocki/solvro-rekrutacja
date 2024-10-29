const { Ingredient } = require('../models/ingredient');

const validateIngredients = async (req, res, next) => {
    try {
        const { ingredients } = req.body;

        for (const item of ingredients) {
            const ingredient = await Ingredient.findById(item.ingredient);
            if (!ingredient) {
                return res.status(400).json({ message: `Ingredient with ID ${item.ingredient} not found` });
            }
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = validateIngredients;