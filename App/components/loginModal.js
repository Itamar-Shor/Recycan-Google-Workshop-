import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import SignInComponent from './signInComponent';

export default function LoginModal({ visible, action = '', onClose, onLogin }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
      animationType={"fade"}
    >
      <View style={styles.centeredView}>
        <View style={styles.popup}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            {action ? `Sign in to ${action}` : 'Please sign in to continue'}
          </Text>

          <View style={{justifyContent: "space-around", paddingVertical: 24}}>
            <SignInComponent
              style={{ marginVertical: 12 }}
              onLogin={(status) => {
                onLogin(status);
                onClose();
              }}
            />

            <Button
              uppercase={false}
              onPress={onClose}
              color="black"
            >
              Not now
            </Button>
          </View>
        </View>
      </View>
    </Modal>

  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  popup: {
    borderRadius: 20,
    width: '80%',
    justifyContent: 'space-around',
    backgroundColor: "white",
    alignItems: 'center',
    alignSelf: 'center',
    padding: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  buttonContainer: {
    paddingHorizontal: 8,
  }
})
