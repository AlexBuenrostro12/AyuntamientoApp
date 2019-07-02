import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, BackHandler, Image, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import { food, medicServices, pharmacys, hotels, sports } from '../../components/AuxiliarFunctions/MarkersArray';

export default class Map extends Component {
	//Style of drawer navigation
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/maps.png')}
				style={styles.drawerIcon}
				resizeMode="contain"
			/>
		)
	};
	async componentDidMount() {
		//BackHandler
		BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
	}
	// Enable native button
	goBackHandler = () => {
		console.log('this.props: ', this.props);
		const { closeDrawer } = this.props.navigation;
		closeDrawer();
		return true;
	};

	render() {
		const initialRegion = {
			latitude: 19.47151,
			longitude: -103.30706,
			latitudeDelta: 0.0122,
			longitudeDelta: width / height * 0.0122
		};

		const map = (
			<MapView style={styles.map} initialRegion={initialRegion}>
				{/* Food */}
				{food.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={{ flex: 1 }}>
							<Image style={styles.marker} source={require('../../assets/images/Drawer/maps.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Medic Services */}
				{medicServices.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={{ flex: 1 }}>
							<Image style={styles.marker} source={require('../../assets/images/Map/hospital.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Pharmacys */}
				{pharmacys.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={{ flex: 1 }}>
							<Image style={styles.marker} source={require('../../assets/images/Map/pharmacy.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* hotels */}
				{hotels.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={{ flex: 1 }}>
							<Image style={styles.marker} source={require('../../assets/images/Map/hotels.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Sports */}
				{sports.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={{ flex: 1 }}>
							<Image style={styles.marker} source={require('../../assets/images/Map/sport.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
			</MapView>
		);

		return (
			<SafeAreaView style={styles.container}>
				<View>
					<HeaderToolbar open={this.props} title="Mapa" color="#e2487d" />
				</View>
				<StatusBar color="#c7175b" />
				<View style={styles.mapContainer}>{map}</View>
			</SafeAreaView>
		);
	}
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
	mapContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	map: {
		width: '100%',
		height: height * 0.88,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	},
	drawerIcon: {
		height: width * 0.07,
		width: width * 0.07
	},
	container: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'column',
		overflow: 'scroll'
	},
	marker: {
		height: width * 0.08,
		width: width * 0.08
	}
});
