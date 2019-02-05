import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Picker, Item, Label, Input, Textarea } from 'native-base';

export default class Descripcion extends Component {
    render() {

        let descripcion = null;

        switch (this.props.itemType) {
            case 'Picker':
                descripcion = (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>Selecciona tipo de incidencia:</Text>
                        <Picker
                            mode="dropdown"
                            iosHeader={this.props.value}
                            iosIcon={<Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/ArrowDown/arrow-down.png')} />}
                            style={{ width: undefined }}
                            selectedValue={this.props.value}
                            onValueChange={this.props.changed}
                        >
                            <Picker.Item label="Electricidad" value="electricidad" />
                            <Picker.Item label="Agua" value="agua" />
                            <Picker.Item label="Calles" value="calles" />
                        </Picker>
                    </View>
                );
                break;
            case 'FloatingLabel':
                descripcion = (
                    <Item floatingLabel>
                        <Label>Asunto</Label>
                        <Input
                            onChangeText={this.props.changed} />
                    </Item>
                );
                break;
            case 'Textarea':
                descripcion = (
                    <Textarea rowSpan={8} bordered placeholder="Descripcion"
                        onChangeText={this.props.changed} />
                );
                break;

            default:
                descripcion = null;
                break;
        }

        return (
            <View style={{ flex: 1, marginTop: 2, marginBottom: 2 }}>
                {descripcion}
            </View>
        );
    }
}