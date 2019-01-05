import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import DeckSwiper from '../../components/DeckSwipe/DeckSwipe';

const gabinete = ( props ) => (
    <View style={styles.container}>
        <View>
            <HeaderToolbar open={props} />
        </View>
        <StatusBar color="#ff9933"/>
        <View>
            <DeckSwiper />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default gabinete;