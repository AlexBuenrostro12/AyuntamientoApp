import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Alert,
	Dimensions,
	Image,
	Platform,
	BackHandler
} from 'react-native';
import { Card, CardItem } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import axiosCloudinary from 'axios';
import StatusBar from '../../UI/StatusBar/StatusBar';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import CustomAddBanner from '../../components/CustomAddBanner/CustomAddBanner';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomInput from '../../components/CustomInput/CustomInput';
import axios from '../../../axios-ayuntamiento';
import TurismoAux from '../../components/TurismoAux/TurismoAux';

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
				latitude: '',
				longitude: '',
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
			imagenes: {
				itemType: 'LoadMultipleImage',
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
		places: [],
		isAdmin: true,
		image: null,
		fileNameImage: null,
		imageFormData: null,
		formDataArray: [],
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
		arrayOfUris: []
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

				this.getPlaces();
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
	}

	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (!this.state.search && !this.state.addPlace) {
			if (isDrawerOpen) closeDrawer();
			else openDrawer();
		}
		if (this.state.search) this.startSearch();
		if (this.state.addPlace)
			this.setState({ addPlace: false });
		return true;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	getPlaces = () => {
		this.setState({ loading: true, addPlace: false, showButtons: true });
		axios
			.get('/tourism.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedPlaces = [];
				for (let key in res.data) {
					fetchedPlaces.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, places: fetchedPlaces.reverse() });
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
	}

	sendNewActivityHandler = (urlsResponse) => {
		//check if the form is valid
		this.setState({ loading: true });
		if (this.state.formIsValid && this.state.chosenLocation && this.state.formDataArray.length !== 0) {
			const formData = {};
			for (let formElementIdentifier in this.state.form) {
				if (formElementIdentifier !== 'imagenes')
					formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
			}
			formData['ubicacion'] = {
				latitude: this.state.focusedLocation.latitude,
				longitude: this.state.focusedLocation.longitude
			};
			const obj = {};
			for (let u = 0; u < urlsResponse.length; u++) {
				const element = urlsResponse[u];
				obj['url' + String(u)] = element.url;
			}
			formData['imagenes'] = obj;

			const place = {
				placeData: formData
			};
			console.log('place: ', place);

			axios
				.post('/tourism.json?auth=' + this.state.token, place)
				.then((response) => {
					this.setState({ loading: false, image: null, fileNameImage: null, formDataArray: [] });
					Alert.alert(
						'Turismo',
						'¡Nuevo lugar enviado con exito!',
						[ { text: 'Ok', onPress: () => this.getPlaces() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Turismo', '¡Lugar fallido al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Turismo', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};

	loadPhotosHandler = async () => {
		try {
			const images = await ImagePicker.openPicker({
				multiple: true,
				maxFiles: 10,
				mediaType: 'photo',
				includeBase64: true
			});
			const formDataArray = [];
			const arrayOfUris = [];
			console.log('multipleImages: ', images);
			//Preset
			const UPLOAD_PRESET_NAME = 'ayuntamiento';

			//Loop through array of images to add data to imageFormData
			let uri = null;
			for (let i = 0; i < images.length; i++) {
				//Initialize imageFormData
				let imageFormData = null;
				//Image form data
				imageFormData = new FormData();
				//Add the preset to imageFormData
				imageFormData.append('upload_preset', UPLOAD_PRESET_NAME);
				//Create a random name
				const name = Math.random() * 100 * i;
				//Destructuring response
				const { height, mime, modificationDate, data, path, size, width } = images[i];
				uri = path;
				imageFormData.append('file', {
					name: String(name),
					size: size,
					type: mime,
					data: data,
					uri: uri
				});
				formDataArray.push(imageFormData);
				arrayOfUris.push({
					uri: uri
				});
			}
			this.setState({ formDataArray: formDataArray, image: { uri: uri }, arrayOfUris: arrayOfUris });
			console.log('this.state.formDataArray: ', this.state.formDataArray);
		} catch (error) {
			console.log(error);
		}
	};

	uploadPhotoHandler = () => {
		this.setState({ loading: true });
		if (this.state.formIsValid && this.state.chosenLocation && this.state.formDataArray.length !== 0) {
			const URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/storage-images/image/upload';
			const promises = [];
			const urlsResponse = [];
			for (let i = 0; i < this.state.formDataArray.length; i++) {
				const formData = this.state.formDataArray[i];
				console.log('formData: ', formData);
				promises.push(
					axiosCloudinary({
						url: URL_CLOUDINARY,
						method: 'POST',
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						data: formData
					})
				);
			}
			console.log('promises: ', promises);
			axiosCloudinary.all(promises).then((results) => {
				results.forEach((response) => {
					console.log('resultsResponse: ', response);
					//Destructuring response
					const { data } = response;
					console.log('ResponseDataCloudinary: ', data);
					//Destructuring data
					const { url, eager } = data;
					//Push urls into urlsResponse
					urlsResponse.push({ url: url });
				});
				console.log('urlsResponse: ', urlsResponse);
				this.sendNewActivityHandler(urlsResponse);
			});
		} else {
			this.setState({ loading: false });
			Alert.alert('Turismo', '¡Complete el formulario correctamente!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};
	
	searchTextHandler = (text) => {
		this.setState({ texToSearch: text }, () => this.filterData(this.state.texToSearch));
	};
	filterData = (text) => {
		if (text !== '') {
			let ban = false;
			const filteredPlaces = this.state.places.filter((act) => {
				const filterPlace = act.placeData['lugar'];
				console.log('filterNew: ', filterPlace);
				if (filterPlace.includes(text)) {
					ban = true;
					return act;
				}
			});
			if (ban) {
				this.setState({ places: filteredPlaces });
			}
		} else this.getPlaces();
	};
	startSearch = () => {
		this.setState({ search: !this.state.search });
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
		const list = this.state.places.map((trs, index) => (
			<TurismoAux
				key={trs.id}
				id={trs.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getPlaces}
				data={trs.placeData}
				describe={this.props}
				index={index + 1}
				showLikeIcons={this.state.showLikeIcons}
			/>
		));

		const body = (
			<View style={{ flex: 1 }}>
				<Card style={{ flex: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
					<ScrollView style={{ flex: 1 }} contentContainerStyle={{ margin: 5, alignItems: 'center' }}>
						<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
							{this.state.loading ? spinner : <View style={styles.scrollDataListIcons}>{list}</View>}
						</View>
					</ScrollView>
				</Card>
			</View>
		);
		const addPlaceTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner
					title="NUEVO LUGAR"
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
									loadPhotos={this.loadPhotosHandler}
									image={this.state.image}
									name={this.state.fileNameImage}
									arrayOfUris={this.state.arrayOfUris}
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
							titleOfAdd="Nuevo lugar"
							get={this.getPlaces}
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
