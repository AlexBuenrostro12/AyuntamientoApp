import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, CardItem, Body } from 'native-base';

export default class Ubicacion extends Component {

    render() {

        const ubicacion = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 18 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Ubicación</Text>
                            </View>
                            <Image style={{ height: 60, width: 65 }} source={require('../../../assets/images/Ubicacion/search.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text>Aquí debera ir mapa para ubicar incidencia</Text>
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
                {ubicacion}
            </View>
        );
    }
}