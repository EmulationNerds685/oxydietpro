export const calculateMacros = (totalCalories, userData) => {
  const { weight, goal } = userData;

  let proteinPerKg;

  switch (goal.toLowerCase()) {
    case "muscle_gain":
      proteinPerKg = 1.8;
      break;

    case "fat_loss":
      proteinPerKg = 2;
      break;

    case "maintain":
      proteinPerKg = 1.6;
      break;

    default:
      throw new Error("Invalid goal type");
  }

  // 🥩 Protein
let protein = Math.round(weight * proteinPerKg);

// 🔥 Protein Safety Cap
if (userData.gender === "female" && protein > 130) {
  protein = 130;
}

if (userData.gender === "male" && protein > 180) {
  protein = 180;
}
  const proteinCalories = protein * 4;

  // 🥑 Fats (25% calories)
  const fatCalories = totalCalories * 0.25;
  const fats = Math.round(fatCalories / 9);

  // 🍚 Carbs (remaining calories)
  const remainingCalories = totalCalories - (proteinCalories + fatCalories);
  const carbs = Math.round(remainingCalories / 4);

  return {
    protein,
    carbs,
    fats,
  };
};