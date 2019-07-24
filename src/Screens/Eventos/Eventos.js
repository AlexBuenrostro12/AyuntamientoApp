import React, { Component } from 'react';
import {
	View,
	TimePickerAndroid,
	StyleSheet,
	Platform,
	Alert,
	Dimensions,
	ScrollView,
	Image,
	BackHandler,
	Text
} from 'react-native';
import { Card, CardItem } from 'native-base';
import styled, { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axiosCloudinary from 'axios';
import FCM from 'react-native-fcm';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Evento from '../../components/Evento/Evento';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustomInput from '../../components/CustomInput/CustomInput';
import firebaseClient from '../../components/AuxiliarFunctions/FirebaseClient';
import CustomAddBanner from '../../components/CustomAddBanner/CustomAddBanner';

const theme = {
	commonFlex: '1',
	customMarginValue: '5px',
	backgroundColor: '#00a19a'
};
const { height, width } = Dimensions.get('window');
const StyledSafeArea = styled.SafeAreaView`flex: ${theme.commonFlex};`;

const StyledContainer = styled.View`
	flex: ${theme.commonFlex};
	flex-direction: column;
	flex-wrap: wrap;
	overflow: scroll;
`;

const StyledHeader = styled.View``;

export default class Eventos extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	state = {
		events: [],
		loading: false,
		addEvent: false,
		isAdmin: null,
		token: null,
		formIsValid: false,
		form: {
			evento: {
				itemType: 'FloatingLabel',
				holder: 'Nombre',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
			},
			tipo: {
				itemType: 'PickTypeEvent',
				holder: 'Seleccione tipo de evento',
				value: '',
				valid: true
			},
			dia: {
				itemType: 'PickDay',
				holder: 'Día de evento',
				value: '1',
				valid: true
			},
			fecha: {
				itemType: 'Date',
				holder: 'Seleccione fecha',
				value: '',
				validation: {
					haveValue: true
				},
				valid: false
			},
			hora: {
				itemType: 'Hour',
				holder: 'Seleccione la hora',
				value: '',
				validation: {
					haveValue: true
				},
				valid: false
			},
			imagen: {
				itemType: 'LoadImage',
				holder: 'IMAGEN',
				value: '',
				valid: true
			},
			descripcion: {
				itemType: 'Textarea',
				holder: 'Descripción',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 150
				},
				valid: false
			}
		},
		options: {
			title: 'Elige una opción',
			takePhotoButtonTitle: 'Abrir camara.',
			chooseFromLibraryButtonTitle: 'Abrir galeria.',
			maxWidth: 800,
			maxHeight: 800
		},
		image: null,
		fileNameImage: null,
		imageFormData: null,
		notificationToken: null,
		fcmTokens: [],
		allReadyToNotification: false,
		notifications: true,
		showLikeIcons: true,
		texToSearch: '',
		search: false,
		changeBanner: false,
		addTypeEvent: false,
		typeEvent: '',
		banner: [],
		separatorDate: 'date',
		days: [],
		typeEvents: [],
	};

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
				source={require('../../assets/images/Drawer/events.png')}
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

		let token = (expiresIn = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('Eventos.js: ', token);
			console.log('Eventos.js: ', parseExpiresIn, now);
			if (token && parseExpiresIn > now) {
				this.setState({ token: token, tokenIsValid: true });
				if (email !== 'false') this.setState({ isAdmin: true });
				else this.setState({ isAdmin: false });
				this.getEvents();
				this.getBanner();
				this.getTypeEvents();
			} else {
				//Restrict screens if there's no token
				try {
					console.log('Entro al try');
					await AsyncStorage.removeItem('@storage_token');
					await AsyncStorage.removeItem('@storage_expiresIn');
					//Use the expires in
				} catch (e) {
					//Catch posible errors
				}
				Alert.alert(
					'Eventos',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errors
		}
		// Create notification channel
		FCM.createNotificationChannel({
			id: 'null',
			name: 'Default',
			description: 'used for example',
			priority: 'high'
		});

		// get the notification
		try {
			const requestPermissions = await FCM.requestPermissions({ badge: false, sound: true, alert: true });
			console.log('requestPermissions: ', requestPermissions);
			const FCMToken = await FCM.getFCMToken();
			console.log('getFCMToken, ', FCMToken);
			const getInitialNotification = await FCM.getInitialNotification();
			console.log('getInitialNotification, ', getInitialNotification);
			this.setState({ notificationToken: FCMToken }, () => this.getFCMTokens());
		} catch (error) {}
	}
	//Test Object form
	getForms = () => {
		const newEvent = new FormEvent('Evento 1 prueba');
		console.log('evento: ', newEvent.event);
	};
	//Native backbutton
	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (!this.state.search && !this.state.addEvent && !this.state.addTypeEvent && !this.state.changeBanner) {
			if (isDrawerOpen) closeDrawer();
			else openDrawer();
		}
		if (this.state.search) this.startSearch();
		if (this.state.addEvent || this.state.addTypeEvent || this.state.changeBanner) this.setState({ addEvent: false, addTypeEvent: false, changeBanner: false });
		return true;
	};
	//Remove subscription from native button
	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	//SendRemoteNotification
	sendRemoteNotification = () => {
		this.getFCMTokens();
		if (this.state.allReadyToNotification) {
			let body;
			console.log('sendRemoteNotification:, ', this.state.notificationToken);
			if (Platform.OS === 'android') {
				body = {
					registration_ids: this.state.fcmTokens,
					notification: {
						title: 'Nuevo evento',
						body: '!' + this.state.form['evento'].value + '¡',
						sound: null,
						tag: this.state.form['evento'].value,
						priority: 'high'
					}
				};
			} else {
				body = {
					to: this.state.notificationToken,
					notification: {
						title: 'Simple FCM Client',
						body: 'Click me to go to detail',
						sound: 'default'
					},
					data: {},
					priority: 10
				};
			}

			firebaseClient.send(JSON.stringify(body), 'notification');
		}
	};
	//Get events
	getEvents = () => {
		this.setState({ loading: true, addNew: false, image: null, fileNameImage: null, imageFormData: null });
		axios
			.get('/events.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedEvents = [];
				console.log('Eventos, res: ', res);
				for (let key in res.data) {
					fetchedEvents.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({
					loading: false,
					events: fetchedEvents.sort((a, b) => (a.eventData.dia > b.eventData.dia ? 1 : -1))
				});
				this.getBanner();
				this.getTypeEvents();
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};
	//Get type of events
	getTypeEvents = () => {
		this.setState({ loading: true });
		axios
			.get('/typeevents.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedTypeEvents = [];
				console.log('Eventos, res: ', res);
				for (let key in res.data) {
					fetchedTypeEvents.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({
					loading: false,
					typeEvents: fetchedTypeEvents.reverse()
				});
				this.splitEventsHandler();
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};
	//Make array of events separated by type
	splitEventsHandler = () => {
		const typeEvents = [];
		const arrayOfArrays = [];
		this.state.typeEvents.map(e => {
			typeEvents.push(e.typeEventData.typeEvent);
		});
		console.log('typeEvents: ', typeEvents);
		for (let i = 0; i < typeEvents.sort().length; i++) {
			const element = typeEvents[i];
			const array = this.state.events.filter(type => type.eventData.tipo === element);
			arrayOfArrays.push(array);
		}
		console.log('arrayOfArrays: ', arrayOfArrays);
		this.setState({ events: arrayOfArrays.flat() });
	};
	//Get image banner
	getBanner = () => {
		this.setState({
			loading: true,
			changeBanner: false,
			addNew: false,
			image: null,
			fileNameImage: null,
			imageFormData: null
		});
		axios
			.get('/banner.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedBanner = [];
				console.log('banner, res: ', res);
				for (let key in res.data) {
					fetchedBanner.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, banner: fetchedBanner });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
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
					Alert.alert('Eventos', 'Evento fallido al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		}
		if (exist) this.setState({ allReadyToNotification: true });
	}; //verifyFCMTokens
	inputChangeHandler = (text, inputIdentifier) => {
		const updatedForm = {
			...this.state.form
		};
		const updatedFormElement = {
			...updatedForm[inputIdentifier]
		};

		updatedFormElement.value = text;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

		updatedForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;

		for (let inputIdentifier in updatedForm) {
			formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
		}

		this.setState({ form: updatedForm, formIsValid: formIsValid });
	};
	checkValidity(value, rules) {
		let isValid = true;

		if (!rules) {
			return true;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}
		if (rules.email) {
			let valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			isValid = valid.test(value) && isValid;
		}
		if (rules.haveValue) {
			isValid = value !== null && isValid;
		}

		return isValid;
	}

	loadPhotoHandler = (show) => {
		if (show === 'library') {
			ImagePicker.launchImageLibrary(this.state.options, (response) => {
				if (response.didCancel) {
					console.log('User cancelled image picker');
				} else if (response.error) {
					console.log('ImagePicker Error: ', response.error);
				} else {
					//Destructuring response object
					const { fileName, fileSize, type, data, uri } = response;
					//Preset
					const UPLOAD_PRESET_NAME = 'ayuntamiento';
					//Image form data
					const imageFormData = new FormData();
					imageFormData.append('file', {
						name: fileName,
						size: fileSize,
						type: type,
						data: data,
						uri: uri
					});
					imageFormData.append('upload_preset', UPLOAD_PRESET_NAME);
					this.setState({ imageFormData: imageFormData, image: { uri: uri }, fileNameImage: fileName });
				} // else
			});
		} else {
			ImagePicker.launchCamera(this.state.options, (response) => {
				if (response.didCancel) {
					console.log('User cancelled image picker');
				} else if (response.error) {
					console.log('ImagePicker Error: ', response.error);
				} else {
					//Destructuring response object
					const { fileName, fileSize, type, data, uri } = response;
					//Preset
					const UPLOAD_PRESET_NAME = 'ayuntamiento';
					//Image form data
					const imageFormData = new FormData();
					imageFormData.append('file', {
						name: fileName,
						size: fileSize,
						type: type,
						data: data,
						uri: uri
					});
					imageFormData.append('upload_preset', UPLOAD_PRESET_NAME);
					this.setState({ imageFormData: imageFormData, image: { uri: uri }, fileNameImage: fileName });
				} // else
			});
		}
	};

	uploadPhotoHandler = () => {
		//URL cloudinary
		const URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/storage-images/image/upload';
		this.setState({ loading: true });
		console.log('Form: ', this.state.form);
		if (this.state.imageFormData || this.state.formIsValid) {
			axiosCloudinary({
				url: URL_CLOUDINARY,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: this.state.imageFormData
			})
				.then((response) => {
					console.log('ResponseCloudinary: ', response);
					//Destructurin response
					const { data } = response;
					console.log('ResponseDataCloudinary: ', data);
					//Destructuring data
					const { url, eager } = data;
					//Send to form image the value of url
					this.inputChangeHandler(url, 'imagen');
					console.log('stateofForm: ', this.state.form);
					//Call the method to upload new
					this.state.addEvent ? this.sendNewHandler() : this.changeBannerHandler(url);
				})
				.catch((err) => {
					Alert.alert('Eventos', 'Imagen fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
					console.log('ErrorCloudinary: ', err);
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Eventos', '¡Complete el formulario correctamente!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};

	sendTypeEventHandler = () => {
		this.setState({ loading: true });
		if (this.state.typeEvent) {
			const formData = {};
			formData['typeEvent'] = this.state.typeEvent;
			const typeEvents = {
				typeEventData: formData
			};
			//Upload new
			axios
				.post('/typeevents.json?auth=' + this.state.token, typeEvents)
				.then((response) => {
					this.setState({ loading: false, image: null, fileNameImage: null, imageFormData: null });
					Alert.alert(
						'Eventos',
						'¡Nuevo tipo de evento enviado con exito!',
						[ { text: 'Ok', onPress: () => this.getTypeEvents() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Eventos', '¡Tipo de evento fallido al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Eventos', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};

	sendNewHandler = () => {
		//check if the form is valid
		if (this.state.formIsValid) {
			const formData = {};
			for (let formElementIdentifier in this.state.form) {
				formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
			}
			const events = {
				eventData: formData
			};
			//Upload new
			axios
				.post('/events.json?auth=' + this.state.token, events)
				.then((response) => {
					this.state.notifications && this.sendRemoteNotification();
					this.setState({ loading: false, image: null, fileNameImage: null, imageFormData: null });
					Alert.alert(
						'Eventos',
						'¡Evento enviado con exito!',
						[ { text: 'Ok', onPress: () => this.getEvents() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Eventos', '¡Evento fallido al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Eventos', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};

	actOrDescNotification = () => {
		this.setState({ notifications: !this.state.notifications });
	};
	changeDisplay = () => {
		this.setState({ showLikeIcons: !this.state.showLikeIcons });
	};
	searchTextHandler = (text) => {
		this.setState({ texToSearch: text }, () => this.filterData(this.state.texToSearch));
	};
	filterData = (text) => {
		if (text !== '') {
			let ban = false;
			const filteredEvents = this.state.events.filter((nw) => {
				const filterNew = nw.eventData['evento'];
				const filterDate = nw.eventData['fecha'].split('T', 1);
				console.log('filterNew: ', filterNew);
				console.log('filterDate: ', filterDate[0]);
				if (filterNew.includes(text) || filterDate[0].includes(text)) {
					ban = true;
					return nw;
				}
			});
			if (ban) {
				this.setState({ events: filteredEvents });
			}
		} else this.getEvents();
	};
	startSearch = () => {
		this.setState({ search: !this.state.search });
	};
	getTime = async (inputIdentifier) => {
		try {
			const { action, hour, minute } = await TimePickerAndroid.open({
				hour: 14,
				minute: 0,
				is24Hour: false // Will display '2 PM'
			});
			if (action !== TimePickerAndroid.dismissedAction) {
				// Selected hour (0-23), minute (0-59)
				console.log(action, hour, minute);
				const hourSelected = hour + ':' + minute;
				const updatedForm = {
					...this.state.form
				};
				const updatedFormElement = {
					...updatedForm[inputIdentifier]
				};
				updatedFormElement.value = hourSelected;
				updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

				updatedForm[inputIdentifier] = updatedFormElement;

				let formIsValid = true;

				for (let inputIdentifier in updatedForm) {
					formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
				}

				this.setState({ form: updatedForm, formIsValid: formIsValid });
			}
		} catch ({ code, message }) {
			console.warn('Cannot open time picker', message);
		}
	};
	changeBannerHandler = (url) => {
		//check if the form is valid
		if (url) {
			const formData = {};

			formData['imagen'] = url;

			const banner = {
				eventData: formData
			};
			const bannerKey = this.state.banner.map((bn) => bn.id);
			//Upload banner
			axios
				.patch('/banner' + '/' + bannerKey + '.json?auth=' + this.state.token, banner)
				.then((response) => {
					this.setState({ loading: false });
					console.log('changeBanner:res: ', response);
					Alert.alert(
						'¡Eventos!',
						'¡Banner cambiado con exito!',
						[ { text: 'Ok', onPress: () => this.getBanner() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					console.log('approveItemListHandler:res: ', error);
					Alert.alert('¡Eventos!', '¡Banner fallido al cambiar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Eventos', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};

	// getDays = () => {
	// 	const days = this.state.events.map((e) => {
	// 		return e.eventData.dia;
	// 	});
	// 	const daysFiltered = [ ...new Set(days) ];

	// 	this.setState({ days: daysFiltered.sort() });
	// 	console.log('days: ', this.state.days);
	// };

	render() {
		const list = this.state.events.map((evt, index) => (
			<Evento
				key={evt.id}
				id={evt.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getEvents}
				data={evt.eventData}
				describe={this.props}
				index={index + 1}
				showLikeIcons={true}
			/>
		));

		const spinner = <CustomSpinner color="blue" />;
		const formElements = [];
		for (let key in this.state.form) {
			formElements.push({
				id: key,
				config: this.state.form[key]
			});
		}
		const uri = this.state.banner.map((bn) => bn.eventData.imagen);
		const objUri = { uri: uri[0] };
		const title = (
			<View style={{ marginBottom: 5, width: width * 0.94, height: width * 0.4 }}>
				<CustomCardItemTitle
					title="EVENTOS"
					description="Los eventos más importantes dentro de Tecalitlán"
					info="Delice hacia abajo, para leer las actividades a futuro."
					image={objUri}
				/>
			</View>
		);
		const body = (
			<Card style={{ flex: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ margin: 5, alignItems: 'center' }}>
					<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
						{this.state.loading ? (
							spinner
						) : (
							<View style={this.state.showLikeIcons ? styles.scrollDataListIcons : styles.scrollDataList}>
								{list}
							</View>
						)}
					</View>
				</ScrollView>
			</Card>
		);
		const eventos = (
			<View style={{ flex: 1 }}>
				{title}
				{body}
			</View>
		);
		const addEventTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner
					title="AGREGAR EVENTO"
					image={require('../../assets/images/Preferences/add-orange.png')}
				/>
			</View>
		);
		const addEventBody = (
			<Card style={styles.addNew}>
				<ScrollView style={{ flex: 1 }}>
					<CardItem bordered>
						<View style={styles.cardBody}>
							{formElements.map((e) => (
								<CustomInput
									key={e.id}
									itemType={e.config.itemType}
									holder={e.config.holder}
									value={e.config.value}
									changed={(text) => this.inputChangeHandler(text, e.id)}
									changed1={() => this.getTime(e.id)}
									loadPhoto={this.loadPhotoHandler}
									image={this.state.image}
									name={this.state.fileNameImage}
									typeEvents={this.state.typeEvents}
								/>
							))}
						</View>
					</CardItem>
				</ScrollView>
			</Card>
		);
		const addEvent = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addEventTitle}
				{this.state.loading && spinner}
				{addEventBody}
			</View>
		);

		const changeBanner = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<Card style={styles.addNew}>
					<ScrollView style={{ flex: 1 }}>
						<CardItem bordered>
							<View style={styles.cardBody}>
								<CustomInput
									key="changeBanner"
									itemType="LoadImage"
									loadPhoto={this.loadPhotoHandler}
									image={this.state.image}
									name={this.state.fileNameImage}
								/>
								{this.state.loading && spinner}
							</View>
						</CardItem>
					</ScrollView>
				</Card>
			</View>
		);
		const addTypeEvent = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<Card style={styles.addNew}>
					<ScrollView style={{ flex: 1 }}>
						<CardItem bordered>
							<View style={styles.cardBody}>
								<CustomInput
									key="typeEvent"
									itemType="InlineLabel"
									holder="Nombre del evento"
									value={this.state.typeEvent}
									changed={(text) => this.setState({ typeEvent: text })}
								/>
								{this.state.loading && spinner}
							</View>
						</CardItem>
					</ScrollView>
				</Card>
			</View>
		);

		return (
			<StyledSafeArea>
				<StyledContainer>
					<StyledHeader>
						<HeaderToolbar
							open={this.props}
							title="Eventos"
							color="#e2487d"
							showContentRight={true}
							titleOfAdd="Nuevo evento"
							get={this.getEvents}
							addTypeEvent={() => this.setState({ addTypeEvent: true })}
							isAddTypeEvent={this.state.addTypeEvent}
							changeBanner={() => this.setState({ changeBanner: true })}
							isChangeBanner={this.state.changeBanner}
							add={() => this.setState({ addEvent: true })}
							isAdd={this.state.addEvent}
							goBack={() =>
								this.setState({
									addEvent: false,
									changeBanner: false,
									addTypeEvent: false,
									image: null,
									fileNameImage: null,
									imageFormData: null
								})}
							save={!this.state.addTypeEvent ? this.uploadPhotoHandler : this.sendTypeEventHandler}
							isAdmin={true ? true : this.state.isAdmin}
							notifications={this.actOrDescNotification}
							actOrDesc={this.state.notifications}
							changed={(text) => this.searchTextHandler(text)}
							value={this.state.texToSearch}
							search={this.filterData}
							startSearch={this.startSearch}
							isSearch={this.state.search}
						/>
					</StyledHeader>
					<StatusBar color="#c7175b" />
					<View style={{ flex: 1, margin: 10 }}>
						<ThemeProvider theme={theme}>
							{!this.state.addEvent && !this.state.changeBanner && !this.state.addTypeEvent ? (
								eventos
							) : this.state.addEvent && !this.state.changeBanner && !this.state.addTypeEvent ? (
								addEvent
							) : this.state.changeBanner && !this.state.addEvent && !this.state.addTypeEvent ? (
								changeBanner
							) : (
								this.state.addTypeEvent &&
								!this.state.changeBanner &&
								!this.state.addEvent &&
								addTypeEvent
							)}
						</ThemeProvider>
					</View>
				</StyledContainer>
			</StyledSafeArea>
		);
	}
}

const styles = StyleSheet.create({
	btns: {
		flex: 1,
		flexDirection: 'column'
	},
	btn: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#F3F2F1',
		justifyContent: 'space-between',
		margin: 5,
		borderRadius: 5
	},
	cardBody: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	scrollDataListIcons: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	scrollDataList: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'column'
	},
	addNew: {
		flex: 2,
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	drawerIcon: {
		height: width * 0.07,
		width: width * 0.07
	},
	separator: {
		fontSize: 15,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular'
	}
});
