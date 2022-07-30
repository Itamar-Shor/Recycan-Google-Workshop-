import React, { useContext } from "react";
import { UserContext } from "../globals/userContext";
import { View, StyleSheet, Modal, Text, Dimensions } from "react-native";
import { RoundButton } from "./buttons";
import * as Icons from '@expo/vector-icons'
import PARAMS from '../globals/params'

const windowWidth = Dimensions.get("window").width;


const ProgressInfo = ({ onCancel, visible }) => {
    const [user, setUser] = useContext(UserContext);
    const userData = user.data;
    const name = userData.fullname;

    return (
        <Modal
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            animationType={"fade"}
        >
            <View style={styles.centeredView}>
                <View style={[styles.popup, styles.shadowProp]}>
                    <View>
                        <Text style={{ fontSize: 35, margin: 10, color: '#409909', fontWeight: 'bold' }}>
                            Hi {name} !
                        </Text>
                        
                        <Text style={{ fontSize: 18, margin: 10, color: 'black' }}>
                            <Text>When you use Recycan to sort your waste, you get </Text>
                            <Text style={{ fontWeight: 'bold', color: '#409909' }} >10 points for each recycle!</Text>
                        </Text>
                        <Text style={{ fontSize: 18, margin: 10, color: 'black' }}>
                            <Text>The points that you gain are divided by waste type, and every time you get a total of </Text>
                            <Text style={{ fontWeight: 'bold' }}></Text>
                            <Text style={{ fontWeight: 'bold' }}>{PARAMS.TH_SCORE} points at a specific waste type</Text>
                            <Text> - you earn a star, once you get 3 stars you become a </Text>
                            <Text style={{ fontWeight: 'bold'}}>recycling master</Text>
                        </Text>
                        <Text style={{ fontSize: 18, margin: 10, color: 'black' }}>
                            <Text>Your </Text>
                            <Text style={{ fontWeight: 'bold' }}>total points </Text>
                            <Text>determine your</Text>
                            <Text style={{ fontWeight: 'bold' }}> level.</Text>
                        </Text>
                        <Text style={{ fontSize: 18, margin: 10, color: 'black' }}>
                            <Text>When you level up, you unlock </Text>
                            <Text style={{ fontWeight: 'bold' ,  color:'#409909' }}>brand new and exciting avatars!</Text>
                        </Text>



                    </View>
                    <View style={{ alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-around', height: '20%' }}>
                        <RoundButton
                            style={[styles.actionButton, styles.shadowProp]}
                            onPress={() => {
                                onCancel();
                            }}
                        >
                            <Icons.FontAwesome name={"remove"} size={25} color={"white"} />
                        </RoundButton>
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
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        padding: 10
    },
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 4,
    },
    popup: {
        borderRadius: 12,
        width: '95%',
        height: '78%',
        alignSelf: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        padding: 10,
    },
    confirmBtn: {
        backgroundColor: 'white',
        borderRadius: 1,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        width: windowWidth * 0.14,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        backgroundColor: 'black',
        borderRadius: windowWidth * 0.07,
        margin: 5
    },
})


export default ProgressInfo;