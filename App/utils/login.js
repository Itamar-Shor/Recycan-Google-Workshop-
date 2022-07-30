import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-google-app-auth';
import { requestLogout, requestMe, requestSignIn } from './requests';
import { defaultUser } from '../globals/userContext';
import { showError } from './messages';

export const isLoggedIn = async () => {
  try {
    const user = await AsyncStorage.getItem('@USER');
    if (user !== null) {
      console.log(user);
      return true
    }
    else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const signIn = async (setUser) => {
  try {
    const result = await Google.logInAsync({
      clientId: '967839043442-eh9f9ovvt2kv118qgc94jc0oje62jovv.apps.googleusercontent.com',
      androidClientId: "967839043442-eh9f9ovvt2kv118qgc94jc0oje62jovv.apps.googleusercontent.com",
      scopes: ['email', 'profile']
    });

    if (result.type === 'success') {
      const user = await requestSignIn(result.idToken);
      await AsyncStorage.setItem("@USER", JSON.stringify(user));
      const me = await requestMe();
      setUser({
        data: me,
        loggedIn: true
      });
      return true;
    } else {
      throw new Error("Login not successful");
    }

  } catch (error) {
    console.log(error);
    showError("Sign in failed");
    return false;
  }
};

export const signOut = async (setUser) => {
  try {
    await requestLogout();
    await AsyncStorage.removeItem('@USER');
    return true;
  }
  catch (error) {
    console.log(error);
    return false;
  } finally {
    setUser(defaultUser);
  }
}
