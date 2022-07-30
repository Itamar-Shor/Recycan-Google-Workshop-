import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get("window").width;

export default function AppIntro({setIsFirstTime}) {

    const slides = [
        {
          key: 1,
          title: 'Recycan',
          text: 'Welcome',
          image: require('../assets/intro_1.png'),
          backgroundColor: '#22bcb5',
        },
        {
          key: 2,
          title: undefined,
          text: 'Sign in to collect points and stars!',
          image: require('../assets/intro_2.png'),
          backgroundColor: '#22bcb5',
        },
        {
          key: 3,
          title: undefined,
          text: 'Learn what goes where',
          image: require('../assets/intro_3.png'),
          backgroundColor: '#22bcb5',
        },
        {
          key: 4,
          title: undefined,
          text: 'Find sites around you',
          image: require('../assets/intro_4.png'),
          backgroundColor: '#22bcb5',
        },
        {
          key: 5,
          title: undefined,
          text: 'Press to find sites on map',
          image: require('../assets/intro_5.png'),
          backgroundColor: '#22bcb5',
        }
    ];

    const _onDone = async () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        AsyncStorage.setItem("@DONE_INTRO", 'true')
        .then(() => {
        setIsFirstTime(false);
        })
        .catch(e => {
        console.log(e);
        })
    }

    const _renderItem = ({ item }) => {
        return (
          <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
            {item.title != undefined ? <Text style={styles.headline}>{item.title}</Text> : null}
            <Image source={item.image} style={item.key == 1 ? styles.WelcomeImage : styles.OrientationImage}/>
            <Text style={styles.line}>{item.text}</Text>
          </View>
        );
      }

    return (
        <AppIntroSlider 
            renderItem={_renderItem} 
            data={slides} 
            onDone={_onDone}
        />
    );
}
const styles = StyleSheet.create({
  slide:{
    flex:1,
    //justifyContent:'space-evenly',
    paddingVertical: 36,
  },
  WelcomeImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: "20%"
  },
  OrientationImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop:16,
    width:'100%',
    height:'85%',
  },
  headline:{
    fontWeight: 'bold',
    fontSize: windowWidth*0.15,
    textAlign: 'center',
    color: 'white'
  },
  line:{
    fontSize: 22,
    textAlign: 'center',
    color: 'white',
    marginTop:16,
  },
});