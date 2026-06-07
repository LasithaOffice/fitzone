import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient, { aiApiClient } from '@/lib/apiClient';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Exercise {
  name: string;
  equipment: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  workoutName: string;
  durationMinutes: number;
  exercises: Exercise[];
}

export interface MealMacros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  name: string;        // e.g. "Breakfast"
  mealName: string;   // e.g. "Oats Power Bowl"
  items: string[];
  calories: number;
  macros: MealMacros;
}

export interface MealDay {
  day: string;
  meals: Meal[];
}

export interface MlOutputs {
  targetCalories: number;
  targetProteinG: number;
  weeklyVolumeSets: number;
  intensityLevel: number;
}

export interface SetCompletion {
  [setIndex: number]: boolean;
}

export interface ExerciseTracking {
  [exerciseName: string]: SetCompletion;
}

export interface WorkoutTracking {
  [dateKey: string]: ExerciseTracking;   // dateKey = "YYYY-MM-DD"
}

export interface MealTracking {
  [dateKey: string]: {
    [mealName: string]: boolean;
  };
}

export interface PlanState {
  mlOutputs: MlOutputs;
  workoutPlan: WorkoutDay[];
  mealPlan: MealDay[];
  workoutTracking: WorkoutTracking;
  mealTracking: MealTracking;
  loading: boolean;
  error: string | null;
}

// ─── Initial State with user's specific approved plan ─────────────────────────

const initialPlanData = {
  "mlOutputs": {
    "targetCalories": 3298,
    "targetProteinG": 188,
    "weeklyVolumeSets": 17,
    "intensityLevel": 2
  },
  "workoutPlan": [
    {
      "day": "Monday",
      "focus": "Chest",
      "workoutName": "Chest & Core Strength",
      "durationMinutes": 93,
      "exercises": [
        { "name": "Decline Bench Press", "equipment": "Barbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Cable Chest Fly", "equipment": "Cable", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Dumbbell Pullover", "equipment": "Dumbbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Plank", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Cable Crunch", "equipment": "Cable", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Hanging Leg Raise", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" }
      ]
    },
    {
      "day": "Tuesday",
      "focus": "Back",
      "workoutName": "Back & Core Power",
      "durationMinutes": 93,
      "exercises": [
        { "name": "Lat Pulldown", "equipment": "Cable", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Seated Cable Row", "equipment": "Cable", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Single-Arm Dumbbell Row", "equipment": "Dumbbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Russian Twist", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Ab Wheel Rollout", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Decline Sit-Up", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" }
      ]
    },
    {
      "day": "Wednesday",
      "focus": "Shoulders",
      "workoutName": "Shoulder Sculpt",
      "durationMinutes": 80,
      "exercises": [
        { "name": "Rear Delt Fly", "equipment": "Dumbbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Shrug", "equipment": "Dumbbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Pallof Press", "equipment": "Cable", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Dead Bug", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Mountain Climber", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" }
      ]
    },
    {
      "day": "Thursday",
      "focus": "Legs",
      "workoutName": "Leg Day",
      "durationMinutes": 93,
      "exercises": [
        { "name": "Standing Calf Raise", "equipment": "Machine", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Goblet Squat", "equipment": "Dumbbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Hip Thrust", "equipment": "Barbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Side Plank", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Plank", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Cable Crunch", "equipment": "Cable", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" }
      ]
    },
    {
      "day": "Friday",
      "focus": "Arms",
      "workoutName": "Arms & Core Blast",
      "durationMinutes": 93,
      "exercises": [
        { "name": "Overhead Tricep Extension", "equipment": "Dumbbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Concentration Curl", "equipment": "Dumbbell", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Cable Curl", "equipment": "Cable", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Hanging Leg Raise", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Russian Twist", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" },
        { "name": "Ab Wheel Rollout", "equipment": "Bodyweight", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "" }
      ]
    },
    {
      "day": "Saturday",
      "focus": "Rest / Active Recovery",
      "workoutName": "Rest Day",
      "durationMinutes": 0,
      "exercises": []
    },
    {
      "day": "Sunday",
      "focus": "Rest / Active Recovery",
      "workoutName": "Rest Day",
      "durationMinutes": 0,
      "exercises": []
    }
  ],
  "mealPlan": [
    {
      "day": "Monday",
      "meals": [
        { "name": "Breakfast", "mealName": "Oats Power Bowl", "items": ["Rolled oats (100g)", "Banana", "Whole eggs (3)", "Orange juice (200ml)"], "calories": 824, "macros": { "protein": 37.6, "carbs": 92.7, "fats": 22.9 } },
        { "name": "Lunch", "mealName": "Chicken & Sweet Potato", "items": ["Grilled chicken breast (200g)", "Sweet potato (150g)", "Mixed greens", "Olive oil dressing"], "calories": 1154, "macros": { "protein": 65.8, "carbs": 129.8, "fats": 32.1 } },
        { "name": "Dinner", "mealName": "Beef & Rice", "items": ["Lean beef mince (180g)", "Brown rice (100g)", "Stir-fried broccoli and peppers"], "calories": 989, "macros": { "protein": 56.4, "carbs": 111.3, "fats": 27.5 } },
        { "name": "Snack", "mealName": "Banana & Nut Butter", "items": ["Banana (large)", "[EXCLUDED - Dairy allergy] Peanut butter (30g)", "Rice cakes (2)"], "calories": 329, "macros": { "protein": 28.2, "carbs": 37.0, "fats": 9.1 } }
      ]
    },
    {
      "day": "Tuesday",
      "meals": [
        { "name": "Breakfast", "mealName": "Egg & Veggie Scramble", "items": ["Whole eggs (4)", "Sautéed mushrooms and spinach", "Whole grain toast (2 slices)", "Black coffee"], "calories": 824, "macros": { "protein": 37.6, "carbs": 92.7, "fats": 22.9 } },
        { "name": "Lunch", "mealName": "Turkey Rice Bowl", "items": ["Ground turkey (200g)", "White rice (120g)", "Roasted zucchini", "Hot sauce"], "calories": 1154, "macros": { "protein": 65.8, "carbs": 129.8, "fats": 32.1 } },
        { "name": "Dinner", "mealName": "Salmon & Quinoa", "items": ["Baked salmon fillet (180g)", "Quinoa (90g)", "Steamed asparagus", "Lemon wedge"], "calories": 989, "macros": { "protein": 56.4, "carbs": 111.3, "fats": 27.5 } },
        { "name": "Snack", "mealName": "Protein Fruit Mix", "items": ["Mixed berries (100g)", "[EXCLUDED - Dairy allergy] Cottage cheese (150g)", "Honey (1 tsp)"], "calories": 329, "macros": { "protein": 28.2, "carbs": 37.0, "fats": 9.1 } }
      ]
    },
    {
      "day": "Wednesday",
      "meals": [
        { "name": "Breakfast", "mealName": "High-Protein Pancakes", "items": ["Oat flour pancakes (3)", "Blueberries", "Maple syrup (1 tbsp)", "Boiled eggs (2)"], "calories": 824, "macros": { "protein": 37.6, "carbs": 92.7, "fats": 22.9 } },
        { "name": "Lunch", "mealName": "Tuna Pasta", "items": ["Canned tuna (180g)", "Whole wheat pasta (100g dry)", "Cherry tomatoes", "Olive oil", "Basil"], "calories": 1154, "macros": { "protein": 65.8, "carbs": 129.8, "fats": 32.1 } },
        { "name": "Dinner", "mealName": "Chicken Stir Fry", "items": ["Chicken thigh (200g)", "Brown rice (100g)", "Stir-fried mixed vegetables", "Sesame oil", "[EXCLUDED - Soy allergy] Soy sauce"], "calories": 989, "macros": { "protein": 56.4, "carbs": 111.3, "fats": 27.5 } },
        { "name": "Snack", "mealName": "Rice & Almond Butter", "items": ["Rice cakes (3)", "[EXCLUDED - Dairy allergy] Almond butter (25g)", "Apple slices"], "calories": 329, "macros": { "protein": 28.2, "carbs": 37.0, "fats": 9.1 } }
      ]
    },
    {
      "day": "Thursday",
      "meals": [
        { "name": "Breakfast", "mealName": "Avocado Egg Toast", "items": ["Sourdough toast (2 slices)", "Avocado (half)", "Poached eggs (2)", "Chilli flakes", "Black coffee"], "calories": 824, "macros": { "protein": 37.6, "carbs": 92.7, "fats": 22.9 } },
        { "name": "Lunch", "mealName": "Beef & Veggie Bowl", "items": ["Sirloin steak strips (180g)", "Roasted sweet potato (150g)", "Steamed green beans", "Garlic sauce"], "calories": 1154, "macros": { "protein": 65.8, "carbs": 129.8, "fats": 32.1 } },
        { "name": "Dinner", "mealName": "Baked Cod & Potatoes", "items": ["Cod fillet (180g)", "Baby potatoes (150g)", "Roasted capsicum", "Herbs and lemon"], "calories": 989, "macros": { "protein": 56.4, "carbs": 111.3, "fats": 27.5 } },
        { "name": "Snack", "mealName": "Boiled Egg & Fruit", "items": ["Hard-boiled eggs (2)", "Orange", "Handful of grapes"], "calories": 329, "macros": { "protein": 28.2, "carbs": 37.0, "fats": 9.1 } }
      ]
    },
    {
      "day": "Friday",
      "meals": [
        { "name": "Breakfast", "mealName": "Overnight Oats", "items": ["Oats (90g)", "Chia seeds (1 tbsp)", "[EXCLUDED - Dairy allergy] Almond milk (200ml)", "Strawberries", "Honey"], "calories": 824, "macros": { "protein": 37.6, "carbs": 92.7, "fats": 22.9 } },
        { "name": "Lunch", "mealName": "Grilled Chicken Wrap", "items": ["Grilled chicken (180g)", "Whole wheat wrap", "Lettuce", "Tomato", "Low-fat mayo"], "calories": 1154, "macros": { "protein": 65.8, "carbs": 129.8, "fats": 32.1 } },
        { "name": "Dinner", "mealName": "Lamb & Rice", "items": ["Lean lamb (180g)", "Basmati rice (100g)", "Roasted carrots and peas", "Mint sauce"], "calories": 989, "macros": { "protein": 56.4, "carbs": 111.3, "fats": 27.5 } },
        { "name": "Snack", "mealName": "Trail Mix", "items": ["Mixed nuts (30g)", "Dried cranberries (20g)", "Dark chocolate chips (15g)"], "calories": 329, "macros": { "protein": 28.2, "carbs": 37.0, "fats": 9.1 } }
      ]
    },
    {
      "day": "Saturday",
      "meals": [
        { "name": "Breakfast", "mealName": "Veggie Omelette", "items": ["Whole eggs (3)", "Diced capsicum and onion", "[EXCLUDED - Dairy allergy] Feta cheese (30g)", "Whole grain toast (1 slice)"], "calories": 824, "macros": { "protein": 37.6, "carbs": 92.7, "fats": 22.9 } },
        { "name": "Lunch", "mealName": "Prawn & Noodle Bowl", "items": ["Prawns (200g)", "Rice noodles (90g dry)", "Bok choy", "[EXCLUDED - Soy allergy] Ginger soy broth"], "calories": 1154, "macros": { "protein": 65.8, "carbs": 129.8, "fats": 32.1 } },
        { "name": "Dinner", "mealName": "Turkey Meatballs", "items": ["Turkey meatballs (200g)", "Whole wheat spaghetti (90g dry)", "Tomato basil sauce", "[EXCLUDED - Dairy allergy] Parmesan (20g)"], "calories": 989, "macros": { "protein": 56.4, "carbs": 111.3, "fats": 27.5 } },
        { "name": "Snack", "mealName": "Banana Smoothie", "items": ["Banana", "[EXCLUDED - Dairy allergy] Oat milk (250ml)", "Oats (30g)", "[EXCLUDED - Dairy allergy] Peanut butter (1 tbsp)"], "calories": 329, "macros": { "protein": 28.2, "carbs": 37.0, "fats": 9.1 } }
      ]
    },
    {
      "day": "Sunday",
      "meals": [
        { "name": "Breakfast", "mealName": "Protein French Toast", "items": ["Whole grain bread (2 slices)", "Egg wash (2 eggs)", "Cinnamon", "Sliced banana", "Drizzle of honey"], "calories": 824, "macros": { "protein": 37.6, "carbs": 92.7, "fats": 22.9 } },
        { "name": "Lunch", "mealName": "Chicken Caesar Salad", "items": ["Grilled chicken (180g)", "Romaine lettuce", "Caesar dressing (light)", "Croutons (20g)", "[EXCLUDED - Dairy allergy] Parmesan shavings"], "calories": 1154, "macros": { "protein": 65.8, "carbs": 129.8, "fats": 32.1 } },
        { "name": "Dinner", "mealName": "Pork & Veggie Stir Fry", "items": ["Pork tenderloin (180g)", "Brown rice (100g)", "Snow peas, broccoli, carrot", "Oyster sauce"], "calories": 989, "macros": { "protein": 56.4, "carbs": 111.3, "fats": 27.5 } },
        { "name": "Snack", "mealName": "Egg & Crackers", "items": ["Hard-boiled eggs (2)", "Whole grain crackers (4)", "Cucumber slices"], "calories": 329, "macros": { "protein": 28.2, "carbs": 37.0, "fats": 9.1 } }
      ]
    }
  ]
};

const initialState: PlanState = {
  mlOutputs: initialPlanData.mlOutputs,
  workoutPlan: initialPlanData.workoutPlan,
  mealPlan: initialPlanData.mealPlan,
  workoutTracking: {},
  mealTracking: {},
  loading: false,
  error: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getTodayName(): string {
  return DAYS[new Date().getDay()];
}

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const fetchPlan = createAsyncThunk(
  'plan/fetchPlan',
  async (userProfile: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/generate-plan', userProfile);
      return response.data;
    } catch (error: any) {
      console.warn('Failed to fetch plan from backend server, using pre-populated plan:', error.message);
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to fetch plan');
    }
  }
);

export const logWorkoutSet = createAsyncThunk(
  'plan/logWorkoutSet',
  async (payload: { date: string; day: string; exerciseName: string; setIndex: number; completed: boolean }) => {
    try {
      await aiApiClient.post('/workout/log', {
        date: payload.date,
        day: payload.day,
        exerciseName: payload.exerciseName,
        setNumber: payload.setIndex + 1,
        completed: payload.completed,
      });
    } catch (error: any) {
      console.warn('Failed to log workout set on server:', error.message);
    }
    return payload;
  }
);

export const logMeal = createAsyncThunk(
  'plan/logMeal',
  async (payload: { date: string; day: string; mealName: string; consumed: boolean }) => {
    try {
      await aiApiClient.post('/meal/log', payload);
    } catch (error: any) {
      console.warn('Failed to log meal on server:', error.message);
    }
    return payload;
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setPlan: (
      state,
      action: PayloadAction<{
        mlOutputs: MlOutputs;
        workoutPlan: WorkoutDay[];
        mealPlan: MealDay[];
      }>
    ) => {
      state.mlOutputs = action.payload.mlOutputs;
      state.workoutPlan = action.payload.workoutPlan;
      state.mealPlan = action.payload.mealPlan;
      state.error = null;
    },
    toggleSetCompletionLocal: (
      state,
      action: PayloadAction<{ dateKey: string; exerciseName: string; setIndex: number }>
    ) => {
      const { dateKey, exerciseName, setIndex } = action.payload;
      if (!state.workoutTracking[dateKey]) state.workoutTracking[dateKey] = {};
      if (!state.workoutTracking[dateKey][exerciseName]) state.workoutTracking[dateKey][exerciseName] = {};
      const current = state.workoutTracking[dateKey][exerciseName][setIndex] ?? false;
      state.workoutTracking[dateKey][exerciseName][setIndex] = !current;
    },
    toggleMealTakenLocal: (
      state,
      action: PayloadAction<{ dateKey: string; mealName: string }>
    ) => {
      const { dateKey, mealName } = action.payload;
      if (!state.mealTracking[dateKey]) state.mealTracking[dateKey] = {};
      const current = state.mealTracking[dateKey][mealName] ?? false;
      state.mealTracking[dateKey][mealName] = !current;
    },
    clearPlanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.mlOutputs = action.payload.mlOutputs;
        state.workoutPlan = action.payload.workoutPlan;
        state.mealPlan = action.payload.mealPlan;
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logWorkoutSet.fulfilled, (state, action) => {
        const { date: dateKey, exerciseName, setIndex, completed } = action.payload;
        if (!state.workoutTracking[dateKey]) state.workoutTracking[dateKey] = {};
        if (!state.workoutTracking[dateKey][exerciseName]) state.workoutTracking[dateKey][exerciseName] = {};
        state.workoutTracking[dateKey][exerciseName][setIndex] = completed;
      })
      .addCase(logMeal.fulfilled, (state, action) => {
        const { date: dateKey, mealName, consumed } = action.payload;
        if (!state.mealTracking[dateKey]) state.mealTracking[dateKey] = {};
        state.mealTracking[dateKey][mealName] = consumed;
      });
  },
});

export const { setPlan, toggleSetCompletionLocal, toggleMealTakenLocal, clearPlanError } = planSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectTodayWorkout = (state: { plan: PlanState }) => {
  const today = getTodayName();
  return state.plan.workoutPlan.find((d) => d.day === today) ?? null;
};

export const selectTodayMeals = (state: { plan: PlanState }) => {
  const today = getTodayName();
  return state.plan.mealPlan.find((d) => d.day === today)?.meals ?? [];
};

export const selectWorkoutTracking = (state: { plan: PlanState }, dateKey: string) =>
  state.plan.workoutTracking[dateKey] ?? {};

export const selectMealTracking = (state: { plan: PlanState }, dateKey: string) =>
  state.plan.mealTracking[dateKey] ?? {};

export default planSlice.reducer;
