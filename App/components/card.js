import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { BINS } from "../globals/bins";
import { SectionHeader } from "./sectionHeader";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const generateIconForCard = (type) => {
  let IconLib = BINS[type].IconLib
  let IconName = BINS[type].IconName
  let IconColor = "white"
  return <IconLib style={styles.card_icon} name={IconName} size={25} color={IconColor} />
};


export default function Card(props) {
  const examples = BINS[props.id].examples;
  const color = BINS[props.id].color;

  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={styles.card_content}>
        <View>
          <View style={[styles.top_half, { backgroundColor: color }]}>
            <Text style={styles.titleText}>{BINS[props.id].name}</Text>
            {generateIconForCard(props.id)}
          </View>
        </View>
        <View style={styles.card_content_text}>
          <SectionHeader 
            icon={"recycle-variant"} 
            title={BINS[props.id].info} 
            size={16}
          />
          {examples && examples.map((ex, idx) => {
            return (
              <View style={{ flexDirection: "row", marginHorizontal: 28 }} key={idx}>
                <Text style={{fontSize: 16}}>{`\u2022`}</Text>
                <Text style={{marginHorizontal: 4, fontSize: 16}}>{ex}</Text>
              </View>

            )
          })}
        </View>
        <Image
          source={props.image_path}
          style={styles.image}
        />
      </View>
    </View>
  )
}

const generateIcon = (type) => {
  let IconLib = BINS[type].IconLib
  let IconName = BINS[type].IconName
  let IconColor = BINS[type].color
  return <IconLib name={IconName} size={18} color={IconColor} />
};

const styles = StyleSheet.create({
  card: {
    justifyContent: "space-evenly",
    borderWidth: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  card_content: {
    marginBottom: 10
  },
  image: {
    alignSelf: "center",
    marginTop: 10,
    resizeMode: 'contain',
    width: "80%",
    height: undefined,
    aspectRatio: 1,
  },
  card_content_text: {
    marginBottom: 4
  },
  top_half: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  card_icon: {
    alignSelf: "center",
    alignItems: "flex-end",
    marginRight: 10
  },
  info_item: {
    flexDirection: "column"
  },
  titleText: {
    color: "white",
    fontSize: 30,
    marginHorizontal: 10,
    marginTop: 2,
    marginBottom: 5
  },
  label: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold"
  },
  subtitle_style: {
    marginHorizontal: 20,
    fontSize: 15,
    marginBottom: 2,
  },
});