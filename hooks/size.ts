import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const useSize = () => {

  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height

  const insets = useSafeAreaInsets();

  const topInset = insets.top;
  const bottomInset = insets.bottom;
  const leftInset = insets.left;
  const rightInset = insets.right;

  return {
    screenWidth,
    screenHeight,
    safeArea: {
      top: topInset,
      bottom: bottomInset,
      left: leftInset,
      right: rightInset
    }
  }

}