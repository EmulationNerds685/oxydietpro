export const distributeMeals = (totalCalories, macros, mealsPerDay) => {
  let distribution;
  let mealNames;

  const mealCount = Number(mealsPerDay);

  if (mealCount === 3) {
    distribution = [0.35, 0.35, 0.30];
    mealNames = ["Breakfast", "Lunch", "Dinner"];
  } else if (mealCount === 4) {
    distribution = [0.3, 0.3, 0.2, 0.2];
    mealNames = ["Breakfast", "Lunch", "Snack", "Dinner"];
  } else if (mealCount === 5) {
    distribution = [0.25, 0.3, 0.15, 0.15, 0.15];
    mealNames = ["Breakfast", "Lunch", "Pre-Workout", "Snack", "Dinner"];
  } else {
    throw new Error(`Unsupported meal count: ${mealsPerDay}`);
  }

  const meals = distribution.map((ratio, index) => {
    const mealCalories = Math.round(totalCalories * ratio);

    let protein = Math.round(macros.protein * ratio);
    let carbs = Math.round(macros.carbs * ratio);
    let fats = Math.round(macros.fats * ratio);

    // ======================================
    // 🔥 SAFETY RULES
    // ======================================

    if (carbs < 20) carbs = 20;
    if (protein < 15) protein = 15;
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