import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, CardItem, Body } from 'native-base';

export default class DatosPersonales extends Component {

    render() {

        const datosPersonales = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 25 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Datos personales</Text>
                            </View>
                            <Image style={{ height: 85, width: 85 }} source={require('../../../assets/images/Email/email.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text>Aquí debera de haber inputs necesarios para los
                                datos de la persona que realiza el reporte de 
                                incidencia. </Text>
                        </Body>
                    </CardItem>
                    {/* <CardItem footer bordered>
                    <Text>GeekyAnts</Text>
                </CardItem> */}
                </Card>
            </View>
        );

        return (
            <View style={{ flex: 1 }}>
                {datosPersonales}
            </View>
        );
    }
}