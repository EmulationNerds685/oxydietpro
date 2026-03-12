import { foods } from "../data/foods.js";
import { mealTemplates } from "./mealTemplates.js";

// 🔥 Caps
const MAX_PROTEIN_GRAMS = 250;
const MIN_PROTEIN_GRAMS = 30;

const MAX_CARB_GRAMS = 300;
const MIN_CARB_GRAMS = 30;

const MAX_FAT_GRAMS = 25;
const MIN_FAT_GRAMS = 5;

export const buildMeals = (mealTargets, dietType) => {

  const availableFoods = foods.filter(
    food => food.dietType.includes(dietType)
  );

  if (!availableFoods.length) {
    throw new Error("No foods available for selected diet type");
  }

  const usedFoods = new Set();

  const meals = mealTargets.map((target) => {

    const mealItems = [];
    const mealKey = target.mealName.toLowerCase();

    const templates = mealTemplates[mealKey];

    if (!templates) {
      throw new Error(`No meal template found for ${mealKey}`);
    }

    const template =
      templates[Math.floor(Math.random() * templates.length)];

    let remainingCalories = target.calories;

    for (const macro of template) {

      const macroFoods = availableFoods.filter(
        f =>
          f.macroType === macro &&
          f.mealType.map(m => m.toLowerCase()).includes(mealKey)
      );

      if (!macroFoods.length) continue;

      let selectedFood = pickUniqueFood(macroFoods, usedFoods);

      let grams = 100;

      if (macro === "protein") {
        grams = (target.protein / selectedFood.protein) * 100;
        grams = clamp(grams, MIN_PROTEIN_GRAMS, MAX_PROTEIN_GRAMS);
      }

      if (macro === "carb") {
        grams = (remainingCalories / selectedFood.caloriesPer100g) * 100;
        grams = clamp(grams, MIN_CARB_GRAMS, MAX_CARB_GRAMS);
      }

      if (macro === "fat") {
        grams = (target.fats / selectedFood.fats) * 100;
        grams = clamp(grams, MIN_FAT_GRAMS, MAX_FAT_GRAMS);
      }

      grams = applyServingLimits(selectedFood, grams);
      grams = Math.round(grams);

      const item = buildFoodItem(selectedFood, grams);

      mealItems.push(item);
      usedFoods.add(selectedFood.name);

      remainingCalories -= item.calories;
    }

    return {
      mealName: target.mealName,
      items: mealItems,
    };

  });

  return meals;

};


// ========================================
// 🔹 Weighted Random Selection
// ========================================
function weightedRandom(foods) {

  const totalWeight = foods.reduce(
    (sum, food) => sum + (food.priority || 1),
    0
  );

  let random = Math.random() * totalWeight;

  for (const food of foods) {

    random -= (food.priority || 1);

    if (random <= 0) {
      return food;
    }

  }

}


// ========================================
// 🔹 Unique Food Picker
// ========================================
const pickUniqueFood = (foodArray, usedFoods) => {

  let filtered = foodArray.filter(
    f => !usedFoods.has(f.name)
  );

  if (!filtered.length) {
    filtered = foodArray;
  }

  return weightedRandom(filtered);
};


// ========================================
// 🔹 Build Food Item
// ========================================
const buildFoodItem = (food, grams) => {

  const factor = grams / 100;

  return {
    name: food.name,
    grams: Math.round(grams),
    calories: Math.round(food.caloriesPer100g * factor),
    protein: Math.round(food.protein * factor),
    carbs: Math.round(food.carbs * factor),
    fats: Math.round(food.fats * factor),
  };

};


// ========================================
// 🔹 Clamp Helper
// ========================================
const clamp = (value, min, max) => {

  if (value < min) return min;
  if (value > max) return max;
  return value;

};


// ========================================
// 🔹 Serving Limits
// ========================================
const applyServingLimits = (food, grams) => {

  if (food.minServing && grams < food.minServing) {
    grams = food.minServing;
  }

  if (food.maxServing && grams > food.maxServing) {
    grams = food.maxServing;
  }

  return grams;

};