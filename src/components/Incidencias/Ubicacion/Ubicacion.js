import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Picker, Item, Label, Input } from 'native-base';
import MapView from 'react-native-maps';

const { height, width } = Dimensions.get('window');

export default class Ubicacion extends Component {

    state = {
        initialRegion: {
            latitude: 37.7900352,
            longitude: -122.4013726,
            latitudeDelta: 0.0122,
            longitudeDelta: width / height * 0.0122
		},
		mapRegion: null,
		lastLat: null,
		lastLong: null,
	};
	
	componentDidMount() {
		console.log('ComponentDidMount: ');
		this.watchId = navigator.geolocation.watchPosition(position => {
			console.log('position: ', position);
			let region = {
				latitude:       position.coords.latitude,
				longitude:      position.coords.longitude,
				latitudeDelta:  0.00922*1.5,
				longitudeDelta: 0.00421*1.5
			  }
			  this.onRegionChange(region, region.latitude, region.longitude);
		});
	}

	onRegionChange = (region, lastLat, lastLong) => {
		this.setState({
		  mapRegion: region,
		  // If there are no new values set the current ones
		  lastLat: lastLat || this.state.lastLat,
		  lastLong: lastLong || this.state.lastLong
		});
	}

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
                        <Item floatingLabel style={{ marginBottom: 5 }}>
                            <Label>{this.props.label}</Label>
                            <Input onChangeText={this.props.changed} />
                        </Item>
                    );
				break;
			case 'MapView': 
					ubicacion = (
						<MapView
							region={this.state.mapRegion}
							showsUserLocation={true}
							followUserLocation={true}
							style={styles.map}
							onRegionChange={() => this.onRegionChange()}>
							<MapView.Marker
								coordinate={{
								latitude: (this.state.lastLat + 0.00050) || -36.82339,
								longitude: (this.state.lastLong + 0.00050) || -73.03569,
								}}>
								<View>
								<Text style={{color: '#000'}}>
									{ this.state.lastLong } / { this.state.lastLat }
								</Text>
								</View>
							</MapView.Marker>
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
        width: "100%",
        height: 250
    }
});
