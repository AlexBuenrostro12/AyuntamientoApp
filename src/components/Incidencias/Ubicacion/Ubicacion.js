import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Picker, Item, Input } from 'native-base';
import MapView, { Marker } from 'react-native-maps';

const { height, width } = Dimensions.get('window');

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
				const initialRegion = {
					latitude: this.props.latitude,
					longitude: this.props.longitude,
					latitudeDelta: 0.0122,
					longitudeDelta: width / height * 0.0122
				};
				ubicacion = (
					<MapView style={styles.map} initialRegion={initialRegion}>
						<Marker
							pinColor="red"
							coordinate={{ latitude: this.props.latitude, longitude: this.props.longitude }}
						>
						</Marker>
					</MapView>
				);
				break;
			case 'SelectDirection':
				const innerWhite = { backgroundColor: 'white' };
				const innerBlue = { backgroundColor: 'blue' };
				Platform.OS === 'android' ? 
					ubicacion = (
						<View style={{ flex: 1, marginTop: 15, flexDirection: 'column', justifyContent: 'center' }}>
							<Text style={{ fontWeight: 'bold' }}>Seleccione tipo de ubicación:</Text>
							<Picker
								mode="dropdown"
								iosHeader={this.props.value}
								style={{ width: undefined }}
								selectedValue={this.props.value}
								onValueChange={this.props.changed}
							>
								<Picker.Item label="Dirección específica" value="Dirección específica" />
								<Picker.Item label="Su ubicación actual" value="Su ubicación actual" />
							</Picker>
						</View>
					) : 
					ubicacion = (
						<View style={{ flex: 1, marginTop: 15, flexDirection: 'column', justifyContent: 'center' }}>
							<Text style={{ fontWeight: 'bold' }}>Seleccione tipo de ubicación:</Text>
							<View style={styles.checkBoxContainer}>
								<View style={styles.checkBoxsubContainer}>
									<Text>Dirección específica</Text>
									<TouchableOpacity 
										style={[styles.checkBox, this.props.value === 'Dirección específica' ? innerBlue : innerWhite]}
										onPress={() => this.props.changed('Dirección específica')}
									/>
								</View>
								<View style={styles.checkBoxsubContainer}>
									<Text>Su ubicación actual</Text>
									<TouchableOpacity 
										style={[styles.checkBox, this.props.value === 'Su ubicación actual' ? innerBlue : innerWhite]}
										onPress={() => this.props.changed('Su ubicación actual')}
									/>
								</View>
							</View>
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
	},
	checkBoxContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	checkBoxsubContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	checkBox: {
		height: width * .07,
		width: width * .07,
		borderWidth: 2,
		borderColor: 'blue',
		borderRadius: 15
	}
});
