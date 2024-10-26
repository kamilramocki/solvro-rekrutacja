const express = require('express');
const multer = require('multer');
const fs = require('fs');
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

ingredientRouter.post('/edit/:_id', upload.single('image'), async (req, res) => {
    try {
        const { _id } = req.params;
        const { name, description, isAlcohol } = req.body;

        const ingredient = await Ingredient.findOne({ _id });
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        ingredient.name = name || ingredient.name;
        ingredient.description = description || ingredient.description;
        ingredient.isAlcohol = isAlcohol !== undefined ? isAlcohol : ingredient.isAlcohol;

        if (req.file) {
            if (ingredient.imagePath) {
                const oldImagePath = path.join(__dirname, '..', ingredient.imagePath);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Failed to delete old image:', err);
                });
            }
            ingredient.imagePath = `uploads/${req.file.filename}`;
        }

        await ingredient.save();

        res.json({ ingredient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

ingredientRouter.get('/delete/:_id', async (req, res) => {
    try {
        const { _id } = req.params;

        const ingredient = await Ingredient.findOne({ _id });
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        if (ingredient.imagePath) {
            const imagePath = path.join(__dirname, '..', ingredient.imagePath);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        await Ingredient.deleteOne({ _id });

        res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { ingredientRouter };