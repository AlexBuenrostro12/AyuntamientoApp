import React, { Component } from 'react';
import { View, StyleSheet, Platform, Alert, Dimensions, ScrollView, Image, BackHandler, Text } from 'react-native';
import { Card, CardItem } from 'native-base';
import styled, { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axiosCloudinary from 'axios';
import FCM from 'react-native-fcm';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Noticia from '../../components/Noticia/Noticia';
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

const StyledCardBody = styled.View`
	flex: ${theme.commonFlex};
	flex-direction: column;
	justify-content: center;
`;

export default class Noticias extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	state = {
		news: [],
		loading: false,
		addNew: false,
		isAdmin: null,
		token: null,
		formIsValid: false,
		form: {
			noticia: {
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
				value: 'Direccion 1',
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
	};

	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	};

	//Style of drawer navigation
	static navigationOptions = {
		drawerLabel: () => (<Text style={styles.drawerLabel}>Noticias</Text>),
		drawerIcon: ({ tintColor }) => (
			<Image 
				source={require('../../assets/images/Drawer/news.png')}
				style={styles.drawerIcon}
				resizeMode='contain' />
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
			console.log('Noticias.js: ', token);
			console.log('Noticias.js: ', parseExpiresIn, now);
			if (token && parseExpiresIn > now) {
				this.setState({ token: token, tokenIsValid: true });
				if (email !== 'false') this.setState({ isAdmin: true });
				else this.setState({ isAdmin: false });
				this.getNews();
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
					'Noticias',
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
	};
	//Native backbutton
	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (!this.state.search && !this.state.addNew) {
			if (isDrawerOpen) closeDrawer();
			else openDrawer();
		}

		if (this.state.search)
			this.startSearch();
		
		if (this.state.addNew)
			this.setState({ addNew: false });
				
		return true;
	};
	//Remove subscription from native button
	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	};

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
						title: 'Nueva noticia',
						body: '!' + this.state.form['noticia'].value + '¡',
						sound: null,
						tag: this.state.form['noticia'].value,
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
	//Get news
	getNews = () => {
		this.setState({ loading: true, addNew: false, image: null, fileNameImage: null, imageFormData: null });
		axios
			.get('/news.json?auth=' + this.state.token,)
			.then((res) => {
				const fetchedNews = [];
				console.log('Noticias, res: ', res);
				for (let key in res.data) {
					fetchedNews.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, news: fetchedNews.reverse() });
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
					Alert.alert('Noticias', 'Noticia fallida al enviar!', [ { text: 'Ok' } ], {
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
		if (show === 'library'){
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
					this.sendNewHandler();
				})
				.catch((err) => {
					Alert.alert('Noticias', 'Imagen fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
					console.log('ErrorCloudinary: ', err);
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Noticias', '¡Complete el formulario correctamente!', [ { text: 'Ok' } ], {
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
			const news = {
				newData: formData
			};
			//Upload new
			axios
				.post('/news.json?auth=' + this.state.token, news)
				.then((response) => {
					this.sendRemoteNotification();
					this.setState({ loading: false, image: null, fileNameImage: null, imageFormData: null });
					Alert.alert(
						'Noticias',
						'Noticia enviada con exito!',
						[ { text: 'Ok', onPress: () => this.getNews() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Noticias', 'Noticia fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Noticias', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
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
			const filteredNews = this.state.news.filter((nw) => {
				const filterNew = nw.newData['noticia'];
				const filterDate = nw.newData['fecha'].split('T', 1);
				console.log('filterNew: ', filterNew);
				console.log('filterDate: ', filterDate[0]);
				if (filterNew.includes(text) || filterDate[0].includes(text)) {
					ban = true;
					return nw;
				}
			});
			if (ban) {
				this.setState({ news: filteredNews });
			}
		} else this.getNews();
	};
	startSearch = () => {
		this.setState({ search: !this.state.search });
	};

	render() {
		const list = this.state.news.map((nw, index) => (
			<Noticia
				key={nw.id}
				id={nw.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getNews}
				data={nw.newData}
				describe={this.props}
				index={index + 1}
				showLikeIcons={this.state.showLikeIcons}
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
		const title = (
			<View style={{ marginBottom: 5, width: width * 0.94, height: width * 0.40 }}>
				<CustomCardItemTitle
					title="NOTICIAS"
					description="Las Noticias más 
					relevantes de tu gobierno ciudadano."
					info="Delice hacia abajo, para las noticias mas antiguas."
					image={require('../../assets/images/Noticia/speaker.png')}
				/>
			</View>
		);
		const body = (
			<Card style={{ flex: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ margin: 5, alignItems: 'center' }}>
					<StyledCardBody>
						{this.state.loading ? (
							spinner
						) : (
							<View style={this.state.showLikeIcons ? styles.scrollDataListIcons : styles.scrollDataList}>
								{list}
							</View>
						)}
					</StyledCardBody>
				</ScrollView>
			</Card>
		);
		const noticias = (
			<View style={{ flex: 1 }}>
				{title}
				{body}
			</View>
		);
		const addNewTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner title="AGREGAR NOTA" image={require('../../assets/images/Preferences/add-orange.png')} />
			</View>
		);
		const addNewBody = (
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
		const addNew = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addNewTitle}
				{this.state.loading && spinner}
				{addNewBody}
			</View>
		);

		return (
			<StyledSafeArea>
				<StyledContainer>
					<StyledHeader>
						<HeaderToolbar
							open={this.props}
							title="Noticias"
							color="#e2487d"
							showContentRight={true}
							titleOfAdd="Nueva noticia"
							get={this.getNews}
							add={() => this.setState({ addNew: true })}
							goBack={() => this.setState({ addNew: false })}
							isAdd={this.state.addNew}
							save={this.uploadPhotoHandler}
							isAdmin={this.state.isAdmin}
							notifications={this.actOrDescNotification}
							actOrDesc={this.state.notifications}
							changeDisplay={this.changeDisplay}
							showLikeIcons={this.state.showLikeIcons}
							changed={(text) => this.searchTextHandler(text)}
							value={this.state.texToSearch}
							search={this.filterData}
							startSearch={this.startSearch}
							isSearch={this.state.search}
						/>
					</StyledHeader>
					<StatusBar color="#c7175b" />
					<View style={{ flex: 1, margin: 10 }}>
						<ThemeProvider theme={theme}>{!this.state.addNew ? noticias : addNew}</ThemeProvider>
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
		height: width * .07,
		width: width * .07,
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
