const express = require('express');
const { Cocktail } = require('../models/cocktail');
const { Ingredient } = require('../models/ingredient');
const cocktailRouter = express.Router();

cocktailRouter.post('/add', async (req, res) => {
    try {
        const { name, category, instruction, ingredients } = req.body;

        for (const item of ingredients) {
            const ingredientExists = await Ingredient.findById(item.ingredient);
            if (!ingredientExists) {
                return res.status(400).json({ message: `Ingredient with ID ${item.ingredient} not found` });
            }
        }

        const cocktail = await Cocktail.create({
            name,
            category,
            instruction,
            ingredients
        });

        res.json({ cocktail });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cocktailRouter.post('/edit/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const { name, category, instruction, ingredients } = req.body;

        const cocktail = await Cocktail.findOne({ _id });
        if (!cocktail) {
            return res.status(404).json({ message: 'Cocktail not found' });
        }

        cocktail.name = name || cocktail.name;
        cocktail.category = category || cocktail.category;
        cocktail.instruction = instruction || cocktail.instruction;

        for (const item of ingredients) {
            const ingredientExists = await Ingredient.findById(item.ingredient);
            if (!ingredientExists) {
                return res.status(400).json({ message: `Ingredient with ID ${item.ingredient} not found` });
            }
        }
        cocktail.ingredients = ingredients || cocktail.ingredients;

        await cocktail.save();

        res.json({ cocktail });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cocktailRouter.get('/search/:_id', async (req, res) => {
    try {
        const { _id } = req.params;

        const cocktail = await Cocktail.findOne({ _id }).populate('ingredients.ingredient');
        if (!cocktail) {
            return res.status(404).json({ message: 'Cocktail not found' });
        }

        res.json(cocktail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cocktailRouter.get('/delete/:_id', async (req, res) => {
    try {
        const { _id } = req.params;

        const cocktail = await Cocktail.findOne({ _id });
        if (!cocktail) {
            return res.status(404).json({ message: 'Cocktail not found' });
        }

        await Cocktail.deleteOne({ _id });

        res.json({ message: 'Cocktail deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { cocktailRouter };