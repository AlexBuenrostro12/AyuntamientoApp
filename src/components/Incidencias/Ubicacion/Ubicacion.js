import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Picker, Item, Label, Input } from 'native-base';

export default class Ubicacion extends Component {

    render() {
        let ubicacion = null;

        switch (this.props.itemType) {
            case 'Picker':
                ubicacion = (
                    <View style={{ flex: 1, marginTop: 15, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>Seleccione localidad:</Text>
                        <Picker
                            mode="dropdown"
                            iosHeader={this.props.value}
                            iosIcon={<Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/ArrowDown/arrow-down.png')} />}
                            style={{ width: undefined }}
                            selectedValue={this.props.value}
                            onValueChange={this.props.changed}
                        >
                            <Picker.Item label="Tecalitlán" value="tecalitlan" />
                            <Picker.Item label="La Purisima" value="la purisima" />
                            <Picker.Item label="La Miseria" value="la miseria" />
                            <Picker.Item label="Santiago" value="santiago" />
                        </Picker>
                    </View>
                );
                break;
            case 'FloatingLabel':
                ubicacion = (
                    <Item floatingLabel>
                        <Label>Dirección</Label>
                        <Input
                            onChangeText={this.props.changed} />
                    </Item>
                );
                break;

            default:
                ubicacion = null;
                break;
        }


        return (
            <View style={{ flex: 1 }}>
                {ubicacion}
            </View>
        );
    }
}