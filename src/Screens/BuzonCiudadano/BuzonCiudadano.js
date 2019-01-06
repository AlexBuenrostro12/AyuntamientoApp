import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';


export default class BuzonCiudadano extends Component {

    render(){
        return (
            <View style={styles.container}>
                <View>
                    <HeaderToolbar open={this.props} />
                </View>
                <StatusBar color="#ff9933"/>
                <View style={styles.view}>
                    <Text style={styles.text}>Buzón Ciudadano</Text>
                </View>
            </View>
        );
    }
}

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
