import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	Dimensions,
	BackHandler,
	Image,	
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';

export default class Map extends Component {
	state = {

	};

	//Style of drawer navigation
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image 
				source={require('../../assets/images/Drawer/maps.png')}
				style={styles.drawerIcon}
				resizeMode='contain' />
		)
	};
	async componentDidMount() {
		//BackHandler
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
	};
	// Enable native button
	goBackHandler = () => {
		console.log('this.props: ', this.props);
		const { closeDrawer } = this.props.navigation;
		closeDrawer();
		return true;
    };

    componentWillUpdate() {
        this.getPlaces();
    };

	render() {
        const initialRegion = {
            latitude: 19.471510,
            longitude: -103.307060,
            latitudeDelta: 0.0122,
            longitudeDelta: width / height * 0.0122
        };

        const map = <MapView 
                        style={styles.map} initialRegion={initialRegion} />;

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
        alignItems: 'center',
    },
	map: {
		width: '100%',
		height: height * .88,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
    },
    drawerIcon: {
		height: width * .07,
		width: width * .07,
    },
    container: {
        flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'column',
		overflow: 'scroll'
    }
});
