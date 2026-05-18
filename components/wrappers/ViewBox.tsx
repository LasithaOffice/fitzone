import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSize } from '@/hooks/size';
import { BACKGROUND_COLOR } from '@/constants/colors';

/**
 * View with just a flex one user "flex1"
 * View with flex one plus default background use "base"
 * To change the view gap user the "gap" property
 * To have a centered content in the view user "center"
 */
type Props = {
  flex1?: boolean,
  flexRow?: boolean,
  gap?: number,
  paddingLeft?: number,
  padding?: number,
  paddingTop?: number,
  paddingHorizontal?: number,
  marginTop?: number,
  marginRight?: number,
  base?: boolean,
  center?: boolean,
  children?: React.ReactNode,
  safeArea?: boolean,
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  base: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  }
})

const ViewBox = ({
  gap,
  padding,
  paddingLeft,
  paddingTop,
  paddingHorizontal,
  marginTop,
  marginRight,
  style,
  ...p
}: Props) => {

  const size = useSize();

  return (
    <View style={[
      p.flex1 && styles.flex1,
      p.flexRow && styles.flexRow,
      gap != undefined && { gap },
      p.center && styles.center,
      p.base && styles.base,
      p.safeArea && { paddingTop: size.safeArea.top },
      padding != undefined && { padding },
      paddingTop != undefined && { paddingTop },
      paddingTop != undefined && { paddingTop },
      paddingHorizontal != undefined && { paddingHorizontal },
      marginTop != undefined && { marginTop },
      marginRight != undefined && { marginRight },
      style
    ]}>
      {p.children}
    </View>
  )
}

export default React.memo(ViewBox)