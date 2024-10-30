const express = require('express');
const { Cocktail } = require('../models/cocktail');
const validateIngredients = require('../middleware/validateIngredients');
const { createImagePath } = require('../middleware/createImagePath');
const cocktailRouter = express.Router();

cocktailRouter.post('/', validateIngredients, async (req, res) => {
    try {
        const { name, category, instruction, ingredients } = req.body;

        const cocktail = await Cocktail.create({
            name,
            category,
            instruction,
            ingredients
        });

        res.json(cocktail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cocktailRouter.get('/', async (req, res) => {
    try {
        const { cocktailName, ingredientName } = req.query; // Odczytujemy oba parametry

        // Tworzymy filtr
        let filter = {
            $or: [] // Używamy operatora $or do łączenia warunków
        };

        // Jeśli podano nazwę koktajlu
        if (cocktailName) {
            filter.$or.push({ name: { $regex: cocktailName, $options: 'i' } }); // Wyszukiwanie po nazwie koktajlu
        }

        // Jeśli podano nazwę składnika
        if (ingredientName) {
            // Wyszukiwanie składników
            filter.$or.push({ ingredients: { $elemMatch: { ingredient: { $regex: ingredientName, $options: 'i' } } } });
        }

        const cocktails = await Cocktail.find(filter).populate('ingredients.ingredient');
        res.json(cocktails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cocktailRouter.get('/:_id', async (req, res) => {
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

cocktailRouter.patch('/:_id', async (req, res) => {
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

        res.json( cocktail );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cocktailRouter.delete('/:_id', async (req, res) => {
    try {
        const { _id } = req.params;

        const cocktail = await Cocktail.findOne({ _id });
        if (!cocktail) {
            return res.status(404).json({ message: 'Cocktail not found' });
        }

        await Cocktail.deleteOne({ _id });

        res.json( cocktail );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { cocktailRouter };