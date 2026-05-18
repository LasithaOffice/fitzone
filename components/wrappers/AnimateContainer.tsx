// src/components/wrappers/Animated/index.tsx

import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
  WithTimingConfig,
  WithSpringConfig,
  SharedValue,
} from 'react-native-reanimated';

type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce';
type SlideDirection = 'left' | 'right' | 'up' | 'down';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  visible?: boolean;
  type?: AnimationType | AnimationType[];
  slideDirection?: SlideDirection;
  duration?: number;
  delay?: number;
  slideDistance?: number;
  style?: StyleProp<ViewStyle>;
  onAnimationEnd?: () => void;
}

const SLIDE_AXIS: Record<SlideDirection, 'x' | 'y'> = {
  left: 'x', right: 'x', up: 'y', down: 'y',
};

const SLIDE_SIGN: Record<SlideDirection, 1 | -1> = {
  left: -1, right: 1, up: -1, down: 1,
};

const TIMING_CONFIG = (duration: number): WithTimingConfig => ({
  duration,
  easing: Easing.out(Easing.cubic),
});

const SPRING_CONFIG: WithSpringConfig = {
  damping: 12,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
};

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  visible = true,
  type = 'fade',
  slideDirection = 'up',
  duration = 350,
  delay = 0,
  slideDistance = 40,
  style,
  onAnimationEnd,
}) => {
  const types = Array.isArray(type) ? type : [type];

  const opacity = useSharedValue(visible ? 1 : 0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(visible ? 1 : 0);

  const hasFade = types.includes('fade');
  const hasSlide = types.includes('slide');
  const hasScale = types.includes('scale');
  const hasBounce = types.includes('bounce');

  useEffect(() => {
    const timing = (val: SharedValue<number>, to: number) =>
      delay > 0
        ? withDelay(delay, withTiming(to, TIMING_CONFIG(duration)))
        : withTiming(to, TIMING_CONFIG(duration));

    const spring = (val: SharedValue<number>, to: number) =>
      delay > 0
        ? withDelay(delay, withSpring(to, {
          ...SPRING_CONFIG,
          ...(onAnimationEnd ? { callback: (finished: any) => { if (finished) runOnJS(onAnimationEnd)(); } } : {}),
        }))
        : withSpring(to, {
          ...SPRING_CONFIG,
          ...(onAnimationEnd ? { callback: (finished: any) => { if (finished) runOnJS(onAnimationEnd)(); } } : {}),
        });

    if (hasFade) {
      opacity.value = timing(opacity, visible ? 0 : 1);
    }

    if (hasSlide) {
      const axis = SLIDE_AXIS[slideDirection];
      const sign = SLIDE_SIGN[slideDirection];
      const offset = sign * slideDistance;

      if (axis === 'x') {
        translateX.value = visible ? offset : 0;
        translateX.value = timing(translateX, visible ? 0 : offset);
      } else {
        translateY.value = visible ? offset : 0;
        translateY.value = timing(translateY, visible ? 0 : offset);
      }
    }

    if (hasScale && !hasBounce) {
      scale.value = timing(scale, visible ? 1 : 0);
    }

    if (hasBounce) {
      scale.value = spring(scale, visible ? 1 : 0);
    }

    if (onAnimationEnd && !hasBounce) {
      // For timing-based animations, fire callback after longest animation
      const timer = setTimeout(onAnimationEnd, delay + duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {

    const transform: any[] = [];

    if (hasSlide) {
      transform.push({ translateX: translateX.value });
      transform.push({ translateY: translateY.value });
    }

    if (hasScale || hasBounce) {
      transform.push({ scale: scale.value });
    }

    return {
      opacity: hasFade ? opacity.value : 1,
      transform,
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedWrapper;