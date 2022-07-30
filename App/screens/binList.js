import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BinIcon } from '../components/binIcon';
import { BinToggle } from '../components/binToggle';
import { ResultsList } from '../components/lists';
import { SectionHeader } from '../components/sectionHeader';
import { BINS } from '../globals/bins';
import { getClosestSites, MarkersContext } from '../globals/markersContext';
import { ActivityIndicator } from 'react-native-paper';
import { showError } from '../utils/messages';

export default function BinList({ route, navigation }) {

  const [binType, setBinType] = useState(null);
  const [markers, setMarkers] = useContext(MarkersContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = route.params.location;

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setMarkers([]);
      getClosestSites(location)
        .then((result) => {
          setMarkers(result.markers);
          route.params.setNonEmptyTypes(result.status);
        })
        .catch(e => {
          showError("Failed to contact the server. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [location])
  );

  const filterData = (data) => {
    if (binType) {
      return data.filter(mkr => BINS[mkr.itemType].name === binType)
    } else {
      return data;
    }
  }

  const formatDistance = (dist) => {
    if (dist < 1000) {
      return `${dist.toFixed(0)} m`
    } else {
      return `${(dist / 1000).toFixed(1)} km`
    }
  }

  const Page = () => {
    return (
      <ResultsList
        data={filterData(markers).map(mkr => { return { ...mkr, text: mkr.address } })}
        onPressItem={(item) => {
          navigation.navigate({
            name: "Home",
            params: { dest: item },
            merge: true
          })
        }}
        icon={(item, index) => {
          return (
            <View style={{
              justifyContent: "center",
              alignItems: "center",
            }}>
              <BinIcon bin={BINS[item.itemType]} size={20} />
              <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
            </View>
          );
        }}
      />
    )
  }

  const LoadingIndicator = () => {
    return (
      <View style={{ marginTop: 18 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  const resultsCounter = isLoading ? "" : `(${markers.length} results)`;

  return (
    <View style={styles.container}>
      <SectionHeader icon={"map-marker-radius-outline"} title={`Around you ${resultsCounter}`} />
      <View>
        <Text
          style={{
            color: "#6b6b6b",
            marginHorizontal: 20,
          }}
        >
          Filter by type
        </Text>
        <BinToggle
          value={binType}
          onValueChange={setBinType}
        />
      </View>
      {
        isLoading ? <LoadingIndicator /> : <Page />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  distanceText: {
    color: "#3a3a3a",
    textAlign: "center",
    fontSize: 12,
    marginTop: 4
  },
  text: {
    marginHorizontal: 24
  }
})