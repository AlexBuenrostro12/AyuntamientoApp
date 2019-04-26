import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
import IconMenu from '../../UI/IconMenu/IconMenu';

const { height, width } = Dimensions.get('window');

const headerToolbar = (props) => {
    const toolbar = (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', marginRight: 25 }}>
                <IconMenu open={props.open} />
            </View>
            <View style={styles.view}>
                <Text style={styles.text}>{props.title}</Text>
            </View>
            <Image style={styles.image} source={require('../../assets/images/Ayuntamiento/escudo-blanco.png')}/>   
        </View>
    );

    return (
        <View>
            {toolbar}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        height: height / 11, 
        width: width, 
        backgroundColor: '#878787',
        paddingLeft: 5,
    },
    view: {
        padding: 5,
        justifyContent: 'center'
    },
    text: {
        fontSize: 22,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    image: {
        height: height / 12,
        width: width / 3,
        resizeMode: 'contain',
    }
});

export default headerToolbar;
