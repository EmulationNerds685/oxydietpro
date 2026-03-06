import { activityMultipliers } from "../utils/activityMultipliers.js";

export const calculateBMR = ({ gender, weight, height, age }) => {
  if (gender.toLowerCase() === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultipliers[activityLevel.toLowerCase()];

  if (!multiplier) {
    throw new Error("Invalid activity level");
  }

  return bmr * multiplier;
};

export const adjustCaloriesByGoal = (tdee, goal) => {
  switch (goal.toLowerCase()) {
    case "muscle_gain":
      return tdee + 300;

    case "fat_loss":
      return tdee - 400;

    case "maintain":
      return tdee;

    default:
      throw new Error("Invalid goal type");
  }
};