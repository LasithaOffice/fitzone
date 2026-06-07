import * as SecureStore from 'expo-secure-store';

const ONBOARDING_STATE_KEY = 'fitzone_onboarding_state';
const ONBOARDING_COMPLETED_KEY = 'fitzone_onboarding_completed';

export interface LocalOnboardingState {
  fullName?: string;
  birthday?: string;
  gender?: string;
  weightValue?: string;
  weightUnit?: string;
  heightValue?: string;
  heightUnit?: string;
  fitnessLevel?: string;
  goal?: string;
  allergies?: string[];
  chronicConditions?: string[];
  injuryHistory?: string;
  targetWeightValue?: string;
  targetWeightUnit?: string;
}

export const saveLocalOnboardingState = async (state: LocalOnboardingState) => {
  try {
    const currentState = await getLocalOnboardingState() || {};
    const updatedState = { ...currentState, ...state };
    await SecureStore.setItemAsync(ONBOARDING_STATE_KEY, JSON.stringify(updatedState));
  } catch (e) {
    console.warn('Failed to save local onboarding state:', e);
  }
};

export const getLocalOnboardingState = async (): Promise<LocalOnboardingState | null> => {
  try {
    const data = await SecureStore.getItemAsync(ONBOARDING_STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Failed to retrieve local onboarding state:', e);
    return null;
  }
};

export const clearLocalOnboardingState = async () => {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_STATE_KEY);
  } catch (e) {
    console.warn('Failed to clear local onboarding state:', e);
  }
};

export const saveOnboardingCompleted = async (completed: boolean) => {
  try {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, completed ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save onboarding completion status:', e);
  }
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const val = await SecureStore.getItemAsync(ONBOARDING_COMPLETED_KEY);
    return val === 'true';
  } catch (e) {
    console.warn('Failed to retrieve onboarding completion status:', e);
    return false;
  }
};

export const clearOnboardingCompleted = async () => {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_COMPLETED_KEY);
  } catch (e) {
    console.warn('Failed to clear onboarding completion status:', e);
  }
};
