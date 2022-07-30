import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Modal, TouchableOpacity, Text, Image, Dimensions, StatusBar, FlatList } from "react-native";
import Avatars from "../globals/avatars";
import { BINS_ID, BINS } from '../globals/bins'
import { showMessage } from "react-native-flash-message";
import { RoundButton } from "./buttons";
import * as Icons from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;


const avatarPicker = ({ onConfirm, onCancel, visible, level, initColor, initAvatar }) => {

  const windowWidth = Dimensions.get("window").width;
  const [color, setColor] = useState(initColor);
  const [avatar, setAvatar] = useState(initAvatar);
  const [AvatarLib, setAvatarLib] = useState({ lib: Avatars[initAvatar].IconLib });

  const handleIconChange = (icon_idx, minLevel) => {
    if (level < minLevel) {
      showMessage({
        message: `you must be lvl ${minLevel} or higher to unlock this avatar`,
        type: "info",
        icon: 'auto',
        floating: true,
        position: { top: StatusBar.currentHeight + 12 }
      });
    }
    else {
      setAvatar(icon_idx);
      setAvatarLib({ lib: Avatars[icon_idx].IconLib });
    }
  };

  const renderListItem = ({ item, index }) => {
    return (
      <View style={styles.avatarBtn} key={index}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{}}
          onPress={() => handleIconChange(index, item.minLevel)}
        >
          <item.IconLib name={item.IconName} size={windowWidth * 0.12} color={'black'} style={{}} />
          {level < item.minLevel ? <Image source={require('../assets/lock_and_chain.png')} style={{ zIndex: 2, width: windowWidth * 0.12, height: windowWidth * 0.12, alignSelf: 'center', position: 'absolute' }} /> : null}
        </TouchableOpacity>
      </View>
    );
  }

  return (

    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onCancel}
      statusBarTranslucent={true}
      animationType={"fade"}
    >
      <View style={styles.centeredView}>
        <View style={[styles.popup, styles.shadowProp]}>
          <AvatarLib.lib name={Avatars[avatar].IconName} size={windowWidth * 0.40} color={color} style={styles.previewAvatar} />
          <Text style={styles.text}>Select Avatar:</Text>
          <View style={styles.avatars}>
            <FlatList
              keyExtractor={(item, idx) => idx.toString()}
              data={Avatars}
              renderItem={renderListItem}
              horizontal={true}
              persistentScrollbar={true}
            />
          </View>
          <Text style={styles.text}>Select Color:</Text>

          <View style={styles.avatars}>
            <ScrollView horizontal={true} persistentScrollbar={true}>

              {Object.values(BINS_ID).map((id) => {
                return (
                  <TouchableOpacity key={id}
                    style={{ backgroundColor: BINS[id].color, borderRadius: 30, aspectRatio: 1, margin: 6, width: windowWidth * 0.12, ...styles.shadowProp }}
                    onPress={() => setColor(BINS[id].color)}
                  >
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: '20%', marginHorizontal: 20, marginBottom: 20 }}>
            <RoundButton
              style={[styles.confirmBtn, styles.shadowProp]}
              onPress={() => onConfirm(avatar, color)}
            >
              <View
                style={styles.actionButton}>
                <Icons.FontAwesome name={"check"} size={30} color={"white"} />
              </View>
            </RoundButton>
            <RoundButton
              style={[styles.confirmBtn, styles.shadowProp]}
              onPress={() => {
                setColor(initColor);
                setAvatar(initAvatar);
                setAvatarLib({ lib: Avatars[initAvatar].IconLib })
                onCancel();
              }}
            >
              <View
                style={styles.actionButton}>
                <Icons.FontAwesome name={"remove"} size={30} color={"white"} />
              </View>
            </RoundButton>

          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: 10
  },
  avatars: {
    alignSelf: 'center',
    flex: 0,
    marginTop: 8,
    height: '15%',
    width: '92%'
  },
  avatarBtn: {
    padding: 8,
    alignItems: "center",
    alignContent: "center",
    height: '100%',
    marginBottom: 20
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 5
  },
  popup: {
    borderRadius: 12,
    width: '95%',
    height: '75%',
    alignSelf: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 10,
  },
  confirmBtn: {
    backgroundColor: 'white',
    borderRadius: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  previewAvatar: {
    alignSelf: 'center',
    marginTop: 20
  },
  actionButton: {
    width: windowWidth * 0.16,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    backgroundColor: 'black',
    borderRadius: 50,
    elevation: 6,
    margin: 5
  },
  text: { color: '#808080', textAlign: 'left', margin: 10, fontSize: 15, }
})


export default avatarPicker;