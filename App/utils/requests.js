import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverUrl = "https://flowing-sign-341109.lm.r.appspot.com";

const authorizationHeaders = (token) => {
  return { 'Authorization': `Bearer ${token}` }
}

const handleResponse = async (res) => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Response was not ok");
  }
}

export const requestBins = (coordinate, radius) => {
  return fetch(`${serverUrl}/bins/getBin/distance?lat=${coordinate.latitude}&lon=${coordinate.longitude}&radius=${radius}`)
    .then(handleResponse);
}

export const requestSignIn = async (idToken) => {
  const requestOptions = {
    method: "POST",
    headers: authorizationHeaders(idToken)
  }
  return fetch(`${serverUrl}/users/login`, requestOptions).then(handleResponse);
}

export const requestLogout = async () => {
  const userString = await AsyncStorage.getItem("@USER");
  if (userString) {
    const user = JSON.parse(userString);
    return fetch(`${serverUrl}/users/logout`, {
      method: "POST",
      headers: authorizationHeaders(user.token),
    }).then(handleResponse);
  } else {
    return Promise.reject(new Error("Not logged in"));
  }
}

export const requestMe = async () => {
  const userString = await AsyncStorage.getItem("@USER");
  if (userString) {
    const user = JSON.parse(userString);
    return fetch(`${serverUrl}/users/me`, {
      headers: authorizationHeaders(user.token)
    }).then(handleResponse);
  } else {
    return Promise.reject(new Error("Not logged in"));
  }
}

export const requestCoordinates = async (place) => {
  return fetch(`${serverUrl}/location/coordinates?address=${place}`).then(handleResponse);
}

export const reportMissingSite_req = async (bin_id) => {

  const userString = await AsyncStorage.getItem("@USER");
  if (userString) {
    const user = JSON.parse(userString);

    const requestOptions = {
      method: "POST",
      headers: { ...authorizationHeaders(user.token), 'Content-Type': "application/json" },
      body: JSON.stringify({ id: bin_id }),
    }
    return fetch(`${serverUrl}/bins/reportMissingBin`, requestOptions).then(handleResponse);

  } else {
    return Promise.reject(new Error("Not logged in"));
  }

}

export const reportNewSite_req = async (bin) => {

  const userString = await AsyncStorage.getItem("@USER");
  if (userString) {
    const user = JSON.parse(userString);

    const requestOptions = {
      method: "POST",
      headers: { ...authorizationHeaders(user.token), 'Content-Type': "application/json" },
      body: JSON.stringify(bin)
    }
    return fetch(`${serverUrl}/bins/reportNewBin`, requestOptions).then(handleResponse);

  } else {
    return Promise.reject(new Error("Not logged in"));
  }

}

export const patchScore = async (newScore) => {
  const userString = await AsyncStorage.getItem("@USER");
  if (userString) {
    const user = JSON.parse(userString);

    const requestOptions = {
      method: "PATCH",
      headers: { ...authorizationHeaders(user.token), 'Content-Type': "application/json" },
      body: JSON.stringify({score: newScore})
    }
    return fetch(`${serverUrl}/users/me`, requestOptions).then(handleResponse);

  } else {
    return Promise.reject(new Error("Not logged in"));
  }
}

export const patchAvatar = async (newAvatar) => {
  const userString = await AsyncStorage.getItem("@USER");
  if (userString) {
    const user = JSON.parse(userString);

    const requestOptions = {
      method: "PATCH",
      headers: { ...authorizationHeaders(user.token), 'Content-Type': "application/json" },
      body: JSON.stringify({avatar: newAvatar})
    }
    return fetch(`${serverUrl}/users/me`, requestOptions).then(handleResponse);

  } else {
    return Promise.reject(new Error("Not logged in"));
  }
}

export const patchUser = async (avatar=null, score=null) => {
  const userString = await AsyncStorage.getItem("@USER");
  if (userString) {
    const user = JSON.parse(userString);
    let body = {};
    if (avatar) body['avatar'] = avatar;
    if (score) body['score'] = score;
    const requestOptions = {
      method: "PATCH",
      headers: { ...authorizationHeaders(user.token), 'Content-Type': "application/json" },
      body: JSON.stringify(body)
    }
    return fetch(`${serverUrl}/users/me`, requestOptions).then(handleResponse);

  } else {
    return Promise.reject(new Error("Not logged in"));
  }

}