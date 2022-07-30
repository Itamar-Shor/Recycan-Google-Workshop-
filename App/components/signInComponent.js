import React, { useContext, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { UserContext } from "../globals/userContext";
import { signIn } from "../utils/login";
import { GoogleSignInButton } from "./buttons";


export default function signInComponent({ style = styles.signInContainer, onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useContext(UserContext);

  const login = async () => {
    setIsLoading(true);
    const status = await signIn(setUser);
    if (onLogin) onLogin(status);
  }

  return (
    <View style={style}>
      <GoogleSignInButton onLogin={login} />
      {isLoading && <ActivityIndicator animating={isLoading} size={'large'} color={'#999999'} />}
    </View>
  );
}

const styles = StyleSheet.create({
  signInContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    marginHorizontal: '10%'
  },
});

