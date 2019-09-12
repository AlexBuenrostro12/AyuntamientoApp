import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Alert,
	SafeAreaView,
	ImageBackground,
	Dimensions,
	BackHandler,
	Image,
	Platform,
	Text
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FCM, {
	NotificationActionType,
	RemoteNotificationResult,
	WillPresentNotificationResult,
	NotificationType,
	FCMEvent
} from 'react-native-fcm';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import SwiperBanner from '../../components/SwiperBanner/SwiperBanner';

// FCM
FCM.on(FCMEvent.Notification, async (notif) => {
	console.log('FCMEvent: ', FCMEvent);
	console.log('notif: ', notif);
	if (notif.local_notification) {
		//This is a local notification
	}
	if (notif.opened_from_tray) {
		//IOS: app is open/resumed because user clicked banner
		//Android: app is open/resumed because user clicked banner o tapped app icon
		console.log('Clicked in the notification!');
	}
	// await someAsyncCall();
	if (Platform.OS === 'ios') {
		//Optionial
		//IOS requires developers to call completionHandler to end notification process.
		//This library handles it for you automatically with default behavior
		//notif._notificationType is acailable for iOS platfrom
		switch (notif._notificationType) {
			case NotificationType.Remote:
				notif.finish(RemoteNotificationResult.NewData);
				break;
			case NotificationType.NotificationResponse:
				notif.finish();
				break;
			case NotificationType.WillPresent:
				notif.finish(WillPresentNotificationResult.All);
				break;
		}
	}
});
FCM.on(FCMEvent.RefreshToken, (token) => {
	console.log(token);
	//fcm token may not available on first load, catch it here
});
// FCM

export default class Home extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	state = {
		news: null,
		loading: false,
		token: null,
		refreshing: false,
		notificationToken: null,
		fcmTokens: [],
		allReadyToNotification: false,
		currentGif: require('../../assets/images/Gif/teca-centro1.gif'),
	};

	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	//Style of drawer navigation
	static navigationOptions = {
		drawerLabel: () => (<Text style={styles.drawerLabel}>Home</Text>),
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/home-icon.png')}
				style={styles.drawerIcon}
				resizeMode="contain"
			/>
		),
	};

	//Obtiene el token y tiempo de expiracion almacenado globalmente en la app
	async componentDidMount() {
		//Request lcoation permissons
		Platform.OS === 'ios' ? this.watchId = navigator.geolocation.requestAuthorization() : null;
		this.changeFirstGifHandler();
		//BackHandler
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
		//Get the token and time of expiration
		let token = (expiresIn = email = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			email = await AsyncStorage.getItem('@storage_email');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('Home.js: ', token);
			console.log('Home.js: ', parseExpiresIn, now);
			console.log('Home.js: ', email);
			if (token && parseExpiresIn > now) {
				this.setState({ token: token }, () => this.getNews());
			} else {
				//Restrict screens if there's no token
				try {
					console.log('Entro al try');
					await AsyncStorage.removeItem('@storage_token');
					await AsyncStorage.removeItem('@storage_expiresIn');
					await AsyncStorage.removeItem('@storage_email');
					//Use the expires in
					Alert.alert(
						'Home',
						'¡Tiempo de espera agotado, inicie sesion de nuevo!',
						[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
						{ cancelable: false }
					);
				} catch (e) {
					//Catch posible errors
				}
			}
		} catch (e) {
			//Catch posible errors
		}

		//Create notification channel
		FCM.createNotificationChannel({
			id: 'null',
			name: 'Default',
			description: 'used for example',
			priority: 'high'
		});

		//get the notification
		try {
			const requestPermissions = await FCM.requestPermissions({ badge: false, sound: true, alert: true });
			console.log('requestPermissions: ', requestPermissions);
			const FCMToken = await FCM.getFCMToken();
			console.log('getFCMToken, ', FCMToken);
			const getInitialNotification = await FCM.getInitialNotification();
			console.log('getInitialNotification, ', getInitialNotification);
			this.setState({ notificationToken: FCMToken }, () => this.getFCMTokens());
		} catch (error) {}
	};

	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		console.log('parent; ', parent);
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (isDrawerOpen) closeDrawer();
		else openDrawer();
				
		return true;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();

		clearTimeout(this.firstGif);
		clearTimeout(this.secondGif);
	};

	//Get fcmTokens
	getFCMTokens = () => {
		const fetchedfcmTokens = [];
		axios
			.get('/fcmtokens.json?auth=' + this.state.token)
			.then((res) => {
				for (let key in res.data) {
					fetchedfcmTokens.push({
						...res.data[key],
						id: key
					});
				}
				const fcmtkns = [];
				for (let i = 0; i < fetchedfcmTokens.length; i++) {
					const element = fetchedfcmTokens[i];
					let fcmToken = element.tokenData[Object.keys(element.tokenData)];
					fcmtkns[i] = fcmToken;
				}
				this.setState({ fcmTokens: fcmtkns }, () => this.verifyfcmTokens());
			})
			.catch((err) => {});
	};
	//Verify tokens
	verifyfcmTokens = () => {
		let exist = false;
		//Check if this token already exist in db
		for (let i = 0; i < this.state.fcmTokens.length; i++) {
			const element = this.state.fcmTokens[i];
			if (element === this.state.notificationToken) exist = true;
		}

		if (!exist) {
			const formData = {};
			formData['token' + Math.floor(Math.random() * 1000 + 1) + 'fcm'] = this.state.notificationToken;
			const fcmtoken = {
				tokenData: formData
			};
			axios
				.post('/fcmtokens.json?auth=' + this.state.token, fcmtoken)
				.then((response) => {
					this.getFCMTokens();
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Noticias', 'Noticia fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		}
		if (exist) this.setState({ allReadyToNotification: true });
	}; //end

	getNews = () => {
		console.log('entro');
		this.setState({ loading: true });
		axios
			.get('/news.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedNews = [];
				for (let key in res.data) {
					fetchedNews.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, news: fetchedNews });
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loading: true });
			});
	};

	changeFirstGifHandler = () => {
		this.firstGif = setTimeout(() => {
			this.setState({ currentGif: require('../../assets/images/Gif/teca-centro2.gif') }, () => this.changeSecondGifHandler())
		}, 10000)
	};

	changeSecondGifHandler = () => {
		this.secondGif = setTimeout(() => {
			this.setState({ currentGif: require('../../assets/images/Gif/teca-centro1.gif') }, () => this.changeFirstGifHandler())
		}, 10000)
	};

	render() {
		const spinner = <CustomSpinner color="blue" />;
		let swiperBanner = <SwiperBanner news={this.state.news} open={this.props} token={this.state.token} />;

		return (
			<SafeAreaView style={styles.container}>
				<ImageBackground style={styles.view} source={this.state.currentGif}>
					<View>
						<HeaderToolbar open={this.props} title="Home" color="rgba(52, 52, 52, 0.8)" />
					</View>
					<StatusBar color="rgba(52, 52, 52, 0.8)" />
					<View style={{ flex: 1 }}>
						<View style={{ flex: 1 }}>{this.state.loading ? spinner : swiperBanner}</View>
					</View>
				</ImageBackground>
			</SafeAreaView>
		);
	}
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	},
	text: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 25
	},
	view: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'column',
		overflow: 'scroll'
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold'
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
