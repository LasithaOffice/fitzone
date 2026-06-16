import { View, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ViewBox from '@/components/wrappers/ViewBox'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Loader2 } from 'lucide-react-native'
import { FontAwesome } from '@expo/vector-icons';
import { Icon } from '@/components/ui/icon'
import CButton from '@/components/ui/custom/Button'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { router } from 'expo-router'
import apiClient from '@/lib/apiClient'
import * as tokenStore from '@/lib/tokenStore'
import { useAppDispatch } from '@/store'
import { setUserProfile } from '@/store/authSlice'
import { setPlan } from '@/store/planSlice'
import { saveOnboardingCompleted, clearLocalOnboardingState } from '@/lib/onboardingStore'


const LoginScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '427772449065-gukcdpi2b7k53podqugkgntcpcfuca0o.apps.googleusercontent.com',
    });
  }, [])

  const [googleSignIn, setGoogleSignIn] = useState(false);
  const [appleSignIn, setAppleSignIn] = useState(false);


  async function onGoogleButtonPress() {
    setGoogleSignIn(true);
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInResult: any = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);

      // Sign-in the user with the credential
      const data = await signInWithCredential(getAuth(), googleCredential);

      const email = data.user?.email;
      const createdAt = new Date().toISOString();
      const socialProvider = 'google';

      console.log('Sending social login data to backend:', { email, createdAt, socialProvider });

      let loggedInUser = null;
      try {
        const response = await apiClient.post('/auth/social-login', {
          email,
          createdAt,
          socialProvider
        });
        const { accessToken, refreshToken, user } = response.data;
        await tokenStore.setTokens(accessToken, refreshToken);
        loggedInUser = user;
      } catch (apiError: any) {
        console.warn('Network error or API offline. Simulating local token storage:', apiError.message);
        await tokenStore.setTokens('mock-access-token', 'mock-refresh-token');
      }

      setGoogleSignIn(false);

      if (loggedInUser) {
        dispatch(setUserProfile(loggedInUser));

        if (loggedInUser.workoutPlan && loggedInUser.workoutPlan.length > 0) {
          dispatch(setPlan({
            mlOutputs: loggedInUser.mlOutputs,
            workoutPlan: loggedInUser.workoutPlan,
            mealPlan: loggedInUser.mealPlan,
          }));
        }

        const isOnboardingComplete =
          loggedInUser.workoutFrequency ||
          (loggedInUser.workoutPlan && loggedInUser.workoutPlan.length > 0);

        if (isOnboardingComplete) {
          console.log('User logged in. Onboarding completed. Routing to tabs.');
          await saveOnboardingCompleted(true);
          await clearLocalOnboardingState();
          router.replace('/(tabs)');
        } else {
          const nextRoute = determineNextOnboardingRoute(loggedInUser);
          console.log('User logged in. Onboarding incomplete. Routing to:', nextRoute);
          router.replace(nextRoute as any);
        }
      } else {
        router.replace('/(auth)/join1');
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setGoogleSignIn(false);
    }
  }

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

  return (
    <ViewBox base>
      <ImageBackground
        source={require('@/features/auth/assets/images/join_back.png')}
        style={styles.container}
      >
        <View style={{
          padding: 40,
          gap: 10
        }}>
          <Button variant={'outline'} onPress={() => {

          }} >
            {
              (appleSignIn) ?
                <>
                  <ActivityIndicator color={'white'} />
                </>
                :
                <>
                  <FontAwesome name="apple" size={20} color="white" />
                  <Text>Continue with Apple</Text>
                </>
            }
          </Button>
          <Button variant={'outline'} onPress={() => {
            onGoogleButtonPress()
          }} >
            {
              (googleSignIn) ?
                <>
                  <ActivityIndicator color={'white'} />
                </>
                :
                <>
                  <FontAwesome name="google" size={20} color="white" />
                  <Text>Continue with Google</Text>
                </>
            }
          </Button>
        </View>
      </ImageBackground>
    </ViewBox>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column-reverse',
    paddingBottom: 100
  },
});
