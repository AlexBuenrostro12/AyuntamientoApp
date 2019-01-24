import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';


export default class ConsultaCiudadana extends Component {
    state = {
        surveys: [],
        loading: true,
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={styles.container}>
                <View>
                    <HeaderToolbar open={this.props} />
                </View>
                <StatusBar color="#ff9933" />
                <View style={styles.view}>
                    <Text style={styles.text}>Consulta Ciudadana</Text>
                </View>
            </View>
        );
    }
};

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
