import React from "react";
import { StyleSheet, Modal, View } from 'react-native';
import { Button } from "react-native-paper";
import { BINS } from "../globals/bins";
import Card from "./card";

const InfoModal = ({ id, visible, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onConfirm}
      statusBarTranslucent={true}
      animationType={"fade"}
    >
      <View style={styles.centeredView}>
        <View style={[styles.popup, styles.shadowProp, { backgroundColor: BINS[id].color }]}>
          <Card id={id} image_path={BINS[id].image} />
          <Button
            uppercase={false}
            mode="contained"
            color="white"
            style={{
              width: "30%",
              alignSelf: "center",
            }}
            onPress={async () => { await setTimeout(onConfirm, 120) }}
            labelStyle={{ letterSpacing: 0.5, color: "#708090" }}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)"
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24
  },
  popup: {
    borderRadius: 12,
    width: '95%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingBottom: 12,
  },
});

export default InfoModal