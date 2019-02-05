import React, { Component } from 'react';
import { View } from 'react-native';
import { Item, Label, Input } from 'native-base';

export default class DatosPersonales extends Component {

    render() {

        let datosPersonales = null;

        switch (this.props.itemType) {
            case 'FloatingLabel':
                datosPersonales = (
                    <Item floatingLabel>
                        <Label>{this.props.holder}</Label>
                        <Input
                            onChangeText={this.props.changed} />
                    </Item>
                );
                break;

            default:
                    datosPersonales = null;
                break;
        }

        return (
            <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
                {datosPersonales}
            </View>
        );
    }
}