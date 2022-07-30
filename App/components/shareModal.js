import React, { useRef, useContext, useState } from 'react';
import { StyleSheet, View, Modal, ImageBackground, Text, Dimensions } from 'react-native';
import { Image } from 'react-native';
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import { Button } from 'react-native-paper';
import { UserContext } from '../globals/userContext';
import PARAMS from '../globals/params';
import * as Icons from '@expo/vector-icons';
import avatars from '../globals/avatars';

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const openShareDialogAsync = async (uri) => {
  if (!(await Sharing.isAvailableAsync())) {
    alert(`Uh oh, sharing isn't available on your platform`);
    return;
  }
  const options = {
    mimeType: 'image/jpeg',
    dialogTitle: "Sharecyle",
  };
  try {
    Sharing.shareAsync(uri, options);
  }
  catch (e) {
    console.log(e);
  }
};

// waiting an image
const shareModal = ({ visible, onRequestClose, color }) => {

  const viewShot = useRef()

  const quotes = [
    "Go Green or Go Home",
    "I'm not saying I'm a hero\nfor recycling, but...",
    "Reduce.\nReuse.\nRecycle!",
    "I made the world a little bit better,\nhow about you?",
    "Waste isn't waste\nuntil we waste it",
    "Every piece of plastic ever made\nstill exists today!",
    "Recycling turns things\ninto other things",
    "Use it up, wear it out,\nmake it do - or do without",
    "All you need is Less",
    "Recycle like there's no tommorow"
  ];
  const [quoteIdx, setQuoteIdx] = useState(Math.floor(Math.random() * quotes.length));

  const [user, setUser] = useContext(UserContext);
  const userData = user.data;
  const isLoggedIn = user.loggedIn;

  const avatar = userData.avatar;
  const AvatarLib = isLoggedIn ? avatars[avatar.avatarIdx].IconLib : Icons.FontAwesome;
  const avatarName = isLoggedIn ? avatars[avatar.avatarIdx].IconName : "user";
  const avatarColor = isLoggedIn ? avatar.avatarColor : "black";

  const totalScore = userData.score.reduce((a, b) => a + b, 0);
  const level = 1 + Math.floor(totalScore / PARAMS.TH_SCORE)

  const onCapture = async () => {

    viewShot.current.capture()
      .then((uri) => {
        if (!uri) {
          console.log('uri is null')
        }
        else {
          openShareDialogAsync(uri);
        }
        onClose();
      })
      .catch((err) => {
        console.log(err);
        onClose();
      })
  };

  const onClose = () => {
    setQuoteIdx(Math.floor(Math.random() * quotes.length));
    onRequestClose();
  }

  return (
    <Modal
      visible={visible}
      animationType={"fade"}
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.popup, styles.shadowProp, { backgroundColor: "white" }]}>
          <ViewShot ref={viewShot} options={{ format: "jpg", quality: 0.9 }} style={{ width: '95%', aspectRatio: 1, alignSelf: 'center' }}>
            <ImageBackground
              source={require("../assets/sky.jpg")}
              resizeMode={"cover"}
              style={{ aspectRatio: 1, width: "100%", alignItems: "center", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  color: "black",
                  marginTop: "10%",
                  marginHorizontal: "2%",
                  fontSize: 24,
                  textShadowRadius: 15,
                  fontFamily: 'sans-serif-medium',
                  flexDirection: "column",
                  textAlign: 'center',
                }}
              >
                {quotes[quoteIdx]}
              </Text>
              <View>
                <View style={styles.userInfoContainer}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.accountButton}>
                      <View
                        style={styles.avatarIcon}>
                        <AvatarLib name={avatarName} size={30} color={avatarColor} />
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
                      <View style={{ flexDirection: "column" }} >
                        <Text style={styles.subtext}>
                          {userData.fullname}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: "center" }} >
                          <Text style={styles.subtext}>Level:</Text>
                          <View style={styles.levelIcon}>
                            <Text style={styles.levelTextNum}>{level.toString().padStart(2, "0")}</Text>
                          </View>
                        </View>
                      </View>
                      <Image
                        source={require("../assets/logo.png")}
                        resizeMode={"center"}
                        style={{ width: "50%", height: "50%" }}
                      />
                    </View>
                  </View>
                </View>
              </View>

            </ImageBackground>
          </ViewShot>
          <View style={styles.buttonsRow}>
            <Button
              icon='share'
              uppercase={false}
              style={styles.confirmButton}
              mode="contained"
              onPress={onCapture}
              labelStyle={{ letterSpacing: 0.5 }}
            >
              Share
            </Button>
            <Button
              uppercase={false}
              style={styles.confirmButton}
              mode="contained"
              onPress={onClose}
              labelStyle={{ letterSpacing: 0.5 }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal >
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center"
  },
  confirmButton: {
    backgroundColor: 'black',
    borderRadius: 8,
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
    paddingVertical: 16,
    paddingHorizontal: 10,
    width: '95%',
    height: '60%',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  field: {
    paddingVertical: 16,
  },
  buttonsRow: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  accountButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.15,
    aspectRatio: 1,
    backgroundColor: '#409909',
    borderRadius: 50,
    borderColor: "white",
    elevation: 6,
  },
  avatarIcon: {
    backgroundColor: "white",
    width: "85%",
    aspectRatio: 1,
    borderRadius: windowWidth * 0.15 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  subtext: {
    marginHorizontal: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    color: "black",
  },
  levelIcon: {
    backgroundColor: "lightblue",
    borderRadius: 14,
    borderWidth: 1,
    width: 28,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 2
  },
  infoText: { marginVertical: 10, justifyContent: "center", alignItems: "center", alignSelf: "center" },
  levelTextNum: {
    position: 'absolute',
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  userInfoContainer: {
    marginBottom: 16
  }
});

export default shareModal;