import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, Text, Animated, Modal, TouchableHighlight, Button, Share } from 'react-native';
import { StatusBar, Image } from 'react-native';
import BinScroll, { initialButtonsState } from '../components/scrollBar';
import InfoModal from '../components/infoModal';
import * as Icons from '@expo/vector-icons'
import MapComponent from '../components/map';
import { FadingButton, RoundButton } from '../components/buttons';
import { Shadow } from 'react-native-shadow-2';
import { SearchBar, SearchView } from '../components/searchPanel';
import { MarkerView } from '../components/markerView';
import { NavigationCard } from '../components/navigationCard';
import { UserContext } from '../globals/userContext';
import avatars from '../globals/avatars';
import ReportModal from '../components/reportModal';
import { patchScore, reportNewSite_req } from '../utils/requests'
import { BINS } from '../globals/bins';
import { showMessage } from 'react-native-flash-message';
import LoginModal from '../components/loginModal';
import PARAMS from '../globals/params'
import { showError } from '../utils/messages';
import * as Location from 'expo-location';

import { LogBox } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");


export default function Main({ route, navigation }) {

  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [navigationDistance, setNavigationDistance] = useState(null);
  const [destinationReached, setDestinationReached] = useState(false);

  const [scrollBarLongPress, setScrollBarLongPress] = useState(0);
  const [scrollBarState, setScrollBarState] = useState(initialButtonsState)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [location, setLocation] = useState(null);
  
  const [refreshButtonShown, setRefreshButtonShown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); 

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const [user, setUser] = useContext(UserContext);
  const userData = user.data;
  const isLoggedIn = user.loggedIn;

  const avatar = userData.avatar;
  const AvatarLib = isLoggedIn ? avatars[avatar.avatarIdx].IconLib : Icons.FontAwesome;
  const avatarName = isLoggedIn ? avatars[avatar.avatarIdx].IconName : "user";
  const avatarColor = isLoggedIn ? avatar.avatarColor : "black";

  const markerViewRef = useRef(null);
  const searchViewRef = useRef(null);
  const mapRef = useRef(null);

  const [nonEmptyTypes, setNonEmptyTypes] = useState(initialButtonsState);

  useEffect(() => {
    if (route.params?.dest) {
      if (isNavigating) {
        onNavigationClose();
      }
      const dest = route.params.dest;
      mapRef.current.setCoordinates(dest.coordinate);
      const newScrollBarState = { ...initialButtonsState, [dest.itemType]: true };
      setScrollBarState(newScrollBarState);
      setTimeout(() => onMarkerPress(dest), 500);
    }
  }, [route.params?.dest]);

  useEffect(() => {
    Location.enableNetworkProviderAsync()
      .then(() => { })
      .catch((e) => {
        console.log(e);
      })
  }, []);

  const onScrollBarPress = async (id) => {
    const isPressed = !scrollBarState[id];
    const newScrollBarState = { ...scrollBarState, [id]: isPressed };
    const emptyState = scrollBarState == initialButtonsState;
    let status = nonEmptyTypes;
    setScrollBarState(newScrollBarState);
    if (emptyState && isPressed) {
      status = await updateMap();
    }
    if (isPressed && !status[id] && !isUpdating) {
      showMessage({
        message: `No ${BINS[id].name.toLowerCase()} bins around`,
        type: "info",
        icon: 'auto',
        floating: true,
        hideOnPress: true,
        position: { top: StatusBar.currentHeight + 12 },
        animated: true,
        backgroundColor: "white",
        color: BINS[id].color,
        style: { borderWidth: 1 },
        titleStyle: { color: "black", fontWeight: "700" }
      });
    }
  };

  const updateMap = async (force = false) => {
    setIsUpdating(true);
    markerViewRef.current.hide();
    const status = await mapRef.current.updateMap(force);
    if (status)
      setNonEmptyTypes(status);
    setIsUpdating(false);
    return status;
  }

  const onLeaveLastSearchRegion = () => {
    if (scrollBarState !== initialButtonsState && !isNavigating) setRefreshButtonShown(true);
  }

  const onScrollBarLongPress = (PressedBtn) => {
    setScrollBarLongPress(PressedBtn)
    setInfoModalVisible(true);
  };

  const handleInfoModalConfirm = () => {
    setInfoModalVisible(false);
  };

  const onMarkerPress = (marker) => {
    if (isNavigating) return;
    setSelectedMarker(marker);
    markerViewRef.current.show();
  }

  const onPressRoute = () => {
    Location.enableNetworkProviderAsync()
      .then(() => {
        setIsUpdating(true);
        markerViewRef.current.hide();
        mapRef.current.startNavigation(selectedMarker);
      })
      .catch((e) => console.log(e))
      .finally(() => setIsUpdating(false));
  }

  const onNavigationReady = (result) => {
    setNavigationDistance(result.distance);
    setIsUpdating(false);
    setIsNavigating(true);
    setDestinationReached(false);
    setRefreshButtonShown(false);
  }

  const showSearchView = () => {
    searchViewRef.current.show();
    setIsSearchOpen(true);
  }

  const hideSearchView = () => {
    searchViewRef.current.hide();
    setIsSearchOpen(false);
  }

  const onNavigationClose = () => {
    mapRef.current.endNavigation();
    setDestinationReached(false);
    setIsNavigating(false);
  }

  const onDestinationReach = () => {
    setDestinationReached(true);
  }

  const addPoints = async () => {
    if (user.loggedIn) {
      const binType = selectedMarker.itemType;
      let newScore = user.data.score;
      newScore[binType] += 10;
      try {
        await patchScore(newScore);
        setUser({
          ...user,
          data: {
            ...user.data,
            score: newScore
          }
        });
        setIsNavigating(false);
        const text = newScore[binType] % PARAMS.TH_SCORE == 0 ?
          `You've just earned a new star in ${BINS[binType].name.toLowerCase()}`
          : "Thanks for recycling";
        showMessage({
          message: text,
          description: "+10 points",
          type: "info",
          icon: 'auto',
          floating: true,
          hideOnPress: true,
          position: { top: StatusBar.currentHeight + 12 },
          animated: true,
          backgroundColor: "white",
          color: BINS[binType].color,
          style: { borderWidth: 1 },
          titleStyle: { color: "black", fontWeight: "700" }
        });
      }
      catch (err) {
        showError("Couldn't reach the server");
      } finally {
        onNavigationClose();
      }
    } else {
      setLoginModalVisible(true);
    }
  }

  return (
    <View style={styles.screen}>

      <View style={styles.topContentContainer}>

        <View style={styles.mapContainer}>

          <MapComponent
            ref={mapRef}
            visibleTypes={scrollBarState}
            onMarkerPress={onMarkerPress}
            onDestinationReach={onDestinationReach}
            onNavigationReady={onNavigationReady}
            onLocationChange={setLocation}
            onLeaveLastSearchRegion={onLeaveLastSearchRegion}
          />

        </View>

        <View style={styles.mapOverlay}>

          {isNavigating ?
            (
              <NavigationCard
                marker={selectedMarker}
                distance={navigationDistance}
                onClose={onNavigationClose}
                onClaim={addPoints}
                reachedDestination={destinationReached}
              />
            )
            :
            (<View style={[styles.buttonRowContainer, { justifyContent: "space-between" }]}>
              <RoundButton
                style={[styles.accountButton, {backgroundColor: avatarColor}]}
                onPress={() => navigation.navigate("Account")}
              >
                <View
                  style={styles.avatarIcon}>
                  <AvatarLib name={avatarName} size={30} color={avatarColor} />
                </View>
              </RoundButton>

              <FadingButton
                shown={refreshButtonShown}
                style={styles.refreshButton}
                onPress={() => {
                  updateMap(true);
                  setRefreshButtonShown(false);
                }}
              >
                <Text style={{fontWeight: "700"}}>Search here</Text>
              </FadingButton>


              <ActivityIndicator animating={isUpdating} color="black" style={{marginHorizontal: 20}} />
            </View>)
          }

          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={[styles.buttonRowContainer, { justifyContent: "flex-end" }]}>
              <RoundButton
                style={styles.smallButton}
                onPress={() => {
                  Location.enableNetworkProviderAsync()
                    .then(() => {
                      if (location)
                        mapRef.current.animateToUserLocation()
                    })
                    .catch((e) => {
                      console.log(e);
                    })
                }}
              >
                <Icons.MaterialIcons
                  name={location ? "my-location" : "location-off"}
                  size={30}
                  color={location ? "black" : "darkred"}
                />
              </RoundButton>

            </View>

            <View style={[styles.buttonRowContainer, { justifyContent: "space-between" }]}>

              <RoundButton
                style={styles.smallButton}
                onPress={() => navigation.navigate('Info')}
              >
                <Icons.MaterialCommunityIcons name={"recycle"} size={30} color={"#000"} />
              </RoundButton>

              <RoundButton
                style={styles.actionButton}
                onPress={async () => {
                  Location.enableNetworkProviderAsync()
                    .then(() => {
                      if (location) navigation.navigate('BinList', { location, setNonEmptyTypes })
                    })
                    .catch((e) => {
                      console.log(e);
                    })
                }}
              >
                <Icons.MaterialIcons name={'directions'} size={30} color={'white'} />
              </RoundButton>

            </View>
          </View>

        </View>

      </View>

      <SearchView
        ref={searchViewRef}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(coordinates) => {
          mapRef.current.setCoordinates(coordinates);
        }}
      />

      <View style={{ backgroundColor: "#f7f7f7" }}>
        <SearchBar
          onFocus={showSearchView}
          onSearchResult={(results) => {
            searchViewRef.current.setResults(results);
          }}
        />
      </View>

      {
        !isSearchOpen &&
        <Shadow distance={5}>
          <View style={styles.scrollBarContainer}>
            <BinScroll
              onLongPress={onScrollBarLongPress}
              iconSize={25}
              onPress={onScrollBarPress}
              state={scrollBarState}
            />
          </View>
        </Shadow>
      }

      <MarkerView
        marker={selectedMarker}
        ref={markerViewRef}
        onPressRoute={onPressRoute}
        onPressMissing={async () => await updateMap(true)}
      />

      <InfoModal
        id={scrollBarLongPress}
        visible={isInfoModalVisible}
        onConfirm={handleInfoModalConfirm}
      />

      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        action={'claim points'}
        onLogin={() => addPoints()}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f7f7f7",
  },
  topContentContainer: {
    flex: 1,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    marginTop: StatusBar.currentHeight ?? 16 + 8,
    paddingHorizontal: 8,
    marginBottom: 32,
    flex: 1,
  },
  buttonRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.16,
    aspectRatio: 1,
    backgroundColor: '#409909',
    borderRadius: 50,
    elevation: 6,
  },
  smallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.16,
    aspectRatio: 1,
    backgroundColor: '#fefefe',
    borderRadius: 50,
    elevation: 6,
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
  refreshButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    backgroundColor: '#fefefe',
    borderRadius: 50,
    elevation: 6
  },
  avatarIcon: {
    backgroundColor: "white",
    width: "85%",
    aspectRatio: 1,
    borderRadius: windowWidth * 0.15 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollBarContainer: {
    width: "100%",
  },
});