import { router } from 'expo-router';
import * as React from 'react';
import { ImageBackground, type ImageStyle, StyleSheet } from 'react-native';
import { useColorScheme } from 'nativewind';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { useAppDispatch } from '@/store';
import { setUserProfile, restoreOnboardingState } from '@/store/authSlice';
import { setPlan } from '@/store/planSlice';
import * as tokenStore from '@/lib/tokenStore';
import { getLocalOnboardingState, getOnboardingCompleted, saveOnboardingCompleted, clearLocalOnboardingState } from '@/lib/onboardingStore';
import apiClient from '@/lib/apiClient';

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { setColorScheme } = useColorScheme();
  const dispatch = useAppDispatch();

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  const determineNextOnboardingRoute = (state: any) => {
    const fullName = state.fullName;
    const birthday = state.birthday;
    const weightVal = state.weightValue || (state.weight && state.weight.value);
    const heightVal = state.heightValue || (state.height && state.height.value);
    const fitnessLevel = state.fitnessLevel;
    const goal = state.goal;
    const targetWeightVal = state.targetWeightValue || (state.targetWeight && state.targetWeight.value);

    if (!fullName || !birthday) {
      return '/(auth)/join1';
    }
    if (!weightVal || !heightVal) {
      return '/(auth)/join2';
    }
    if (!fitnessLevel || !goal) {
      return '/(auth)/join3';
    }
    if (!targetWeightVal) {
      return '/(auth)/join4';
    }
    return '/(auth)/join5';
  };

  React.useEffect(() => {
    setColorScheme('dark');

    const checkLoginStatus = async () => {
      try {
        const accessToken = await tokenStore.getAccessToken();
        const refreshToken = await tokenStore.getRefreshToken();

        if (!accessToken || !refreshToken) {
          console.log('No active tokens found. Navigating to login.');
          router.replace('/(auth)/login');
          return;
        }

        console.log('Tokens found. Authenticating user profile...');

        let userProfile = null;
        try {
          const profileResponse = await apiClient.get('/auth/profile', { timeout: 4000 });
          userProfile = profileResponse.data;
          console.log('User profile fetched successfully:', userProfile);
        } catch (apiError: any) {
          console.warn('API connection failed. Running in offline/fallback mode:', apiError.message);
        }

        if (userProfile) {
          // Populate Redux authentication slice
          dispatch(setUserProfile(userProfile));

          // Set existing plans if generated
          if (userProfile.workoutPlan && userProfile.workoutPlan.length > 0) {
            dispatch(setPlan({
              mlOutputs: userProfile.mlOutputs,
              workoutPlan: userProfile.workoutPlan,
              mealPlan: userProfile.mealPlan,
              workoutTracking: userProfile.workoutLog,
              mealTracking: userProfile.mealLog,
            }));
          }

          // Check if onboarding was completed
          const isOnboardingComplete = 
            userProfile.workoutFrequency || 
            (userProfile.workoutPlan && userProfile.workoutPlan.length > 0);

          if (isOnboardingComplete) {
            console.log('Onboarding complete. Directing to home tabs.');
            await saveOnboardingCompleted(true);
            await clearLocalOnboardingState();
            router.replace('/(tabs)');
          } else {
            console.log('Onboarding incomplete. Retrieving last step...');
            const localState = await getLocalOnboardingState();
            if (localState) {
              dispatch(restoreOnboardingState(localState));
            }
            const combinedState = { ...userProfile, ...localState };
            const nextRoute = determineNextOnboardingRoute(combinedState);
            router.replace(nextRoute as any);
          }
        } else {
          // Offline mode
          const completed = await getOnboardingCompleted();
          if (completed) {
            console.log('Onboarding previously marked complete. Launching tabs offline.');
            router.replace('/(tabs)');
          } else {
            console.log('Restoring onboarding progress locally offline...');
            const localState = await getLocalOnboardingState();
            if (localState) {
              dispatch(restoreOnboardingState(localState));
            }
            const nextRoute = determineNextOnboardingRoute(localState || {});
            router.replace(nextRoute as any);
          }
        }
      } catch (err) {
        console.error('Error in session verification:', err);
        router.replace('/(auth)/login');
      }
    };

    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ImageBackground
        source={require('@/assets/images/splash.png')}
        style={styles.container}
        resizeMode="cover"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
