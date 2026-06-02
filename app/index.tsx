import { router } from 'expo-router';
import * as React from 'react';
import { ImageBackground, type ImageStyle, StyleSheet } from 'react-native';
import { useColorScheme } from 'nativewind';

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {

  const { setColorScheme } = useColorScheme();

  /**
   * npx expo prebuild --clean      
   * npx expo run:android    
   */

  React.useEffect(() => {
    setColorScheme('dark')
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 1000);
    return () => clearTimeout(timer);
  }, [])

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
