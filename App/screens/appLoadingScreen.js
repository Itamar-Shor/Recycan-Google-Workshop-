import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useContext } from 'react';
import { defaultUser, UserContext } from '../globals/userContext';
import { requestMe } from '../utils/requests';

export default function AppLoadingScreen({ navigation }) {
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    requestMe()
      .then(user => {
        setUser({
          data: user,
          loggedIn: true
        });
      })
      .catch(e => {
        console.log(e);
        setUser(defaultUser);
      })
      .finally(() => {
        navigation.replace('Home');
      })
  }, []);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={{alignSelf: "center"}}>Just a moment</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
})