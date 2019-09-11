import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Alert,
	TimePickerAndroid,
	Dimensions,
	Image,
	Platform,
	BackHandler,
	Text
} from 'react-native';
import { Card, CardItem } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axiosCloudinary from 'axios';
import { Calendar } from 'react-native-calendars';
import FCM from 'react-native-fcm';
import StatusBar from '../../UI/StatusBar/StatusBar';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustomAddBanner from '../../components/CustomAddBanner/CustomAddBanner';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomInput from '../../components/CustomInput/CustomInput';
import axios from '../../../axios-ayuntamiento';
import Actividad from '../../components/Actividad/Actividad';
import firebaseClient from '../../components/AuxiliarFunctions/FirebaseClient';
import KBAvoiding from '../../components/KBAvoiding/KBAvoiding';

const { height, width } = Dimensions.get('window');

export default class Actividades extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	state = {
		token: null,
		loading: true,
		addAct: false,
		form: {
			actividad: {
				itemType: 'FloatingLabel',
				holder: 'Nombre',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
			},
			direccion: {
				itemType: 'PickerDirection',
				holder: 'Dirección',
				value: 'Reglamentos',
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
			descripcion: {
				itemType: 'Textarea',
				holder: 'Descripción',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 150
				},
				valid: false
			},
			imagen: {
				itemType: 'LoadImage',
				holder: 'IMAGEN',
				value: '',
				valid: true
			}
		},
		options: {
			title: 'Elige una opción',
			takePhotoButtonTitle: 'Abrir camara.',
			chooseFromLibraryButtonTitle: 'Abrir galeria.',
			maxWidth: 800,
			maxHeight: 800
		},
		formIsValid: false,
		activities: [],
		isAdmin: true,
		image: null,
		fileNameImage: null,
		imageFormData: null,
		showButtons: true,
		showLikeIcons: true,
		notifications: true,
		texToSearch: '',
		showCalendar: false,
		calendarDates: {},
		notificationToken: null,
		fcmTokens: [],
		allReadyToNotification: false,
		search: false,
	};

	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	};

	//Style of drawer navigation
	static navigationOptions = {
		drawerLabel: () => (<Text style={styles.drawerLabel}>Actividades</Text>),
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/activities.png')}
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
		let token = (expiresIn = email = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			email = await AsyncStorage.getItem('@storage_email');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('Actividades.js: ', token);
			console.log('Actividades.js: ', parseExpiresIn, now);
			console.log('Actividades.js: ', email);
			console.log('Actividades.js: ', this.props);
			if (token && parseExpiresIn > now) {
				// charge actividades
				this.setState({ token: token });
				if (email !== 'false') this.setState({ isAdmin: true });
				else this.setState({ isAdmin: false });

				this.getActivities();
			} else {
				//Restrict screens if there's no token
				console.log(this.state);
				try {
					console.log('Entro al try else');
					await AsyncStorage.removeItem('@storage_token');
					await AsyncStorage.removeItem('@storage_expiresIn');
					await AsyncStorage.removeItem('@storage_email');
					//Use the expires in
				} catch (e) {
					//Catch posible errors
				}
				Alert.alert(
					'Actividades',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
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
	};

	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (!this.state.showCalendar && !this.state.search && !this.state.addAct) {
			if (isDrawerOpen) closeDrawer();
			else openDrawer();
		} else {
			if (this.state.showCalendar)
				this.showCalendar('refresh');
			if (this.state.search)
				this.startSearch();
		}

		if (this.state.addAct)
			this.setState({ addAct: false });
				
		return true;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	};

	getActivities = () => {
		this.setState({ loading: true, addAct: false, showButtons: true });
		axios
			.get('/activities.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedActivities = [];
				for (let key in res.data) {
					fetchedActivities.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, activities: fetchedActivities.reverse() }, () => this.getDatesOfAct());
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};

	// Get the dates to put into the calendar
	getDatesOfAct = () => {
		const dates = [];
		this.state.activities.filter((act) => {
			const filterDate = act.activityData['fecha'].split('T', 1);
			const date = filterDate[0];
			dates.push(date);
		});
		this.makeFormatToDates(dates);
	};
	// make the format object to be able to put the marks in the calendar
	makeFormatToDates = (dates) => {
		var obj = dates.reduce(
			(c, v) => Object.assign(c, { [v]: { selected: true, marked: true, selectedColor: '#676766' } }),
			{}
		);
		this.setState({ calendarDates: obj });
	};

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
	}; //verifyFCMTokens

	//SendRemoteNotification
	sendRemoteNotification = () => {
		this.getFCMTokens();
		if (this.state.allReadyToNotification) {
			console.log(
				'state: ',
				this.state.allReadyToNotification,
				this.state.fcmTokens,
				this.state.notificationToken
			);
			let body;
			console.log('sendRemoteNotification:, ', this.state.notificationToken);
			if (Platform.OS === 'android') {
				body = {
					registration_ids: this.state.fcmTokens,
					notification: {
						title: 'Nueva actividad',
						body: '!' + this.state.form['actividad'].value + '¡',
						sound: null,
						tag: this.state.form['actividad'].value,
						priority: 'high'
					}
				};
			} else {
				body = {
					registration_ids: this.state.fcmTokens,
					notification: {
						title: 'Nueva actividad',
						body: '!' + this.state.form['actividad'].value + '¡',
						sound: 'default'
					},
					data: {},
					priority: 10
				};
			}

			firebaseClient.send(JSON.stringify(body), 'notification');
		}
	};

	sendNewActivityHandler = () => {
		//check if the form is valid
		this.setState({ loading: true });
		if (this.state.formIsValid) {
			const formData = {};
			for (let formElementIdentifier in this.state.form) {
				formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
			}
			const activity = {
				activityData: formData
			};

			axios
				.post('/activities.json?auth=' + this.state.token, activity)
				.then((response) => {
					this.state.notifications && this.sendRemoteNotification();
					this.setState({ loading: false, image: null, fileNameImage: null, imageFormData: null });
					Alert.alert(
						'Actividades',
						'Actividad enviada con exito!',
						[ { text: 'Ok', onPress: () => this.getActivities() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Actividades', 'Actividad fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Actividades', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
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

	loadPhotoHandler = (show) => {
		console.log('show: ', show);
		if (show === 'library') {
			ImagePicker.launchImageLibrary(this.state.options, (response) => {
				console.log('ResponseImagePicker: ', response);

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
				console.log('ResponseImagePicker: ', response);

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
		if (this.state.imageFormData && this.state.formIsValid) {
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
					this.sendNewActivityHandler();
				})
				.catch((err) => {
					this.setState({ loading: false });
					Alert.alert('Actividades', 'Imagen fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
					console.log('ErrorCloudinary: ', err);
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Actividades', '¡Complete el formulario correctamente!', [ { text: 'Ok' } ], {
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
			const filteredActivities = this.state.activities.filter((act) => {
				const filterAct = act.activityData['actividad'];
				const filterDate = act.activityData['fecha'].split('T', 1);
				console.log('filterNew: ', filterAct);
				console.log('filterDate: ', filterDate[0]);
				if (filterAct.includes(text) || filterDate[0].includes(text)) {
					ban = true;
					return act;
				}
			});
			if (ban) {
				this.setState({ activities: filteredActivities });
			}
		} else this.getActivities();
	};
	startSearch = () => {
		this.setState({ search: !this.state.search });
	};
	showCalendar = (refresh) => {
		this.setState({ showCalendar: !this.state.showCalendar });
		if (refresh === 'refresh') this.getActivities();
	};
	render() {
		const formElements = [];
		for (let key in this.state.form) {
			formElements.push({
				id: key,
				config: this.state.form[key]
			});
		}
		spinner = <CustomSpinner color="blue" />;
		const list = this.state.activities.map((act, index) => (
			<Actividad
				key={act.id}
				id={act.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getActivities}
				data={act.activityData}
				describe={this.props}
				index={index + 1}
				showLikeIcons={this.state.showLikeIcons}
				authorizedEvent={this.state.authorizedEvent}
			/>
		));
		const calendar = (
			<Calendar
				style={styles.calendar}
				current={new Date()}
				minDate={'2012-05-10'}
				maxDate={'2024-05-29'}
				firstDay={1}
				markedDates={this.state.calendarDates}
				hideArrows={false}
				onDayPress={(day) => {
					this.showCalendar();
					this.filterData(day.dateString);
				}}
			/>
		);

		const title = (
			<View style={{ marginBottom: 5, width: width * 0.94, height: width * 0.42 }}>
				<CustomCardItemTitle
					title="ACTIVIDADES"
					description="Consulte las actividades y efemerides que celebramos en nuestro gobierno ciudadano."
					info="Delice hacia abajo, para leer las actividades a futuro."
					image={require('../../assets/images/Descripcion/descripcion.png')}
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
								{!this.state.showCalendar ? list : calendar}
							</View>
						)}
					</View>
				</ScrollView>
			</Card>
		);
		const activiades = (
			<View style={{ flex: 1 }}>
				{title}
				{body}
			</View>
		);
		const addActTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner
					title="NUEVA ACTIVIDAD"
					image={require('../../assets/images/Preferences/add-orange.png')}
				/>
			</View>
		);
		const addActBody = (
			<Card style={styles.addAct}>
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
								/>
							))}
						</View>
					</CardItem>
				</ScrollView>
			</Card>
		);
		const addAct = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addActTitle}
				{this.state.loading && spinner}
				{addActBody}
			</View>
		);

		return (
			<SafeAreaView style={styles.safe}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar
							open={this.props}
							title={'Actividades'}
							color="#00a19a"
							showContentRight={true}
							titleOfAdd="Nueva Actividad"
							get={this.getActivities}
							add={() => this.setState({ addAct: true })}
							goBack={() => this.setState({ addAct: false })}
							isAdd={this.state.addAct}
							save={this.uploadPhotoHandler}
							isAdmin={true ? true : this.state.isAdmin}
							notifications={this.actOrDescNotification}
							actOrDesc={this.state.notifications}
							changeDisplay={this.changeDisplay}
							showLikeIcons={this.state.showLikeIcons}
							changed={(text) => this.searchTextHandler(text)}
							value={this.state.texToSearch}
							search={this.filterData}
							calendar={this.showCalendar}
							showCalendar={this.state.showCalendar}
							startSearch={this.startSearch}
							isSearch={this.state.search}
						/>
					</View>
					<StatusBar color="#00847b" />
					<KBAvoiding>
						<View style={{ flex: 1, margin: 10 }}>{!this.state.addAct ? activiades : addAct}</View>
					</KBAvoiding>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	safe: {
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
		margin: 5
	},
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
	addAct: {
		flex: 2,
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	cardBody: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	calendar: {
		borderTopWidth: 1,
		paddingTop: 5,
		paddingBottom: 5,
		borderBottomWidth: 1,
		borderColor: '#676766',
		height: width / 0.8
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
