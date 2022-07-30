import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, Dimensions, StatusBar } from "react-native";
import * as Progress from 'react-native-progress';
import Avatars from "../globals/avatars";
import { showMessage } from "react-native-flash-message";
import AvatarPicker from "../components/avatarPicker";
import * as Icons from '@expo/vector-icons'
import { UserContext } from "../globals/userContext";
import LevelView from "../components/level_view"
import { BINS } from '../globals/bins'
import { SectionGrid } from 'react-native-super-grid'
import { RoundButton } from "../components/buttons";
import ProgressInfo from "../components/progressInfoPopup"
import { PieChart } from "react-native-chart-kit";
import { patchAvatar } from "../utils/requests";
import PARAMS from '../globals/params'
import { showError } from "../utils/messages";

const windowWidth = Dimensions.get("window").width;

export default function MyAccount() {

  const [isModalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useContext(UserContext);

  const [isProgInfoModalVisible, setProgInfoModalVisible] = useState(false);


  const userData = user.data;
  const name = userData.fullname;
  const scores = userData.score;
  const avatar = userData.avatar;

  let CurrIconLib = Avatars[avatar.avatarIdx].IconLib;
  let currIconName = Avatars[avatar.avatarIdx].IconName;
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const level = 1 + Math.floor(totalScore / PARAMS.TH_SCORE)

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalConfirm = async (icon_idx, color) => {
    const newAvatar = {
      avatarIdx: icon_idx,
      avatarColor: color
    }
    try {
      setUser(
        {
          ...user,
          data: {
            ...userData,
            avatar: newAvatar
          }
        }
      );
      patchAvatar(newAvatar).catch(console.log);
      showMessage({
        message: "Avatar changed",
        type: "success",
        icon: 'auto',
        floating: true,
        position: { top: StatusBar.currentHeight + 12 }
      });
      
    } catch (err) {
      showError("Avatar change failed. Please try again later.");
    } finally {
      setModalVisible(false);
    }
    
  };

  const handleProgInfoModalCancel = () => {
    setProgInfoModalVisible(false);
  };

  const PieChartItem = ({sum}) => {
    return(
      sum == 0 ?
      null
        :
        <PieChart
        data={BINS.map(bin => Object({
          name: bin.name,
          bin_score: scores[bin.id],
          color: bin.color,
          legendFontColor: "black",
          legendFontSize: 15
        }))}
        width={windowWidth * 0.9}
        height={220}
        chartConfig={chartConfig}
        accessor={"bin_score"}
        backgroundColor={"transparent"}
      />
    );
  }

  return (
    <ImageBackground source={require('../assets/gb3.jpg')} resizeMode="cover" style={styles.image}>
      <View style={{ alignItems: 'center', flexDirection: 'column', height: '100%', backgroundColor: '#0000' }}>
        <View style={styles.container}>
          <View style={styles.profile}>
            <View style={styles.avatarContainer}>
              <Icons.MaterialCommunityIcons name={'circle-edit-outline'} size={windowWidth * 0.08} color={'black'} style={styles.editBtn} onPress={() => setModalVisible(true)} />
              <CurrIconLib name={currIconName} size={windowWidth * 0.23} color={avatar.avatarColor} resizeMode="contain" style={{ marginTop: 10 }} />
            </View>
            <Text style={styles.userName}>{name}</Text>
            <View style={styles.levelView}>
              <View style={styles.progress}>
                <Progress.Bar progress={(totalScore % PARAMS.TH_SCORE) / PARAMS.TH_SCORE} width={320} height={20} color={'#437ede'} unfilledColor={'white'} style={styles.progBar} />
              </View>
              <View style={styles.levelInfo}>
                <View style={{ flexDirection: 'row', alignItems: "center" }} >
                  <Text style={styles.levelSubtext}>Level:</Text>
                  <View style={styles.levelIcon}>
                    <Text style={styles.levelTextNum}>{level.toString().padStart(2, "0")}</Text>
                  </View>
                </View>
                <Text style={styles.levelSubtextPnts}>Points: {totalScore}</Text>
              </View>
            </View>
          </View>

          <AvatarPicker
            visible={isModalVisible}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
            level={level}
            initColor={avatar.avatarColor}
            initAvatar={avatar.avatarIdx}
          />
        </View>
        <View style={styles.bottomPart}>
          <SectionGrid
            itemDimension={100}
            spacing={5}
            style={styles.gridStyle}
            sections={[{
              title: 'My Progress',
              data: BINS
            },
            {
              title: 'Statistics',
              data: ['statistics']
            }
            ]}
            renderItem={({ item }) => (
              item !== "statistics" ?
                <LevelView key={item.id}
                  IconLib={item.IconLib}
                  IconName={item.IconName}
                  fillColor={item.color}
                  unfillColor={item.lightColor}
                  score={scores[item.id]}
                  label={item.name} />
                :
                <PieChartItem sum={totalScore}/>
            )}
            renderSectionHeader={({ section }) => (
              section.title !== 'Statistics' ?
                <View>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    borderColor: 'black', borderWidth: 1, marginTop: 10, borderRadius: 18, backgroundColor: 'white', shadowColor: 'black',
                    elevation: 5
                  }}>
                    <Text style={styles.bottomPartText}>{section.title}</Text>
                    <RoundButton
                      style={[styles.confirmBtn, styles.shadowProp]}
                      onPress={() => setProgInfoModalVisible(true)}
                    >
                      <View
                        style={styles.actionButton}>
                        <Icons.FontAwesome name={"info"} size={30} color={"black"} />
                      </View>
                    </RoundButton>
                  </View>
                  <Text style={styles.infoText}>
                    <Text>Recycle more, Gain points, Become a Recycling Master, and unlock </Text>
                    <Text style={{ fontWeight: 'bold' }}>new avatars and colors!</Text>
                  </Text>
                </View>
                :
                <View>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    borderColor: 'black', borderWidth: 1, marginTop: 10, borderRadius: 18, backgroundColor: 'white', shadowColor: 'black',
                    elevation: 5
                  }}>
                    <Text style={styles.bottomPartText}>{section.title}</Text>
                  </View>
                  <Text style={styles.infoText}>{totalScore == 0 ? "Start recycling to see statistics" : "See how much you recycle from each type"}</Text>
                </View>
            )} />
          <ProgressInfo
            visible={isProgInfoModalVisible}
            onCancel={handleProgInfoModalCancel}
          />


        </View>
      </View>
    </ImageBackground>



  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    height: '33%',
    width: '100%',
    marginTop: 10
  },
  profile: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginTop: 25,
    justifyContent: "center",
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: windowWidth * 0.32 / 2,
    elevation: 2,
    width: windowWidth * 0.32,
    aspectRatio: 1,
    backgroundColor: 'white',
  },
  levelView: {
    alignSelf: 'center',
    flexDirection: "column",
    width: '80%'
  },
  progress: {
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 8
  },
  progBar: {
    alignSelf: 'center',
  },
  image: {
    flexDirection: 'column',
    justifyContent: "center",
    height: '100%',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
    zIndex: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    alignContent: 'center',
    marginTop: 8,
  },
  userName: {
    fontFamily: 'sans-serif-light',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 33,
    color: 'black',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 20
  },
  levelSubtext: {
    marginHorizontal: 1,
    marginBottom: '2%',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    color: "black",
    marginLeft: 5,
  },
  levelSubtextPnts: {
    marginHorizontal: 1,
    marginBottom: '2%',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    color: "black",
    marginRight: 5
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  levelTextNum: {
    position: 'absolute',
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  bottomPart: {
    marginTop: 30,
    height: '62%',
    marginHorizontal: 10
  },
  bottomPartText: {
    marginLeft: 10,
    fontFamily: 'sans-serif-light',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 25,
    color: 'black',
    padding: 5,
    marginVertical: 2
  },
  gridStyle: {
    marginVertical: 5,
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 5,
    borderRadius: 50,
    margin: 8
  },
  confirmBtn: {
    backgroundColor: 'white',
    borderRadius: 1,
    height: windowWidth * 0.1,
    aspectRatio: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: windowWidth * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 5,
  },
  levelIcon: {
    backgroundColor: "lightblue",
    borderRadius: 14,
    borderWidth: 1,
    width: 28,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 2
  },
  infoText: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
});

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};