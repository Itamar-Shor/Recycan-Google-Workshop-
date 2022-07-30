import React from "react";
import { View } from "react-native";
import { ToggleButton } from "react-native-paper";
import { BINS } from "../globals/bins";
import { BinIcon } from "./binIcon";

const generateBinOption = (bin, idx) => {
  const value = bin.name;
  return (
    <ToggleButton
      icon={() => <BinIcon bin={bin} size={18} />}
      value={value}
      color="#aaaaaa"
      key={idx}
      style={{ width: `${100 / BINS.length}%`, aspectRatio: 1 }}
    />
  );
};


export const BinToggle = ({ value, onValueChange }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <ToggleButton.Row
        onValueChange={onValueChange}
        value={value}
        style={{ width: "100%" }}
      >
        {BINS.map((bin, idx) => generateBinOption(bin, idx))}
      </ToggleButton.Row>
    </View>
  );
}
