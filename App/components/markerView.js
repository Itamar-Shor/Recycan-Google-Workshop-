import React, { createRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { BINS } from '../globals/bins';
import * as Icons from '@expo/vector-icons';
import { RoundButton } from './buttons';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { BinIcon } from './binIcon';
import { reportMissingSite_req } from '../utils/requests'
import { showError } from '../utils/messages';
import { UserContext } from '../globals/userContext';

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export class MarkerView extends React.Component {

  constructor(props) {
    super(props);
    this._panelRef = createRef();
  }

  _reportMissing = async (site_id) => {
    try {
      const data = await reportMissingSite_req(site_id);
      this.hide();
    } catch (err) {
      console.log(err);
      showError("Couldn't send report to server. Please try again later.");
    }
    this.props.onPressMissing(site_id);
  }

  show() {
    this._panelRef.current.show(windowHeight * 0.4);
  }

  hide() {
    this._panelRef.current.hide();
  }

  render() {

    const draggableRange = {
      top: windowHeight * 0.4, bottom: 0
    };

    const panelHeight = draggableRange.top;
    const snappingPoints = [windowHeight * 0.4];

    return (
      <SlidingUpPanel
        ref={this._panelRef}
        animatedValue={new Animated.Value(0)}
        draggableRange={draggableRange}
        height={panelHeight}
        snappingPoints={snappingPoints}
        showBackdrop={false}
        containerStyle={{ elevation: 4 }}
        minimumDistanceThreshold={25}
        minimumVelocityThreshold={0.5}
      >
        <PanelComponent
          marker={this.props.marker}
          onPressRoute={this.props.onPressRoute}
          onPressMissing={this._reportMissing}
        />
      </SlidingUpPanel>
    );
  }
}

export const PanelHeader = ({ bin, containerStyle, handleStyle }) => {
  return (
    <View style={containerStyle}>
      <View style={styles.handleContainer}>
        <View style={handleStyle} />
      </View>
      <View style={styles.iconRow}>
        <BinIcon bin={bin} color={"#e9e9e9"} size={30} />
      </View>
    </View>
  );
}

export const PanelComponent = ({ marker, onPressRoute, onPressMissing }) => {
  if (marker !== null) {

    const info = BINS[marker.itemType];
    const notes = info.notes;
    const address = marker.address;
    const [user, _] = React.useContext(UserContext);

    return (
      <View style={styles.panelContent}>

        <PanelHeader
          bin={info}
          containerStyle={[styles.panelTop, { backgroundColor: info.color }]}
          handleStyle={styles.handle}
        />

        <View style={styles.panelMiddle}>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.panelTitle}>
              {`${info.name} Bin`}
            </Text>
          </View>
          <Text style={styles.panelSubtext}>
            {`${address}`}
          </Text>

        </View>

        <View style={styles.panelButtonRow}>

          <RoundButton
            style={[styles.panelButton, { backgroundColor: '#10942e' }]}
            onPress={onPressRoute}
            containerStyle={{ paddingHorizontal: 4 }}
          >
            <Icons.MaterialIcons name={"directions"} size={26} color={"white"} />
            <Text style={styles.buttonText}>Directions</Text>
          </RoundButton>

          <RoundButton
            style={styles.panelButton}
            onPress={() => {
              if (user.loggedIn) {
                onPressMissing(marker.id);
              } else {
                showError("Sign in to report");
              }
            }}
            containerStyle={{ paddingHorizontal: 4 }}
          >
            <Icons.MaterialIcons name={"report"} size={26} color={"white"} />
            <Text style={styles.buttonText}>Not There</Text>
          </RoundButton>

        </View>

        <View style={styles.panelBottom}>
          {notes && notes.map((note, idx) => {
            return (
              <View style={styles.noteContainer} key={idx}>
                <Icons.FontAwesome
                  name={"warning"}
                  style={{ alignSelf: "center" }}
                  size={18}
                  color="#ff9966"
                />
                <Text style={{ flexWrap: 'wrap', flex: 1, marginHorizontal: 8 }}>{note}</Text>
              </View>
            );
          })}
        </View>

      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  panelContent: {
    height: "100%",
    width: "100%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  panelTop: {
    height: "20%",
    padding: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  panelBarItemContainer: {
    justifyContent: "center",
  },
  panelMiddle: {
    padding: 8,
  },
  panelTitle: {
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 22
  },
  panelSubtext: {
    marginBottom: 12,
    color: "gray",
    fontSize: 16
  },
  panelButtonRow: {
    padding: 4,
    flexDirection: "row",
  },
  panelButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
  },
  handleContainer: {
    height: 12,
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  handle: {
    backgroundColor: "#ededed",
    borderRadius: 16,
    width: 40,
    height: 6,
    opacity: 0.5
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonText: {
    marginHorizontal: 4,
    fontSize: 18,
    color: "white",
    fontWeight: "700"
  },
  panelBottom: {
    padding: 8
  },
  noteContainer: {
    flexDirection: "row",
    marginVertical: 4,
    justifyContent: "center",
  }
})
