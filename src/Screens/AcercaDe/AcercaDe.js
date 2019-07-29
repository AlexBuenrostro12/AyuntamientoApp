import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, BackHandler, ScrollView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';

export default class AcercaDe extends React.Component {
	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	//Style of drawer navigation
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/about.png')}
				style={styles.drawerIcon}
				resizeMode="contain"
			/>
        )
	};

	async componentDidMount() {
		//BackHandler
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
    };
    
	//Native backbutton
	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;
            
        if (isDrawerOpen) closeDrawer();    
        else openDrawer();
		return true;
    };
    
	//Remove subscription from native button
	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	render() {
		return (
			<SafeAreaView style={styles.sav}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar open={this.props} title="Acerca de ..." color="#666666" />
					</View>
					<StatusBar color="#333333" />
					<View style={styles.body}>
                            <Image style={styles.image} resizeMode="contain" source={require('../../assets/images/Ayuntamiento/logo-computo-blanco.png')} />
                            <ScrollView style={{ flex: 1 }}>
                                <Text style={styles.text}>TecaliApp version 1.0</Text>
                                
                                <Text style={styles.text}>Desarrolladores</Text>
                                <Text style={styles.subtext}>Carlos Alejandro</Text>
                                <Text style={styles.subtext}>Buenrostro Ramírez</Text>
                                <Text style={styles.subtext}>Alejandro López Herrera</Text>
                                <Text style={styles.subtext}>Gerardo Ortiz Ramírez</Text>
                                <Text style={styles.subtext}>Christian Mayela Guadalupe</Text>
                                <Text style={styles.subtext}>Villagrana Martínez </Text>
                                
                                <Text style={styles.text}>Contacto</Text>
                                <Text style={styles.subtext}>Correo:</Text>
                                <Text style={styles.subtext}>computo.tecalitlan@gmail.com</Text>
                                <Text style={styles.subtext}>Tel: 4180169</Text>
                            </ScrollView>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	sav: {
		flex: 1
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
        overflow: 'scroll',
        backgroundColor: '#333333'
	},
	body: {
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#333333', 
        width: width * .99, 
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: 'white',
        fontFamily: 'AvenirNextLTPro-Regular',
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 5
    },
    subtext: {
		fontSize: 20,
		fontWeight: 'normal',
		fontStyle: 'normal',
		color: 'white',
        fontFamily: 'AvenirNextLTPro-Regular',
        alignSelf: 'center',
        flexWrap: 'wrap'
    },
    image: {
        marginTop: 5,
        marginBottom: 5,
        alignSelf: 'center',
        width: width * .95,
        height: width * .35,
    },
    drawerIcon: {
		height: width * 0.07,
		width: width * 0.07
	},
});
