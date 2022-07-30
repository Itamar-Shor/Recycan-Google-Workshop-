import React, { useState } from "react";
import { StyleSheet, Modal, View, Text } from 'react-native';
import { Button, RadioButton } from "react-native-paper";
import { BinToggle } from "./binToggle";

const AddBinModal = ({ visible, onConfirm }) => {

  const [binType, setBinType] = useState('');
  const [locationType, setLocationType] = useState("location");

  return (
    <Modal
      visible={visible}
      animationType={"fade"}
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onConfirm}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.popup, styles.shadowProp, { backgroundColor: "white" }]}>
          <Text style={{
            alignSelf: "center",
            fontSize: 26,
            fontWeight: "bold"
          }}
          >
            Add a place
          </Text>
          <Text style={{
            marginVertical: 4,
            alignSelf: "center",
            fontSize: 16,
            color: "#1f1f1f"
          }}
          >
            Help us improve the map!
          </Text>
          <View style={{ paddingVertical: 30, justifyContent: "center", alignItems: "center" }}>
            <View style={styles.field}>
             <BinToggle
              value={binType}
              onValueChange={value => setBinType(value)}
             />
            </View>
            <View style={styles.field}>
              <RadioButton.Group
                value={locationType}
                onValueChange={value => setLocationType(value)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton
                    color="black"
                    value="location"
                  />
                  <Text style={{ marginRight: 16 }}>My Location</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <View style={styles.buttonsRow}>
            <Button
              uppercase={false}
              style={styles.confirmButton}
              mode="contained"
              onPress={async () => await setTimeout(onConfirm, 120)}
              labelStyle={{ letterSpacing: 0.5 }}
            >
              Submit
            </Button>
            <Button
              uppercase={false}
              style={styles.confirmButton}
              mode="contained"
              onPress={async () => await setTimeout(onConfirm, 120)}
              labelStyle={{ letterSpacing: 0.5 }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  confirmButton: {
    backgroundColor: 'black',
    borderRadius: 8
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
    alignSelf: 'center',
    position: "absolute",
    bottom: 0
  },
  field: {
    paddingVertical: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
});

export default AddBinModal