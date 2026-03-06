const ALLOWED_GENDERS = ["male", "female"];
const ALLOWED_GOALS = ["muscle_gain", "fat_loss", "maintain"];
const ALLOWED_ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "heavy", "athlete"];
const ALLOWED_DIET_TYPES = ["veg", "nonveg"];
const ALLOWED_MEALS_PER_DAY = [3, 4, 5];

export const validateDietInput = (body) => {
    const errors = [];

    // --- Name ---
    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
        errors.push({ field: "name", message: "Name is required" });
    } else if (body.name.trim().length > 100) {
        errors.push({ field: "name", message: "Name must be under 100 characters" });
    }

    // --- Age ---
    const age = Number(body.age);
    if (!body.age || isNaN(age)) {
        errors.push({ field: "age", message: "Age is required and must be a number" });
    } else if (age < 10 || age > 80) {
        errors.push({ field: "age", message: "Age must be between 10 and 80" });
    }

    // --- Gender ---
    if (!body.gender || !ALLOWED_GENDERS.includes(body.gender.toLowerCase())) {
        errors.push({ field: "gender", message: `Gender must be one of: ${ALLOWED_GENDERS.join(", ")}` });
    }

    // --- Height ---
    const height = Number(body.height);
    if (!body.height || isNaN(height)) {
        errors.push({ field: "height", message: "Height is required and must be a number" });
    } else if (height < 1 || height > 250) {
        errors.push({ field: "height", message: "Height must be between 1 (feet) and 250 (cm)" });
    }

    // --- Weight ---
    const weight = Number(body.weight);
    if (!body.weight || isNaN(weight)) {
        errors.push({ field: "weight", message: "Weight is required and must be a number" });
    } else if (weight < 20 || weight > 300) {
        errors.push({ field: "weight", message: "Weight must be between 20 and 300 kg" });
    }

    // --- Goal ---
    if (!body.goal || !ALLOWED_GOALS.includes(body.goal.toLowerCase())) {
        errors.push({ field: "goal", message: `Goal must be one of: ${ALLOWED_GOALS.join(", ")}` });
    }

    // --- Activity Level ---
    if (!body.activityLevel || !ALLOWED_ACTIVITY_LEVELS.includes(body.activityLevel.toLowerCase())) {
        errors.push({ field: "activityLevel", message: `Activity level must be one of: ${ALLOWED_ACTIVITY_LEVELS.join(", ")}` });
    }

    // --- Diet Type ---
    if (!body.dietType || !ALLOWED_DIET_TYPES.includes(body.dietType.toLowerCase())) {
        errors.push({ field: "dietType", message: `Diet type must be one of: ${ALLOWED_DIET_TYPES.join(", ")}` });
    }

    // --- Meals Per Day ---
    const mealsPerDay = Number(body.mealsPerDay);
    if (!body.mealsPerDay || isNaN(mealsPerDay)) {
        errors.push({ field: "mealsPerDay", message: "Meals per day is required and must be a number" });
    } else if (!ALLOWED_MEALS_PER_DAY.includes(mealsPerDay)) {
        errors.push({ field: "mealsPerDay", message: `Meals per day must be one of: ${ALLOWED_MEALS_PER_DAY.join(", ")}` });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
