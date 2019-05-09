import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default class Multimedia extends Component {

    render() {

        let multimedia = null;
        let image = (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                <Image
                    source={this.props.image}
                    style={{ height: 160, width: 200 }} />
                <Text style={{ fontSize: 16, color: 'grey' }}>{this.props.name}</Text>
            </View>
        );
        switch (this.props.itemType) {
            case 'ImageButton':
                multimedia = (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                        {this.props.image ? image : null}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F3F2F1', borderRadius: 5, paddingLeft: 10, paddingRight: 10 }}>
                            <Image
                                style={{ height: 30, width: 30 }}
                                source={require('../../../assets/images/Imagen/image.png')} />
                            <Text style={{ fontSize: 20 }}>{this.props.holder}</Text>
                            <TouchableOpacity onPress={this.props.loadPhoto}>
                                <Image
                                    style={{ height: 30, width: 30 }}
                                    source={require('../../../assets/images/Add/add.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
                break;

            default:
                break;
        }

        return (
            <View style={{ flex: 1 }}>
                {multimedia}
            </View>
        );
    }
}