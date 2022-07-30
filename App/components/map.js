import React from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { BINS } from '../globals/bins'
import MapViewDirections from 'react-native-maps-directions';
import haversine from 'haversine';
import { showError } from '../utils/messages';
import { getClosestSites, MarkersContext } from '../globals/markersContext';
//const LATITUDE_DELTA = 0.0922;
//const LONGITUDE_DELTA = 0.0421;

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const LATITUDE_DELTA = 0.00022;
const LONGITUDE_DELTA = 0.0095;

const INITIAL_REGION = {
  latitude: 32.115203144774654,
  longitude: 34.80411936215537,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

/*
  BinType: String
  StreetName: String
  location:
    coordinate: [longitude, latitude]
*/


export default class MapComponent extends React.Component {
  static contextType = MarkersContext;

  constructor(props) {
    super(props);

    this.state = {
      followUserLocation: false,
      showDirections: false,
    }

    this.props = props;
    this._location = null;
    this._region = INITIAL_REGION;
    this._lastSearchRegion = null;
    this._mapViewRef = React.createRef();
    this._navDestination = null;
    this._navOrigin = null;
  }

  _handleLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status != 'granted') {
      Alert.alert("Location unavailable", "Permission denied", { text: "OK" });
    }
  }

  _onLocationChange = (location) => {
    this._location = location.nativeEvent.coordinate;
    if (this.state.followUserLocation && this.state.showDirections) {
      this._animateToUserLocation();
    }
    this.props.onLocationChange(this._location);
    this._checkDestReach();
  }

  _checkDestReach = () => {
    if (this.state.showDirections && (haversine(this._location, this._navDestination, { unit: "meter" }) < 20)) {
      console.log("finished navigating");
      this.setState({showDirections: false});
      setTimeout(() => this.props.onDestinationReach(), 500);
    }
  }

  _onRegionChange = (region) => {
    this._region = region;
    if (!this.inLastSearchRegion()) {
      this.props.onLeaveLastSearchRegion();
    }
  }

  inLastSearchRegion = () => {
    if (!this._lastSearchRegion) {
      return false;
    }

    const last = {
      latitude: this._lastSearchRegion.latitude,
      longitude: this._lastSearchRegion.longitude
    };
    const curr = {
      latitude: this._region.latitude,
      longitude: this._region.longitude
    };

    return haversine(last, curr, { threshold: 2 });
  }

  _locationToRegion = () => {
    return {
      latitude: this._location.latitude,
      longitude: this._location.longitude,
      latitudeDelta: 0.007,
      longitudeDelta: 0.00011
    }
  }

  _animateToUserLocation = () => {
    this._mapViewRef.current.animateToRegion(this._locationToRegion(), 500);
  }

  setCoordinates = (coordinates) => {
    const newRegion = {
      latitudeDelta: 0.007,
      longitudeDelta: 0.00011,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }
    this._mapViewRef.current.animateToRegion(newRegion, 100);
  }

  animateToUserLocation = async () => {
    try {
      await this._handleLocationPermission();
      if (this.state.showDirections) {
        this.setState({ followUserLocation: true });
      }
      this._animateToUserLocation();
    } catch (e) { }
  }

  updateMap = async (force = false) => {

    const [markers, setMarkers] = this.context;

    if (!force && this.inLastSearchRegion()) return markers;

    try {
      setMarkers([]);
      const result = await getClosestSites(this._region);
      setMarkers(result.markers);
      this._lastSearchRegion = this._region;
      return result.status;
    } catch (err) {
      console.log(err);
      showError("Couldn't get data from server. Please try again later.");
      return null;
    }
  }

  _onMarkerPress = (mkrprops) => {
    if (this.state.showDirections) return;
    this.props.onMarkerPress(mkrprops);
  }

  _onDrag = (event) => {
    this.setState({ followUserLocation: false });
    return true;
  }

  _getRegion = () => {
    return this.state.showDirections ? this._locationToRegion() : this._region
  }

  startNavigation = (destMarker) => {
    this._navOrigin = this._location;
    this._navDestination = destMarker.coordinate;
    this.setState({ showDirections: true });
  }

  _onNavigationReady = (result) => {
    this._mapViewRef.current.fitToCoordinates([this._navOrigin, this._navDestination], {
      edgePadding: {
        right: 20,
        bottom: 20,
        left: 20,
        top: 20,
      }
    });
    this.props.onNavigationReady(result);
  }

  endNavigation = () => {
    this.setState({ showDirections: false });
  }

  render() {

    const [markers, setMarkers] = this.context;

    return (
      <MapView
        ref={this._mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsMyLocationButton={false}
        showsUserLocation={true}
        onMoveShouldSetResponder={this._onDrag}
        toolbarEnabled={false}
        onMapReady={this._handleLocationPermission}
        onUserLocationChange={this._onLocationChange}
        onRegionChange={this._onRegionChange}
        mapPadding={{ top: 200, left: 8, right: 8 }}
        customMapStyle={mapStyle}
      >
        {
          markers && markers.map(((mkrprops, idx) => {
            if (this.props.visibleTypes[mkrprops.itemType]) {
              return (
                <Marker key={idx}
                  coordinate={mkrprops.coordinate}
                  onPress={() => this._onMarkerPress(mkrprops)}
                  pinColor={
                    BINS[mkrprops.itemType].overridePinColor ?
                      BINS[mkrprops.itemType].overridePinColor : BINS[mkrprops.itemType].color
                  }
                />
              );
            } else {
              return null;
            }
          }))
        }

        {this.state.showDirections &&
          <MapViewDirections
            lineDashPattern={[0]}
            origin={this._navOrigin}
            destination={this._navDestination}
            onReady={this._onNavigationReady}
            apikey={"AIzaSyBP8YX_yvbqNxuaVyz6oP9qR6YGIXcsAmM"}
            strokeWidth={4}
            strokeColor="#111111"
            mode="WALKING"
          />
        }
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

const mapStyle = [
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.station.bus",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]