import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, StatusBar, Animated, BackHandler, Keyboard } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { showError } from "../utils/messages";
import { requestCoordinates } from "../utils/requests";
import { ResultsList } from "./lists";
import { SectionHeader } from "./sectionHeader";

const RECENT = [
  {
    text: 'Location 1',
    coordinates: { latitude: 32.08521129897319, longitude: 34.77489143931317 },
    category: 'recents'
  },
  {
    text: 'Location 2',
    coordinates: { latitude: 32.08521129897319, longitude: 34.77489143931317 },
    category: 'recents'
  },
  {
    text: 'Location 3',
    coordinates: { latitude: 32.08521129897319, longitude: 34.77489143931317 },
    category: 'recents'
  }
];

const windowHeight = Dimensions.get("window").height;

export class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ''
    };
    this.state = {
      fadeValue: new Animated.Value(0),
      visible: false,
      recents: [],
      results: [],
    };
  }

  backAction = () => {
    if (this.state.visible) {
      this.hide();
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  setResults(results) {
    this.setState({ results });
  }

  show() {
    this.setState({ visible: true })
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: 0
    }).start();
  }

  hide() {
    const results = this.state.results.map((item) => {
      return {
        ...item,
        category: 'recents'
      };
    });
    const recents = results.concat(this.state.recents).filter((item, idx) => idx < 5);
    this.setState({ recents });
    this.setState({ results: [] });
    Keyboard.dismiss();
    this.props.onClose()
    Animated.timing(this.state.fadeValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      this.setState({ visible: false });;
    });
  }

  _onPressItem = (item) => {
    this.props.onSearch(item.coordinates);
    this.hide();
  }

  render() {

    return this.state.visible && (
      <Animated.View
        style={{
          ...styles.panelContainer,
          opacity: this.state.fadeValue,
        }}
      >
        <View style={styles.contentContainer}>
          <SectionHeader icon={"map-search-outline"} title={"Results"} />
          <ResultsList
            data={[...this.state.results, ...this.state.recents]}
            onPressItem={this._onPressItem}
            icon={(item, index) => (
              <View style={{justifyContent: "center", alignContent: "center"}}>
                <MaterialCommunityIcons
                  name={item.category === 'recents' ? "history" : "map-marker"}
                  size={30}
                  color={"grey"}
                />
              </View>
            )}
          />
        </View>
      </Animated.View>
    );
  }
}

export const SearchBar = ({ onFocus, onSearchResult }) => {

  const [searchQuery, setSearchQuery] = React.useState('');
  const inputRef = useRef(null);

  const backAction = () => {
    if (inputRef.current.isFocused()) {
      inputRef.current.blur();
    }
    return false;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const onChangeSearch = query => setSearchQuery(query);

  const onSubmit = async (text) => {
    try {
      const data = await requestCoordinates(text);
      const results = data.map((item, idx) => {
        return {
          category: "results",
          text: item.formatted,
          coordinates: { latitude: item.geometry.lat, longitude: item.geometry.lng }
        };
      });
      onSearchResult(results);
    } catch (e) {
      console.log(e);
      showError("Couldn't get search results from server");
    }
  }

  return (
    <View style={styles.searchbarContainer}>
      <Searchbar
        ref={inputRef}
        placeholder={inputRef.current && inputRef.current.isFocused() ? "Search" : "Where do you want to recycle?"}
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={{ borderRadius: 16 }}
        onFocus={onFocus}
        blurOnSubmit={true}
        onSubmitEditing={(e) => onSubmit(e.nativeEvent.text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "white",
  },
  contentContainer: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: StatusBar.currentHeight,
  },
  searchbarContainer: {
    marginVertical: 12,
    marginHorizontal: 8,
  },
  title: {
    fontWeight: "700",
    marginHorizontal: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginVertical: 28,
  },
  resultsItemText: {
    left: 32,
    width: "80%"
  },
  favoritesItemText: {
    marginHorizontal: 4,
  }
})