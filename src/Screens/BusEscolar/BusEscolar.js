import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import { Card, CardItem } from 'native-base';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustommSpinner from '../../components/CustomSpinner/CustomSpinner';
import axios from '../../../axios-ayuntamiento';
import Buses from '../../components/Buses/Buses';
import Login from '../Login/Login';

export default class BusEscolar extends Component {

    state = {
        buses: [],
        loading: true,
        tokenIsValid: true
    }

    async componentDidMount() {
        try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('BusEscolar.js: ', token);
			console.log('BusEscolar.js: ', parseExpiresIn, now);
            console.log('BusEscolar.js: ', this.state.tokenIsValid);
            if(token && parseExpiresIn > now) {
                axios.get('/bus.json?auth=' + token)
                    .then(res => {
                        const fetchedBuses = [];
                        for (let key in res.data) {
                            fetchedBuses.push({
                                ...res.data[key],
                                id: key
                            });
                        }
                        this.setState({ loading: false, buses: fetchedBuses });
                    })
                    .catch(err => {
                        this.setState({ loading: false });
                    });
            }else {
                //Restrict screens if there's no token
				try {
					console.log('Entro al try');
					await AsyncStorage.removeItem('@storage_token');
					await AsyncStorage.removeItem('@storage_expiresIn');
					//Use the expires in
				} catch (e) {
					//Catch posible errors
				}
				Alert.alert(
					'Bus Escolar',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.setState({ tokenIsValid: false }) } ],
					{ cancelable: false }
				);
            }
        }catch(e) {
            //Catch posible errores
        }
    }

    render() {
        const busesList = (
            this.state.buses.map(bss => (
                <Buses
                    key={bss.id}
                    data={bss.data} />
            ))
        );

        const spinner = (
            <CustommSpinner
                color="blue" />
        );

        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.state.tokenIsValid ? <View style={styles.container}>
                    <HeaderToolbar
                        open={this.props}
                        title="Bus escolar" />

                    <StatusBar color="#ff9933" />
                    <ScrollView>
                        <View style={{ flex: 1, margin: 5 }}>
                            <Card>
                                <CustomCardItemTitle
                                    title="Bus escolar"
                                    description="Consulta los horarios y destinos de tus camiones."
                                    image={require('../../assets/images/Ubicacion/search.png')} />
                                <CardItem>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                        {this.state.loading ? spinner : busesList}
                                    </View>
                                </CardItem>
                            </Card>
                        </View>
                    </ScrollView>
                </View> : <Login />}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        overflow: 'scroll',
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