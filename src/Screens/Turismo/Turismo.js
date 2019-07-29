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
	BackHandler
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

const { height, width } = Dimensions.get('window');

export default class Turismo extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	state = {
		token: null,
		loading: true,
		addPlace: false,
		form: {
			lugar: {
				itemType: 'FloatingLabel',
				holder: 'Nombre',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
			},
			ubicacion: {
				itemType: 'PickLocation',
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
        focusedLocation: {
			latitude: 19.47151,
			longitude: -103.30706,
			latitudeDelta: 0.0122,
			longitudeDelta: width / height * 0.0122
        },
        chosenLocation: false,
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
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/tourism.png')}
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
			console.log('Turismo.js: ', token);
			console.log('Turismo.js: ', parseExpiresIn, now);
			console.log('Turismo.js: ', email);
			console.log('Turismo.js: ', this.props);
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
					'Turismo',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errors
		}
	};

	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (isDrawerOpen) closeDrawer();
		else openDrawer();
				
		return true;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	};

	getActivities = () => {
		this.setState({ loading: true, addPlace: false, showButtons: true });
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
				this.setState({ loading: false, activities: fetchedActivities.reverse() });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
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
					this.sendRemoteNotification();
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

    pickLocationHandler = (event) => {
		const coordinates = event.nativeEvent.coordinate;
		this.setState((prevState) => {
			return {
				focusedLocation: {
					...prevState.focusedLocation,
					latitude: coordinates.latitude,
					longitude: coordinates.longitude
				},
				chosenLocation: true
			};
		});
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

		const body = (
			<View style={{ flex: 1 }}>
                <Card style={{ flex: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ margin: 5, alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                            {this.state.loading ? (
                                spinner
                            ) : (
                                <View style={styles.scrollDataListIcons}>
                                    {null}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </Card>
            </View>
		);
		const addPlaceTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner
					title="NUEVA LUGAR"
					image={require('../../assets/images/Preferences/add-orange.png')}
				/>
			</View>
		);
		const addPlaceBody = (
			<Card style={styles.addPlace}>
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
                                    pickLocationHandler={(event) => this.pickLocationHandler(event)}
                                    chosenLocation={this.state.chosenLocation}
                                    focusedLocation={this.state.focusedLocation}
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
		const addPlace = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addPlaceTitle}
				{this.state.loading && spinner}
				{addPlaceBody}
			</View>
		);

		return (
			<SafeAreaView style={styles.safe}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar
							open={this.props}
							title="Turismo"
							color="#1dd2fc"
							showContentRight={true}
							titleOfAdd="Nueva lugar"
							get={this.getActivities}
							add={() => this.setState({ addPlace: true })}
							goBack={() => this.setState({ addPlace: false })}
							isAdd={this.state.addPlace}
							save={this.uploadPhotoHandler}
							isAdmin={true ? true : this.state.isAdmin}
							showLikeIcons={this.state.showLikeIcons}
							changed={(text) => this.searchTextHandler(text)}
							value={this.state.texToSearch}
							search={this.filterData}
							startSearch={this.startSearch}
							isSearch={this.state.search}
						/>
					</View>
					<StatusBar color="#00a3e4" />
					<View style={{ flex: 1, margin: 10 }}>{!this.state.addPlace ? body : addPlace}</View>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	safe: {
		flex: 1
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		overflow: 'scroll'
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
	addPlace: {
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
	}
});
