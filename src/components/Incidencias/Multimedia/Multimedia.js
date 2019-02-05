import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, CardItem, Body } from 'native-base';

export default class Multimedia extends Component {

    render() {

        const multimedia = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 25 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Multimedia</Text>
                            </View>
                            <Image style={{ height: 85, width: 65 }} source={require('../../../assets/images/Multimedia/multimedia.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text>Aquí debera de haber dos botones que permitan tomar
                                fotos desde la camara o seleccionar desde la galeria. </Text>
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
                {multimedia}
            </View>
        );
    }
}