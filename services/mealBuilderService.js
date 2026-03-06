import { foods } from "../data/foods.js";

// 🔥 Caps
const MAX_PROTEIN_GRAMS = 250;
const MIN_PROTEIN_GRAMS = 30;

const MAX_CARB_GRAMS = 300;
const MIN_CARB_GRAMS = 30;

const MAX_FAT_GRAMS = 25;
const MIN_FAT_GRAMS = 5;

export const buildMeals = (mealTargets, dietType) => {
  const availableFoods = foods.filter(
    (food) => food.dietType === dietType
  );

  if (!availableFoods.length) {
    throw new Error("No foods available for selected diet type");
  }

  const usedFoods = new Set(); // 🔥 Repetition control

  const meals = mealTargets.map((target) => {
    const mealItems = [];
    const mealKey = target.mealName.toLowerCase();

    // 🔹 Filter foods per meal type
   const proteinFoods = availableFoods.filter(
  f =>
    f.macroType === "protein" &&
    f.mealType.map(m => m.toLowerCase()).includes(mealKey)
);

const carbFoods = availableFoods.filter(
  f =>
    f.macroType === "carb" &&
    f.mealType.map(m => m.toLowerCase()).includes(mealKey)
);

const fatFoods = availableFoods.filter(
  f =>
    f.macroType === "fat" &&
    f.mealType.map(m => m.toLowerCase()).includes(mealKey)
);

    if (!proteinFoods.length || !carbFoods.length) {
      throw new Error(`Food missing for ${mealKey}`);
    }

    // ================================
    // 1️⃣ PROTEIN SELECTION
    // ================================
    let proteinFood = pickUniqueFood(proteinFoods, usedFoods);

    let proteinGrams =
      (target.protein / proteinFood.protein) * 100;

    proteinGrams = clamp(
      proteinGrams,
      MIN_PROTEIN_GRAMS,
      MAX_PROTEIN_GRAMS
    );

    const proteinItem = buildFoodItem(proteinFood, proteinGrams);
    mealItems.push(proteinItem);
    usedFoods.add(proteinFood.name);

    let remainingCalories =
      target.calories - proteinItem.calories;

    // ================================
    // 2️⃣ CARB SELECTION
    // ================================
    let carbFood = pickUniqueFood(carbFoods, usedFoods);

    let carbGrams =
      (remainingCalories / carbFood.caloriesPer100g) * 100;

    carbGrams = clamp(
      carbGrams,
      MIN_CARB_GRAMS,
      MAX_CARB_GRAMS
    );

    const carbItem = buildFoodItem(carbFood, carbGrams);
    mealItems.push(carbItem);
    usedFoods.add(carbFood.name);

    remainingCalories -= carbItem.calories;

    // ================================
    // 3️⃣ FAT ADJUSTMENT (Optional)
    // ================================
    if (fatFoods.length && target.fats > 10) {
      let fatFood = pickUniqueFood(fatFoods, usedFoods);

      let fatGrams =
        (target.fats / fatFood.fats) * 100;

      fatGrams = clamp(
        fatGrams,
        MIN_FAT_GRAMS,
        MAX_FAT_GRAMS
      );

      const fatItem = buildFoodItem(fatFood, fatGrams);
      mealItems.push(fatItem);
      usedFoods.add(fatFood.name);
    }

    return {
      mealName: target.mealName,
      items: mealItems,
    };
  });

  return meals;
};


// ========================================
// 🔹 Helper: Unique Food Picker
// ========================================
const pickUniqueFood = (foodArray, usedFoods) => {
  let filtered = foodArray.filter(
    f => !usedFoods.has(f.name)
  );

  if (!filtered.length) {
    // fallback if all used
    filtered = foodArray;
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
};


// ========================================
// 🔹 Helper: Build Food Item
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
// 🔹 Helper: Clamp Function
// ========================================
const clamp = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};