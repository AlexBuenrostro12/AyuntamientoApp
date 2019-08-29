import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, BackHandler } from 'react-native';
import { Card } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';

export default class Pagos extends React.Component {
	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	//Style of drawer navigation
	static navigationOptions = {
		drawerLabel: () => (<Text style={styles.drawerLabel}>Pagos</Text>),
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/payments.png')}
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
						<HeaderToolbar open={this.props} title="Pagos" color="#d4e283" />
					</View>
					<StatusBar color="#bac95f" />
					<View style={styles.body}>
						<Text style={styles.text}>En construcción</Text>
                        <Card>
                            <Image style={styles.image} resizeMode="contain" source={require('../../assets/images/Payments/construction.png')} />
                        </Card>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
	sav: {
		flex: 1,
		backgroundColor: 'black'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		overflow: 'scroll',
		backgroundColor: 'white'
	},
	body: {
		flex: 1,
        margin: 10,
        alignItems: 'center',
	},
	text: {
		fontSize: 25,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: 'black',
        fontFamily: 'AvenirNextLTPro-Regular',
        alignSelf: 'center'
    },
    image: {
        width: width * .80,
        height: width * .80
    },
    drawerIcon: {
		height: width * 0.07,
		width: width * 0.07
	},
	drawerLabel: {
		width: width,
		marginLeft: 18,
		paddingBottom: 15,
		paddingTop: 15,
		color: '#676766',
		fontSize: 18,
		fontFamily: 'AvenirNextLTPro-Regular'
	}
});
