import React, {useState} from "react";
import { StyleSheet, Modal, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { BINS_ID, BINS } from '../globals/bins'
import { RoundButton } from '../components/buttons';

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const ReportModal = ({ visible, onConfirm, onCanacel }) => {

    const [binType, setBinType] = useState(null);

    const handleBinTypePress = (id) => {
        setBinType(id);
    };

    return (
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={onConfirm}
        statusBarTranslucent={true}
        animationType={"fade"}
      >
        <View style={styles.centeredView}>
          <View style={[styles.popup, styles.shadowProp]}>
            <Text style={{textAlign: 'center'}}> Is there a bin in this location??</Text>


            {[0,1].map((part) => {
              return (<View style={styles.btnContainer} key={part}>
                {Object.values(BINS_ID).map((id) => {
                    const IconLib = BINS[id].IconLib;
                    return ( (id <= (Object.keys(BINS_ID).length / 2)*(1 + part) - 1) && (id >= (Object.keys(BINS_ID).length / 2)*part) ?
                      <RoundButton
                        style={styles.smallButton}
                        onPress={() => handleBinTypePress(id)}
                        key={id}
                      >
                      <View
                        style={styles.avatarIcon}>
                        <IconLib name={BINS[id].IconName} size={windowWidth*0.065} color={BINS[id].color} />
                      </View>
                    </RoundButton>
                    : undefined
                    );
                })}
              </View>
              );
            })}

            <View style={{alignSelf: 'center', flexDirection: 'row'}}>
              <Text style={{textAlignVertical: 'center'}}>My Location</Text>
              <RadioButton
                value={'my location'}
                status={ 'checked' }
                color="black"
                checkedColor="pink"
              />
            </View>

            <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.shadowProp, {backgroundColor: binType ? BINS[binType].color : 'black'}]}
                onPress={() => onConfirm(BINS[id].name)}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.shadowProp, {backgroundColor: 'black'}]}
                onPress={onCanacel}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
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
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    shadowProp: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
      elevation: 24
    },
    popup: {
      borderRadius: 12,
      width: '95%',
      height: '50%',
      justifyContent: 'space-between',
      alignSelf: 'center',
      paddingBottom: 12,
      backgroundColor: 'white',
    },
    btnContainer:{
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    smallButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: windowWidth * 0.15,
      aspectRatio: 1,
      backgroundColor: '#fefefe',
      borderRadius: 50,
      elevation: 6,
    },
    confirmBtn: {
      borderRadius: 8,
      width: '20%',
      height: '40%',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  });
  
  export default ReportModal