import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

export const ResultsList = ({ onPressItem, data, icon }) => {
    const renderResultsItem = ({ item, index, separators }) => {
        return (
            <TouchableRipple
                style={{ paddingHorizontal: 24, paddingVertical: 12 }}
                onPress={() => onPressItem(item)}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {icon && icon(item, index)}
                    <Text style={styles.resultsItemText}>{item.text}</Text>
                </View>
            </TouchableRipple>
        );
    }

    const memoRenderItem = React.useMemo(() => renderResultsItem, [data]);

    return (
        <FlatList
            data={data}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={memoRenderItem}
            ItemSeparatorComponent={() => {
                return (
                    <View style={{
                        backgroundColor: "black",
                        height: StyleSheet.hairlineWidth,
                        width: "90%",
                        alignSelf: "center",
                    }} />
                );
            }}
            keyboardShouldPersistTaps={'handled'}
        />
    );
}

const styles = StyleSheet.create({
    favoritesItemText: {
        marginHorizontal: 4,
    },
    resultsItemText: {
        left: 16,
        width: "80%"
    },
})