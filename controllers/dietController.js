import {
  calculateBMR,
  calculateTDEE,
  adjustCaloriesByGoal,
} from "../services/calorieService.js";

import { calculateMacros } from "../services/macroService.js";
import { distributeMeals } from "../services/mealDistributionService.js";
import { buildMeals } from "../services/mealBuilderService.js";
import { validateDietInput } from "../utils/validators.js";


// Convert height to cm if given in feet
const convertHeightToCm = (height) => {
  if (height > 100) return height;
  return Math.round(height * 30.48);
};


export const generateDiet = async (req, res) => {
  try {
    // 🔹 Input Validation
    const validation = validateDietInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const {
      name,
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
      dietType,
      mealsPerDay,
    } = req.body;

    const heightInCm = convertHeightToCm(Number(height));

    const userData = {
      age: Number(age),
      gender: gender.toLowerCase(),
      height: heightInCm,
      weight: Number(weight),
      goal: goal.toLowerCase(),
      activityLevel: activityLevel.toLowerCase(),
    };

    // =========================
    // CALORIE CALCULATION
    // =========================

    const bmr = calculateBMR(userData);
    const tdee = calculateTDEE(bmr, userData.activityLevel);

    let totalCalories = Math.round(
      adjustCaloriesByGoal(tdee, userData.goal)
    );

    // 🔥 Safety calorie floor
    if (userData.gender === "female" && totalCalories < 1400) {
      totalCalories = 1400;
    }

    if (userData.gender === "male" && totalCalories < 1600) {
      totalCalories = 1600;
    }

    // =========================
    // MACROS
    // =========================

    const macros = calculateMacros(totalCalories, {
      weight: userData.weight,
      goal: userData.goal,
      gender: userData.gender,
    });

    // =========================
    // MEAL DISTRIBUTION
    // =========================

    const mealTargets = distributeMeals(
      totalCalories,
      macros,
      Number(mealsPerDay)
    );

    // =========================
    // BUILD MEALS
    // =========================

    const meals = buildMeals(mealTargets, dietType.toLowerCase());

    // =========================
    // FINAL RESPONSE
    // =========================

    const finalDiet = {
      name: name.trim(),
      totalCalories,
      macros,
      meals,
    };

    return res.json({
      success: true,
      data: finalDiet,
    });

  } catch (error) {
    console.error("Diet Generation Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate diet plan",
      error: error.message,
    });
  }
};