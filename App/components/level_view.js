import React from "react";
import * as Progress from 'react-native-progress';
import { View, StyleSheet, Text, Dimensions } from "react-native";
import * as Icons from '@expo/vector-icons'
const windowWidth = Dimensions.get("window").width;


const StarIcons = ({level}) => {
  return (
    <View style={styles.typeLevelContainer}>
      {
        Array.from(Array(level).keys()).map((item, idx) => {
          return (<Icons.MaterialCommunityIcons 
            name={'star'} 
            size={windowWidth * 0.06} 
            color={'orange'} 
            style={[styles.typeLevel, {top: -idx * 8}]} 
            key={idx}
          />);
        })
      }
    </View>
  );
}

export default levelView = ({ IconLib, IconName, fillColor, unfillColor, score, label }) => {

  const level = Math.min(3, Math.floor(score / 200));
  const progress = level == 3 ? 1 : (score % 200) / 200;

  return (
    <View style={[styles.level_card_view]}>
      <StarIcons level={level} />
      <View style={styles.icon_progress}>
        <Progress.Circle size={windowWidth / 6} progress={progress} color={fillColor} borderWidth={0} unfilledColor={unfillColor} />
        <IconLib name={IconName} size={windowWidth / 16} color={fillColor} style={{ position: 'absolute', alignSelf: 'center' }} />
      </View>
      <Text style={{ color: 'black', textAlign: 'center', textAlignVertical: 'center', fontSize: 14 }}> {label.padEnd(label.length, ' ')} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  level_card_view: {
    alignContent: 'center',
    aspectRatio: 1,
    justifyContent: 'center',
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
  },
  shadowProp: {
    shadowColor: 'black',
    elevation: 25
  },
  icon_progress: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: "center",
  },
  typeLevelContainer: {
    position: 'absolute',
    top: 0,
    alignSelf: 'flex-start',
    zIndex: 1,
    alignContent: 'center',
  },
  typeLevel: {
    justifyContent: "center",
    alignItems: "center",
  },
})