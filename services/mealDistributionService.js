export const distributeMeals = (totalCalories, macros, mealsPerDay) => {
  let distribution;
  let mealNames;

  // Convert to number to ensure the check doesn't fail due to type mismatch
  const mealCount = Number(mealsPerDay);

  if (mealCount === 4) {
    distribution = [0.3, 0.3, 0.2, 0.2];
    mealNames = ["Breakfast", "Lunch", "Snack", "Dinner"];
  } else if (mealCount === 5) {
    distribution = [0.25, 0.3, 0.15, 0.15, 0.15];
    mealNames = ["Breakfast", "Lunch", "Pre-Workout", "Snack", "Dinner"];
  } else {
    // This is where your error is currently coming from
    throw new Error(`Unsupported meal count: ${mealsPerDay}`);
  }

  const meals = distribution.map((ratio, index) => {
    const mealCalories = Math.round(totalCalories * ratio);

    // 🔥 Macro Split
    let protein = Math.round(macros.protein * ratio);
    let carbs = Math.round(macros.carbs * ratio);
    let fats = Math.round(macros.fats * ratio);

    // ======================================
    // 🔥 SAFETY RULES (Very Important)
    // ======================================

    // Minimum carbs per meal (avoid extreme low carb meal)
    if (carbs < 20) carbs = 20;

    // Minimum protein per meal (avoid 5g protein meal)
    if (protein < 15) protein = 15;

    // Minimum fats
    if (fats < 5) fats = 5;

    return {
      mealName: mealNames[index],
      calories: mealCalories,
      protein,
      carbs,
      fats,
    };
  });

  return meals;
};