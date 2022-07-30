import React, { useContext, useState } from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import { BINS } from "../globals/bins";
import * as Icons from '@expo/vector-icons';
import { BinIcon } from "./binIcon";
import { Button } from 'react-native-paper';
import ShareModal from './shareModal';
import { UserContext } from "../globals/userContext";
import LoginModal from "./loginModal";

export const NavigationInfo = ({ marker, distance, onClose }) => {
  return (
    <View style={styles.navigationCardContainer}
    >
      <View style={styles.whiteContainer}
      >
        <BinView binId={marker.itemType} />

        <View style={{
          flexDirection: "column",
          justifyContent: "space-around",
          marginHorizontal: 8,
        }}
        >

          <Text
            style={{ fontWeight: "700" }}
          >
            {BINS[marker.itemType].name}
          </Text>

          <Text>
            {marker.address}
          </Text>

          <Text>{distance} km</Text>

        </View>
        <CloseButton onClose={onClose} />
      </View>
    </View>
  );
}

export const NavigationCard = ({ marker, distance, onClose, onClaim, reachedDestination = true }) => {
  if (!reachedDestination) {
    return <NavigationInfo marker={marker} distance={distance} onClose={onClose} />;
  } else {
    return <ScorePopup marker={marker} onClose={onClose} onClaim={onClaim} />
  }
}

const BinView = ({ binId }) => {
  return (
    <View style={{
      height: "100%",
      width: 50,
      backgroundColor: BINS[binId].color,
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <BinIcon bin={BINS[binId]} size={30} color="white" />
    </View>

  );
}

const CloseButton = ({ onClose }) => {
  return (
    <TouchableHighlight
      underlayColor="#ebebeb"
      activeOpacity={0.5}
      onPress={onClose}
      style={{ position: "absolute", height: 30, right: 0 }}
    >
      <Icons.MaterialIcons name="close" color="#1f1f1f" size={30} />
    </TouchableHighlight>

  );
}

const ScorePopup = ({ marker, onClose, onClaim }) => {

  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [user, _] = useContext(UserContext);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  return (
    <View style={styles.scorePopupContainer}
    >
      <View style={styles.whiteContainer}
      >
        <BinView binId={marker.itemType} />

        <View style={{
          flexDirection: "column",
          justifyContent: "space-around",
          marginHorizontal: 8,
        }}
        >

          <Text
            style={{ fontWeight: "700" }}
          >
            You have reached your destination
          </Text>

          <View style={{ flexDirection: "row" }}>
            <Text>
              You receive:
            </Text>

            <Text style={{ color: BINS[marker.itemType].color, marginLeft: 4 }}>
              +10 points
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Button
              uppercase={false}
              icon={"star-four-points"}
              color="black"
              mode="contained"
              onPress={onClaim}
              style={{ marginHorizontal: 8, borderRadius: 15 }}
            >
              Claim
            </Button>

            <Button
              uppercase={false}
              icon={"share"}
              color="black"
              mode="contained"
              onPress={() => {user.loggedIn ? setShareModalVisible(true) : setLoginModalVisible(true) }}
              style={{ marginHorizontal: 8, borderRadius: 15 }}
            >
              Share
            </Button>
          </View>

        </View>

        <CloseButton onClose={onClose} />
      </View>

      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        action={'share'}
        onLogin={() => setShareModalVisible(true)}
      />

      <ShareModal
          visible={isShareModalVisible}
          onRequestClose={()=>setShareModalVisible(false)}
          color={BINS[marker.itemType].color}
      />

    </View >
  );
}

const styles = StyleSheet.create({
  navigationCardContainer: {
    width: "100%",
    height: "12%",
    elevation: 0,
  },
  whiteContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    elevation: 6,
    flexDirection: "row",
    marginTop: 12,
  },
  scorePopupContainer: {
    width: "100%",
    height: "24%",
    elevation: 0,
  }
})