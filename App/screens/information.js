import React from "react";
import { ScrollView } from 'react-native';
import Card from "../components/card";
import { BINS } from "../globals/bins";
import { BINS_ID } from "../globals/bins";

export default function Information() {
  return (
    <ScrollView>
      {Object.values(BINS_ID).map((id) => {
        return (
          <Card key={id} id={id} image_path={BINS[id].image} />
        );
      })}
    </ScrollView>
  );
}