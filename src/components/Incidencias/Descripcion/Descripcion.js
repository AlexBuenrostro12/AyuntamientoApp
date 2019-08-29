import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Picker, Item, Label, Input, Textarea } from 'native-base';

export default class Descripcion extends Component {
    render() {

        let descripcion = null;

        switch (this.props.itemType) {
            case 'Picker':
                    const directions = [
                        { name: 'Reglamentos' },
                        { name: 'Secretario general' },
                        { name: 'Comunicación social' },
                        { name: 'Obras públicas' },
                        { name: 'Educación' },
                        { name: 'Planeación y participación ciudadana' },
                        { name: 'Turismo' },
                        { name: 'Fomento agropecuario' },
                        { name: 'Agua potable' },
                        { name: 'Servicios generales' },
                        { name: 'Parques y jardines' },
                        { name: 'Alumbrado público' },
                        { name: 'Cementerio' },
                        { name: 'Ecología' },
                        { name: 'Seguridad pública' },
                        { name: 'Protección civil' },
                        { name: 'Vialidad' },
                    ];
                    const catItems = directions.map((dir, index) => (
                        <Picker.Item key={index} label={dir.name} value={dir.name} />
                    ));
                descripcion = (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>Departamento al que se dirige:</Text>
                        <Picker
                            mode="dropdown"
                            iosHeader={this.props.value}
                            //iosIcon={null}//<Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/ArrowDown/arrow-down.png')} />}
                            style={{ width: undefined }}
                            selectedValue={this.props.value}
                            onValueChange={this.props.changed}
                        >
                           {catItems}
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