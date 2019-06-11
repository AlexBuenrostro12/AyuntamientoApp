import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
import { Picker, Item, Label, Input } from 'native-base';
import MapView, { Marker } from 'react-native-maps';

const { height, width } = Dimensions.get('window');

export default class Ubicacion extends Component {
	state = {
		initialRegion: {
			latitude: 19.470763,
			longitude: -103.306613,
			latitudeDelta: 0.0122,
			longitudeDelta: width / height * 0.0122
		}
	};

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
							iosIcon={
								<Image
									style={{ width: 25, height: 25 }}
									source={require('../../../assets/images/ArrowDown/arrow-down.png')}
								/>
							}
							style={{ width: undefined }}
							selectedValue={this.props.value}
							onValueChange={this.props.changed}
						>
							<Picker.Item label="Tecalitlán" value="Tecalitlan" />
							<Picker.Item label="La Purisima" value="La purisima" />
							<Picker.Item label="La Miseria" value="La miseria" />
							<Picker.Item label="Santiago" value="Santiago" />
						</Picker>
					</View>
				);
				break;
			case 'FloatingLabel':
				ubicacion = (
					<Item style={{ marginBottom: 2 }}>
						<Input placeholder={this.props.label} onChangeText={this.props.changed} />
					</Item>
				);
				break;
			case 'MapView':
				ubicacion = (
					<MapView style={styles.map} initialRegion={this.state.initialRegion}>
						<Marker
							pinColor="red"
							coordinate={{ latitude: this.props.latitude, longitude: this.props.longitude }}
						>
						</Marker>
					</MapView>
				);
				break;
			case 'SelectDirection':
				ubicacion = (
					<View style={{ flex: 1, marginTop: 15, flexDirection: 'column', justifyContent: 'center' }}>
						<Text style={{ fontWeight: 'bold' }}>Seleccione tipo de ubicación:</Text>
						<Picker
							mode="dropdown"
							iosHeader={this.props.value}
							iosIcon={
								<Image
									style={{ width: 25, height: 25 }}
									source={require('../../../assets/images/ArrowDown/arrow-down.png')}
								/>
							}
							style={{ width: undefined }}
							selectedValue={this.props.value}
							onValueChange={this.props.changed}
						>
							<Picker.Item label="Dirección específica" value="Dirección específica" />
							<Picker.Item label="Su ubicación actual" value="Su ubicación actual" />
						</Picker>
					</View>
				);
				break;

			default:
				ubicacion = null;
				break;
		}

		return <View style={{ flex: 1 }}>{ubicacion}</View>;
	}
}

const styles = StyleSheet.create({
	map: {
		width: '100%',
		height: 250,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	}
});
