import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import * as Icons from '@expo/vector-icons'
import { Button } from 'react-native-paper';

export const TogglableButton = ({ iconLib: IconLib,
  iconName,
  iconSize,
  color,
  onPress,
  onLongPress,
  isPressed
}) => {

  const buttonStyle = isPressed ? [styles.Pressed, { backgroundColor: color, borderColor: 'white' }] : [styles.unPressed, { backgroundColor: 'white', borderColor: color }]
  const iconColor = isPressed ? 'white' : color

  const _onPress = () => {
    onPress();
  }

  const _onLongPress = () => {
    onLongPress();
  }

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={buttonStyle}
      onLongPress={_onLongPress}
      onPress={_onPress}
    >
      {isPressed ? <Icons.MaterialIcons name={"location-pin"} size={18} color={'black'} style={styles.checkIcon} /> : null}
      <IconLib name={iconName} size={iconSize} color={iconColor} style={{ position: 'absolute', zIndex: 1 }} />
    </TouchableOpacity>
  );
}

export const RoundButton = ({ style, onPress, children, containerStyle = {} }) => {
  const shadowProp = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  };
  const btnContainerStyle = {
    borderRadius: style?.borderRadius || 0,
    overflow: "hidden",
    elevation: style?.elevation || 0,
    ...containerStyle
  };

  return (
    <View style={shadowProp}>
      <View style={btnContainerStyle}>
        <Pressable
          style={style}
          onPress={onPress}
          android_ripple={{ color: "#f0f0f0" }}
        >
          {children}
        </Pressable>
      </View>
    </View>
  );
}


export const GoogleSignInButton = ({ onLogin }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        icon="google"
        mode="contained"
        color="black"
        onPress={() => {
          onLogin();
        }}
        uppercase={false}
        labelStyle={{ fontSize: 16 }}
      >
        Sign in with Google
      </Button>
    </View>
  );
}

export const SignOutBtn = ({ clickHandler }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        mode="contained"
        color="black"
        onPress={() => clickHandler()}
        uppercase={false}
        labelStyle={{ fontSize: 16 }}
      >
        Sign out
      </Button>
    </View>
  );
}

export const FadingButton = ({ shown, style, onPress, children, containerStyle = {} }) => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shown) {
      fadeIn();
    }
    if (!shown) {
      fadeOut();
    }
  }, [shown]);

  const fadeIn = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true
    }).start();
  }

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      setVisible(false);
    });
  }


  return (
    visible ? (
      <Animated.View style={{ opacity: fadeAnim }}>
        <RoundButton
          style={style}
          onPress={onPress}
          containerStyle={containerStyle}
        >
          {children}
        </RoundButton>
      </Animated.View>
    ) : null
  )
}


const styles = StyleSheet.create({
  unPressed: {
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "100%",
    borderRadius: 50,
    elevation: 3,
  },
  Pressed: {
    borderWidth: 3,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "100%",
    borderRadius: 50,
    elevation: 1
  },
  checkIcon: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    paddingVertical: 8,
  }
});