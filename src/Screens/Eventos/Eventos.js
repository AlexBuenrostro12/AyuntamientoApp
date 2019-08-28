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
const StyledSafeArea = styled.SafeAreaView`
	flex: ${theme.commonFlex};
	background-color: black;
`;

const StyledContainer = styled.View`
	flex: ${theme.commonFlex};
	flex-direction: column;
	flex-wrap: wrap;
	overflow: scroll;
	background-color: white;
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
				value: 'Festival de los sones',
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
		typeEvent: '',
		banner: [],
		separatorDate: 'date',
		days: [],
		typeEvents: [],
		results: []
	};

	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	//Style of drawer navigation
	static navigationOptions = {
		drawerLabel: () => (<Text style={styles.drawerLabel}>Eventos</Text>),
		drawerIcon: ({ tintColor }) => (
				<Image
					source={require('../../assets/images/Drawer/events.png')}
					// style={styles.drawerIcon}
					resizeMode="contain"
					style={[styles.drawerIcon, { tintColor: 'black' }]}
				/>
		)
	};

	async componentDidMount() {
		console.log('this.props: ', this.props);
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
	//Native backbutton
	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (!this.state.search && !this.state.addEvent && !this.state.changeBanner) {
			if (isDrawerOpen) closeDrawer();
			else openDrawer();
		}
		if (this.state.search) this.startSearch();
		if (this.state.addEvent || this.state.changeBanner)
			this.setState({ addEvent: false, changeBanner: false });
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
				const obj = {
					typeEventData:{
						typeEvent: 'Agregar evento'
					},
					id: 'Agregar evento'
				};
				fetchedTypeEvents.push(obj);
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
		this.state.typeEvents.map((e) => {
			typeEvents.push(e.typeEventData.typeEvent);
		});
		console.log('typeEvents: ', typeEvents);
		for (let i = 0; i < typeEvents.sort().length; i++) {
			const element = typeEvents[i];
			const array = this.state.events.filter((type) => type.eventData.tipo === element);
			arrayOfArrays.push(array);
		}
		//Filter days
		const arrayOfArraysByDays = [];
		for (let e = 0; e < arrayOfArrays.length; e++) {
			const array = arrayOfArrays[e];

			const dayAndType = array.map((e) => {
				const obj = {
					dia: e.eventData.dia,
					tipo: e.eventData.tipo
				};
				return obj;
			});
			// Remove duplicates days
			const uniqueDayAndType = Array.from(new Set(dayAndType.map((a) => a.dia))).map((dia) => {
				return dayAndType.find((a) => a.dia === dia);
			});
			arrayOfArraysByDays.push(uniqueDayAndType);
		}

		//Get separator by type and day
		const results = [];
		for (let x = 0; x < arrayOfArraysByDays.length; x++) {
			const arr = arrayOfArraysByDays[x];
			for (let c = 0; c < arr.length; c++) {
				const elmt = arr[c];
				for (let v = 0; v < arrayOfArrays.length; v++) {
					const arreglo = arrayOfArrays[v];
					const result = arreglo.filter(
						(a) => a.eventData.dia === elmt.dia && a.eventData.tipo === elmt.tipo
					);
					if (result.length !== 0) results.push(result);
				}
			}
		}
		// console.log('results: ', results);

		// send order array of events by day and type to array of events in state
		this.setState({ events: results.flat(), results: results, days: arrayOfArraysByDays });
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
					this.setState({ loading: false, image: null, fileNameImage: null, imageFormData: null, typeEvent: '' });
					Alert.alert(
						'Eventos',
						'¡Evento enviado con exito!',
						[ { text: 'Ok', onPress: () => { this.getEvents(); this.getTypeEvents(); } } ],
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
			let ban = false;
			if (this.state.form['tipo'].value === 'Agregar evento'){
				this.state.form['tipo'].value = this.state.typeEvent;
				ban = true;
			}
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
					if (ban){
						this.sendTypeEventHandler()
					} else {
						Alert.alert(
							'Eventos',
							'¡Evento enviado con exito!',
							[ { text: 'Ok', onPress: () => this.getEvents() } ],
							{
								cancelable: false
							}
						);
					}
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
				const filterEvent = nw.eventData['evento'];
				const filterDate = nw.eventData['fecha'].split('T', 1);
				console.log('filterNew: ', filterEvent);
				console.log('filterDate: ', filterDate[0]);
				if (filterEvent.includes(text) || filterDate[0].includes(text)) {
					ban = true;
					return nw;
				}
			});
			console.log('filteredEvents: ', filteredEvents);
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

	render() {
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
					info="Eventos por orden alfabético."
					image={objUri}
				/>
			</View>
		);
		let ban = false;
		if (this.state.texToSearch !== '') 
			ban = true;
		const body = (
			<Card style={{ flex: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ margin: 5, alignItems: 'center' }}>
					<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
						{this.state.loading ? (
							spinner
						) : (
							!ban ? this.state.days.map((day) => {
								return day.map((d, index) => (
									<View key={index} style={{ flex: 1}}>
										<View
											key={index}
											style={{
												marginBottom: 5,
												backgroundColor: '#676766',
												width: width * .90,
												paddingLeft: 3
											}}
										>
											<Text style={styles.separator}>
												{d.tipo} - Día {d.dia}
											</Text>
										</View>
										<View style={styles.scrollDataListIcons}>
										{this.state.results.map((rs) => {
											return rs.map((evt,index) => {
												if (d.dia === evt.eventData.dia && d.tipo === evt.eventData.tipo){
													return (
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
															);
														}
													});
												})}
										</View>
									</View>
								));
							})
						: <View style={styles.scrollDataListIcons}>
							{this.state.events.map((evt, index) => (
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
							))}
						</View>)}
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
									changedTypeEvent={(text) => this.setState({ typeEvent: text })}
									typeEvent={this.state.typeEvent}
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

		return (
			<StyledSafeArea>
				<StyledContainer>
					<StyledHeader>
						<HeaderToolbar
							open={this.props}
							title="Eventos"
							color="#090707"
							showContentRight={true}
							titleOfAdd="Nuevo evento"
							get={this.getEvents}
							changeBanner={() => this.setState({ changeBanner: true })}
							isChangeBanner={this.state.changeBanner}
							add={() => this.setState({ addEvent: true })}
							isAdd={this.state.addEvent}
							goBack={() =>
								this.setState({
									addEvent: false,
									changeBanner: false,
									image: null,
									fileNameImage: null,
									imageFormData: null
								})}
							save={this.uploadPhotoHandler}
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
					<StatusBar color="#000000" />
					<View style={{ flex: 1, margin: 10 }}>
						<ThemeProvider theme={theme}>
							{!this.state.addEvent && !this.state.changeBanner ? (
								eventos
							) : this.state.addEvent && !this.state.changeBanner ? (
								addEvent
							) : this.state.changeBanner && !this.state.addEvent ? (
								changeBanner
							) : null}
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
		width: width * 0.07,
	},
	drawerLabel: {
		width: width,
		backgroundColor: 'black',
		marginLeft: 18,
		paddingBottom: 15,
		paddingTop: 15,
		color: 'white',
		fontSize: 18,
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	separator: {
		fontSize: 15,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular'
	}
});
