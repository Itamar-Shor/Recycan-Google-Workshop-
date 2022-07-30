import React, {useState, useRef} from 'react';
import { TogglableButton } from './buttons'
import { Dimensions, ScrollView, StyleSheet, View , TouchableOpacity} from 'react-native';
import { BINS_ID, BINS } from '../globals/bins'
import * as Icons from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;

const BinScroll = ({ onLongPress, iconSize, onPress, state}) => {

    const [currentXOffset, setCurrentXOffset] = useState(0);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const scrollBar = useRef();

    const _onPress = (isPressed, id) => {
        onPress(isPressed, id);
    }

    const _handleScroll = (event) => {
        setCurrentXOffset(event.nativeEvent.contentOffset.x)
    }

    const arrow = (sign) => {
        const eachItemOffset = scrollViewWidth / BINS.length; // Divide by 10 because I have 10 <View> items
        const _currentXOffset =  currentXOffset + sign*eachItemOffset;
        scrollBar.current.scrollTo({x: _currentXOffset, y: 0, animated: true})
    }

    return (
        <View style={{flex:0, flexDirection:'row', justifyContent:'center', width:'100%'}}>
             <TouchableOpacity
                style={{alignSelf:'center', paddingLeft:8}}
                onPress={() => {arrow(-1)}}
            >
                <Icons.SimpleLineIcons
                    name="arrow-left"
                    size={20}
                    color="black"
                />
            </TouchableOpacity>
            <ScrollView 
                ref={scrollBar}
                horizontal={true} 
                onScroll={_handleScroll}
                onContentSizeChange={(w, h) => {setScrollViewWidth(w)}}
            >
                {Object.values(BINS_ID).map((id) => {
                    return (
                        <View style={styles.btnContainer} key={id}>
                            <TogglableButton
                                color={BINS[id].color}
                                iconLib={BINS[id].IconLib}
                                iconName={BINS[id].IconName}
                                iconSize={iconSize}
                                onLongPress={() => onLongPress(id)}
                                onPress={() => _onPress(id)}
                                isPressed={state[id]}
                            />
                        </View>
                    );
                })}
            </ScrollView>
            <TouchableOpacity
                style={{alignSelf:'center', paddingRight:8}}
                onPress={() => {arrow(1)}}
            >
                <Icons.SimpleLineIcons
                    name="arrow-right"
                    size={20}
                    color="black"
                />
            </TouchableOpacity>
        </View>
    );
}

export const initialButtonsState = { 

    [BINS_ID.PAPER]: false, 
    [BINS_ID.GLASS]: false, 
    [BINS_ID.PACKAGING]: false,
    [BINS_ID.CLOTHES]: false,
    [BINS_ID.ELECTRONIC]: false,
    [BINS_ID.BOTTLES]: false, 
    [BINS_ID.CARTON]: false, 
};

const styles = StyleSheet.create({
    btnContainer: {
        width: (windowWidth - 50) / 5,
        aspectRatio: 1,
        padding: 8,
        alignItems: "center",
        alignContent: "center",
    }
});

export default BinScroll