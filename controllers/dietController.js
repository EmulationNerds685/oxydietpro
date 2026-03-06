import {
  calculateBMR,
  calculateTDEE,
  adjustCaloriesByGoal,
} from "../services/calorieService.js";

import { calculateMacros } from "../services/macroService.js";
import { distributeMeals } from "../services/mealDistributionService.js";
import { buildMeals } from "../services/mealBuilderService.js";


// Convert height to cm if given in feet
const convertHeightToCm = (height) => {
  if (height > 100) return height;
  return Math.round(height * 30.48);
};


export const generateDiet = async (req, res) => {
  try {
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

    // 🔹 Basic Validation
    if (
      !name ||
      !age ||
      !gender ||
      !height ||
      !weight ||
      !goal ||
      !activityLevel ||
      !dietType ||
      !mealsPerDay
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const heightInCm = convertHeightToCm(height);

    const userData = {
      age,
      gender,
      height: heightInCm,
      weight,
      goal,
      activityLevel,
    };

    // =========================
    // CALORIE CALCULATION
    // =========================

    const bmr = calculateBMR(userData);
    const tdee = calculateTDEE(bmr, activityLevel);

    let totalCalories = Math.round(
      adjustCaloriesByGoal(tdee, goal)
    );

    // 🔥 Safety calorie floor
    if (gender.toLowerCase() === "female" && totalCalories < 1400) {
      totalCalories = 1400;
    }

    if (gender.toLowerCase() === "male" && totalCalories < 1600) {
      totalCalories = 1600;
    }

    // =========================
    // MACROS
    // =========================

    const macros = calculateMacros(totalCalories, {
      weight,
      goal,
      gender,
    });

    // =========================
    // MEAL DISTRIBUTION
    // =========================

    const mealTargets = distributeMeals(
      totalCalories,
      macros,
      mealsPerDay
    );

    // =========================
    // BUILD MEALS
    // =========================

    const meals = buildMeals(mealTargets, dietType);

    // =========================
    // FINAL RESPONSE
    // =========================

    const finalDiet = {
      name,
      totalCalories,
      macros,
      meals,
    };

    return res.json(finalDiet);

  } catch (error) {
    console.error("Diet Generation Error:", error.message);

    return res.status(500).json({
      message: "Failed to generate diet plan",
    });
  }
};