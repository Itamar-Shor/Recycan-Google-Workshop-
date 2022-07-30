import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export const SectionHeader = ({title, icon, size = undefined}) => {
    return (
        <View
            style={styles.titleContainer}
        >
            <MaterialCommunityIcons name={icon} size={18} color="black" />
            <Text style={[styles.title, {fontSize: size}]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 24,
        marginVertical: 18,
    },
    title: {
        fontWeight: "700",
        marginHorizontal: 8,
    },
})