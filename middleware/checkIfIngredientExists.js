import res from "express/lib/response";
const { Ingredient } = require("../models/ingredient");

export async function checkIfIngredientExists(ingredients) {
    for (const item of ingredients) {
        const ingredient = await Ingredient.findById(item.ingredient);
        if (!ingredient) {
            return res.status(400).json({message: `Ingredient with ID ${item.ingredient} not found`});
        }
    }
}