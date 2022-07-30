import React, { useState, useEffect } from 'react';
import FlashMessage from "react-native-flash-message";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { signOut } from './utils/login'
import { UserContext, defaultUser } from './globals/userContext';
import HomeScreen from './screens/main'
import Information from './screens/information';
import MyAccount from './screens/account';
import { SignOutBtn } from './components/buttons';
import BinList from './screens/binList';
import signInComponent from './components/signInComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntro from './screens/appIntro';
import { MarkersContext } from './globals/markersContext';
import AppLoadingScreen from './screens/appLoadingScreen';

console.log = function () {};

export default function App() {

  const [isFirstTime, setIsFirstTime] = useState(true);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("@DONE_INTRO")
      .then(value => {
        if (value) {
          setIsFirstTime(false);
        }
      })
      .catch(e => {
        console.log(e);
      })
  }, []);
 
  const [user, setUser] = useState(defaultUser);

  const signout = async () => {
    setUser(defaultUser);
    const status = await signOut(setUser);
  }

  const Stack = createNativeStackNavigator();

  return (
    isFirstTime ?
      <AppIntro setIsFirstTime={setIsFirstTime} />
      :
      <UserContext.Provider value={[user, setUser]}>
        <MarkersContext.Provider value={[markers, setMarkers]}>
          <NavigationContainer>
            <Stack.Navigator
            >
              <Stack.Screen
                name="Loading"
                component={AppLoadingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BinList"
                component={BinList}
                options={{
                  title: "Directions",
                  headerShadowVisible: false,
                  animation: "fade"
                }}
              />
              <Stack.Screen
                name="Info"
                component={Information}
                options={{ title: "What Goes Where?" }}
              />
              <Stack.Screen
                name="Account"
                component={user.loggedIn ? MyAccount : signInComponent}
                options={{
                  title: "My Account",
                  headerRight: () => (user.loggedIn ? <SignOutBtn clickHandler={signout} /> : null)
                }}
              />
            </Stack.Navigator>

          </NavigationContainer>
          <FlashMessage position="top" />
        </MarkersContext.Provider>
      </UserContext.Provider>
  );
}