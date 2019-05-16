import React, { Component } from 'react';
import { View, StyleSheet, Platform, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { Card, CardItem } from 'native-base';
import styled, { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axiosCloudinary from 'axios';
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
import Noticia from '../../components/Noticia/Noticia';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import firebaseClient from '../../components/AuxiliarFunctions/FirebaseClient';

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

const theme = {
	commonFlex: '1',
	customMarginValue: '5px'
};

const StyledSafeArea = styled.SafeAreaView`flex: ${theme.commonFlex};`;

const StyledContainer = styled.View`
	flex: ${theme.commonFlex};
	flex-direction: column;
	flex-wrap: wrap;
	overflow: scroll;
`;

const StyledHeader = styled.View``;

const StyledMainScroll = styled.ScrollView``;

const StyledNoticias = styled.View`
	flex: ${theme.commonFlex};
	margin: ${theme.customMarginValue};
`;

const StyledCardBody = styled.View`
	flex: ${theme.commonFlex};
	flex-direction: column;
	justify-content: center;
`;

export default class Noticias extends Component {
	state = {
		news: [],
		loading: true,
		addNew: false,
		isAdmin: null,
		addNew: false,
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
		initNotif: null,
		fcmTokens: [],
	};

	async componentDidMount() {
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
	}
	//SendRemoteNotification
	sendRemoteNotification = () => {
		this.getFCMTokens();
		let body;
		console.log('sendRemoteNotification:, ', this.state.notificationToken);
		if (Platform.OS === 'android') {
			body = {
				registration_ids: this.state.fcmTokens,
				notification: {
					title: 'Nueva noticia',
					body: '!' + this.state.form['noticia'].value + '¡',
					// icon: require('../../assets/images/Ayuntamiento/logo-naranja.png'),
					color: '#FEA621',
					sound: null,
					tag: this.state.form['noticia'].value,
					priority: 'high'
				},
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
	};
	//Get news
	getNews = () => {
		this.setState({ loading: true, addNew: false, image: null, fileNameImage: null, imageFormData: null });
		axios
			.get('/news.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedNews = [];
				console.log('Noticias, res: ', res);
				for (let key in res.data) {
					fetchedNews.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, news: fetchedNews });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};
	//Get fcmTokens
	getFCMTokens = () => {
		//Get fcm tokens
		const fetchedfcmTokens = [];
		axios
			.get('/fcmtokens.json?auth=' + this.state.token)
			.then((res) => {
				console.log('Noticias, resfcmTokens: ', res);
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
				console.log('fcmtkns: ', fcmtkns);
				this.setState({ fcmTokens: fcmtkns }, () => this.verifyfcmTokens());
			})
			.catch((err) => {});
	};
	//Verify tokens
	verifyfcmTokens = () => {
		let exist = false;
		console.log('fetchedfcmToken: ', this.state.fcmTokens);
		//Check if this token already exist in db
		for (let i = 0; i < this.state.fcmTokens.length; i++) {
			const element = this.state.fcmTokens[i];
			if (element === this.state.notificationToken) exist = true;
		}
		console.log('Element: ', exist);

		if (!exist) {
			const formData = {};
			formData['token' + Math.floor(Math.random() * 1000 + 1) + 'fcm'] = this.state.notificationToken;
			const fcmtoken = {
				tokenData: formData
			};
			console.log('Noticias.js: formData, ', formData);
			axios
				.post('/fcmtokens.json?auth=' + this.state.token, fcmtoken)
				.then((response) => {
					console.log('Noticias.js: responsefcm, ', response);
					this.getFCMTokens();
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Noticias', 'Noticia fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		}
	}; //end
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

	loadPhotoHandler = () => {
		ImagePicker.showImagePicker(this.state.options, (response) => {
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
			Alert.alert('Actividades', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};
	render() {
		console.log('Noticias.js:props: ', this.props)
		const list = this.state.news.map((nw) => (
			<Noticia
				key={nw.id}
				id={nw.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getNews}
				data={nw.newData}
				describe={this.props}
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
		const noticias = (
			<StyledNoticias>
				<Card>
					<CustomCardItemTitle
						title="Noticias"
						description="Las noticias más 
                            relebantes de Tecalitlán a tu alcance."
						image={require('../../assets/images/Noticia/noticia.png')}
					/>
					<CardItem bordered>
						<StyledCardBody>
							<View style={styles.btns}>
								<View style={styles.btn}>
									<Text style={{ fontSize: 20 }}>Recargar</Text>
									<TouchableOpacity onPress={() => this.getNews()}>
										<Image
											style={{ height: 30, width: 30, resizeMode: 'contain' }}
											source={require('../../assets/images/Refresh/refresh.png')}
										/>
									</TouchableOpacity>
								</View>
								{this.state.isAdmin && (
									<View style={styles.btn}>
										<Text style={{ fontSize: 20 }}>Agregar noticia</Text>
										<TouchableOpacity onPress={() => this.setState({ addNew: true })}>
											<Image
												style={{ height: 30, width: 30, resizeMode: 'contain' }}
												source={require('../../assets/images/Add/add.png')}
											/>
										</TouchableOpacity>
									</View>
								)}
							</View>
							{this.state.loading ? spinner : list}
						</StyledCardBody>
					</CardItem>
				</Card>
			</StyledNoticias>
		);
		const addNew = (
			<View style={styles.body}>
				<Card>
					<CustomCardItemTitle
						title="Agregar noticia"
						description="Agregue una noticia"
						image={require('../../assets/images/Descripcion/descripcion.png')}
					/>
					<CardItem bordered>
						<View style={styles.cardBody}>
							{formElements.map((e) => (
								<CustomInput
									key={e.id}
									itemType={e.config.itemType}
									holder={e.config.holder}
									value={e.config.value}
									changed={(text) => this.inputChangeHandler(text, e.id)}
									loadPhoto={() => this.loadPhotoHandler()}
									image={this.state.image}
									name={this.state.fileNameImage}
								/>
							))}
							{!this.state.loading ? (
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
									<CustomButton
										style="Success"
										name="Agregar"
										clicked={() => this.uploadPhotoHandler()}
									/>
									<CustomButton style="Danger" name="Regresar" clicked={() => this.getNews()} />
								</View>
							) : (
								spinner
							)}
						</View>
					</CardItem>
				</Card>
			</View>
		);

		return (
			<StyledSafeArea>
				<StyledContainer>
					<StyledHeader>
						<HeaderToolbar open={this.props} title="Noticias" />
					</StyledHeader>
					<StatusBar color="#FEA621" />
					<StyledMainScroll>
						<ThemeProvider theme={theme}>{!this.state.addNew ? noticias : addNew}</ThemeProvider>
					</StyledMainScroll>
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
	}
});
