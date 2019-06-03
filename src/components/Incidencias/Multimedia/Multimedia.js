import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

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
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                            {this.props.image && image}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#00a19a',
                                        flexGrow: 1,
                                        marginRight: 2
                                    }}
                                    onPress={() => this.props.loadPhoto('library')}
                                >
                                    <Image
                                        style={{ height: 30, width: 30 }}
                                        source={require('../../../assets/images/Imagen/image-white.png')}
                                    />
                                    <Text style={styles.photoText}>Agregar Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#00847b',
                                        flexGrow: 1,
                                        marginRight: 2
                                    }}
                                    onPress={() => this.props.loadPhoto('camera')}
                                >
                                    <Image
                                        style={{ height: 30, width: 30 }}
                                        source={require('../../../assets/images/Imagen/camera.png')}
                                    />
                                    <Text style={styles.photoText}>Tomar Foto</Text>
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

const styles = StyleSheet.create({
    photoText: {
		fontWeight: 'bold',
		color: 'white',
		alignSelf: 'center'
	}
});