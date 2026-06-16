import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/lib/apiClient';

export interface AuthState {
  email: string;
  fullName: string;
  birthday: string;
  gender: string;
  weightValue: string;
  weightUnit: string;
  heightValue: string;
  heightUnit: string;
  fitnessLevel: string;
  goal: string;
  // New health & lifestyle fields
  allergies: string[];
  chronicConditions: string[];
  injuryHistory: string;
  targetWeightValue: string;
  targetWeightUnit: string;
  workoutFrequency: string;
  workoutDuration: string;
  sleepDuration: string;
  occupationType: string;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

const initialState: AuthState = {
  email: 'lasitha@example.com',
  fullName: 'Lasitha Lakmal',
  birthday: '1993-10-03',
  gender: 'male',
  weightValue: '75',
  weightUnit: 'kg',
  heightValue: '175',
  heightUnit: 'cm',
  fitnessLevel: 'Beginner',
  goal: 'Weight Loss',
  // New fields initial state
  allergies: [],
  chronicConditions: [],
  injuryHistory: '',
  targetWeightValue: '',
  targetWeightUnit: 'kg',
  workoutFrequency: '',
  workoutDuration: '',
  sleepDuration: '',
  occupationType: '',
  loading: false,
  error: null,
  registrationSuccess: false,

  // fullName: '',
  // birthday: '',
  // gender: 'male',
  // weightValue: '',
  // weightUnit: 'kg',
  // heightValue: '',
  // heightUnit: 'cm',
  // fitnessLevel: '',
  // goal: '',
  // // New fields initial state
  // allergies: [],
  // chronicConditions: [],
  // injuryHistory: '',
  // targetWeightValue: '',
  // targetWeightUnit: 'kg',
  // workoutFrequency: '',
  // workoutDuration: '',
  // sleepDuration: '',
  // occupationType: '',
  // loading: false,
  // error: null,
  // registrationSuccess: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).auth as AuthState;
      const registrationData = {
        fullName: state.fullName,
        birthday: state.birthday,
        gender: state.gender,
        weight: {
          value: parseFloat(state.weightValue) || 0,
          unit: state.weightUnit,
        },
        height: {
          value: parseFloat(state.heightValue) || 0,
          unit: state.heightUnit,
        },
        fitnessLevel: state.fitnessLevel,
        goal: state.goal,
        // New fields
        allergies: state.allergies,
        chronicConditions: state.chronicConditions,
        injuryHistory: state.injuryHistory,
        targetWeight: {
          value: parseFloat(state.targetWeightValue) || 0,
          unit: state.targetWeightUnit,
        },
        workoutFrequency: state.workoutFrequency,
        workoutDuration: state.workoutDuration,
        sleepDuration: parseFloat(state.sleepDuration) || 0,
        occupationType: state.occupationType,
      };

      console.log('Sending registration request to backend:', JSON.stringify(registrationData, null, 2));

      try {
        const response = await apiClient.post('/auth/register', registrationData, {
          timeout: 4000,
        });
        return response.data;
      } catch (error: any) {
        if (error.response) {
          return rejectWithValue(error.response.data?.message || 'Registration failed on backend server.');
        }

        console.warn('Network error or API offline. Simulating successful registration for onboarding walkthrough:', error.message);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return {
          success: true,
          message: 'User registered successfully (Simulated Backend Response)',
          user: registrationData,
        };
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'An unexpected error occurred during registration.');
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      dispatch(setUserProfile(response.data.user));
      return response.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchUserProfileThunk = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/profile');
      dispatch(setUserProfile(response.data));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfileInfo: (
      state,
      action: PayloadAction<{ fullName: string; birthday: string; gender: string }>
    ) => {
      state.fullName = action.payload.fullName;
      state.birthday = action.payload.birthday;
      state.gender = action.payload.gender;
    },
    setPhysicalInfo: (
      state,
      action: PayloadAction<{
        weightValue: string;
        weightUnit: string;
        heightValue: string;
        heightUnit: string;
      }>
    ) => {
      state.weightValue = action.payload.weightValue;
      state.weightUnit = action.payload.weightUnit;
      state.heightValue = action.payload.heightValue;
      state.heightUnit = action.payload.heightUnit;
    },
    setGoalsAndLevel: (
      state,
      action: PayloadAction<{ fitnessLevel: string; goal: string }>
    ) => {
      state.fitnessLevel = action.payload.fitnessLevel;
      state.goal = action.payload.goal;
    },
    setMedicalAndTargetInfo: (
      state,
      action: PayloadAction<{
        allergies: string[];
        chronicConditions: string[];
        injuryHistory: string;
        targetWeightValue: string;
        targetWeightUnit: string;
      }>
    ) => {
      state.allergies = action.payload.allergies;
      state.chronicConditions = action.payload.chronicConditions;
      state.injuryHistory = action.payload.injuryHistory;
      state.targetWeightValue = action.payload.targetWeightValue;
      state.targetWeightUnit = action.payload.targetWeightUnit;
    },
    setLifestyleInfo: (
      state,
      action: PayloadAction<{
        workoutFrequency: string;
        workoutDuration: string;
        sleepDuration: string;
        occupationType: string;
      }>
    ) => {
      state.workoutFrequency = action.payload.workoutFrequency;
      state.workoutDuration = action.payload.workoutDuration;
      state.sleepDuration = action.payload.sleepDuration;
      state.occupationType = action.payload.occupationType;
    },
    resetRegistration: (state) => {
      state.registrationSuccess = false;
      state.error = null;
      state.loading = false;
    },
    setUserProfile: (state, action: PayloadAction<any>) => {
      const u = action.payload;
      if (u) {
        state.email = u.email || '';
        state.fullName = u.fullName || '';
        state.birthday = u.birthday || '';
        state.gender = u.gender || 'male';
        state.weightValue = u.weight?.value?.toString() || '';
        state.weightUnit = u.weight?.unit || 'kg';
        state.heightValue = u.height?.value?.toString() || '';
        state.heightUnit = u.height?.unit || 'cm';
        state.fitnessLevel = u.fitnessLevel || '';
        state.goal = u.goal || '';
        state.allergies = u.allergies || [];
        state.chronicConditions = u.chronicConditions || [];
        state.injuryHistory = u.injuryHistory || '';
        state.targetWeightValue = u.targetWeight?.value?.toString() || '';
        state.targetWeightUnit = u.targetWeight?.unit || 'kg';
        state.workoutFrequency = u.workoutFrequency || '';
        state.workoutDuration = u.workoutDuration || '';
        state.sleepDuration = u.sleepDuration?.toString() || '';
        state.occupationType = u.occupationType || '';
      }
    },
    restoreOnboardingState: (state, action: PayloadAction<any>) => {
      const s = action.payload;
      if (s) {
        if (s.fullName !== undefined) state.fullName = s.fullName;
        if (s.birthday !== undefined) state.birthday = s.birthday;
        if (s.gender !== undefined) state.gender = s.gender;
        if (s.weightValue !== undefined) state.weightValue = s.weightValue;
        if (s.weightUnit !== undefined) state.weightUnit = s.weightUnit;
        if (s.heightValue !== undefined) state.heightValue = s.heightValue;
        if (s.heightUnit !== undefined) state.heightUnit = s.heightUnit;
        if (s.fitnessLevel !== undefined) state.fitnessLevel = s.fitnessLevel;
        if (s.goal !== undefined) state.goal = s.goal;
        if (s.allergies !== undefined) state.allergies = s.allergies;
        if (s.chronicConditions !== undefined) state.chronicConditions = s.chronicConditions;
        if (s.injuryHistory !== undefined) state.injuryHistory = s.injuryHistory;
        if (s.targetWeightValue !== undefined) state.targetWeightValue = s.targetWeightValue;
        if (s.targetWeightUnit !== undefined) state.targetWeightUnit = s.targetWeightUnit;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.error = null;
        if (action.payload?.user) {
          state.email = action.payload.user.email || '';
          state.fitnessLevel = action.payload.user.fitnessLevel;
          state.goal = action.payload.user.goal;
          state.allergies = action.payload.user.allergies || [];
          state.chronicConditions = action.payload.user.chronicConditions || [];
          state.injuryHistory = action.payload.user.injuryHistory || '';
          state.targetWeightValue = action.payload.user.targetWeight?.value?.toString() || '';
          state.targetWeightUnit = action.payload.user.targetWeight?.unit || 'kg';
          state.workoutFrequency = action.payload.user.workoutFrequency || '';
          state.workoutDuration = action.payload.user.workoutDuration || '';
          state.sleepDuration = action.payload.user.sleepDuration?.toString() || '';
          state.occupationType = action.payload.user.occupationType || '';
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Registration failed';
        state.registrationSuccess = false;
      });
  },
});

export const {
  setProfileInfo,
  setPhysicalInfo,
  setGoalsAndLevel,
  setMedicalAndTargetInfo,
  setLifestyleInfo,
  resetRegistration,
  setUserProfile,
  restoreOnboardingState
} = authSlice.actions;

export default authSlice.reducer;
