import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Image, Alert, TouchableOpacity, FlatList } from 'react-native';
import { Card, CardItem } from 'native-base';
import styled, { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axiosCloudinary from 'axios';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Noticia from '../../components/Noticia/Noticia';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

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
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
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
			console.log('Noticias.js: ', this.state.tokenIsValid);
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
	}

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
					const { url, eager, } = data;
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
		const list = this.state.news.map((nw) => (
			<Noticia
				key={nw.id}
				id={nw.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getNews}
				data={nw.newData}
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
							{!this.state.loading ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
								<CustomButton style="Success" name="Agregar" clicked={() => this.uploadPhotoHandler()} />
								<CustomButton style="Danger" name="Regresar" clicked={() => this.getNews()} />
							</View> : spinner}
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
