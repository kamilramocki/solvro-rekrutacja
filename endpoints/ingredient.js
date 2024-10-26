const express = require('express');
const multer = require('multer');
const path = require('path');
const { Ingredient } = require('../models/ingredient');
const ingredientRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const { name } = req.body;
        cb(null, `${name}.png`.replaceAll(" ", "_"));
    }
});
const upload = multer({ storage: storage });

ingredientRouter.get('/search/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const ingredient = await Ingredient.findOne({ _id });

        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        const response = {
            name: ingredient.name,
            description: ingredient.description,
            isAlcohol: ingredient.isAlcohol,
            imagePath: ingredient.imagePath ? `/uploads/${path.basename(ingredient.imagePath)}` : null
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ingredientRouter.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, description, isAlcohol } = req.body;
        const imagePath = req.file ? `uploads/${req.file.filename}` : null;

        if (!imagePath) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const ingredient = await Ingredient.create({
            name, description, isAlcohol, imagePath
        });

        res.json({ ingredient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { ingredientRouter };