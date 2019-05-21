import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	Image,
	Alert,
	TimePickerAndroid
} from 'react-native';
import { Card, CardItem } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axiosCloudinary from 'axios';
import StatusBar from '../../UI/StatusBar/StatusBar';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import axios from '../../../axios-ayuntamiento';
import Actividad from '../../components/Actividad/Actividad';

export default class Actividades extends Component {
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
		showButtons: true
	};

	async componentDidMount() {
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
				if (email !== 'false')
					this.setState({ isAdmin: true });
				else
					this.setState({ isAdmin: false });

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
	}

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
				this.setState({ loading: false, activities: fetchedActivities });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	}

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
					this.setState({ loading: false, image: null, fileNameImage: null, imageFormData: null });
					Alert.alert('Actividades', 'Actividad enviada con exito!', [ { text: 'Ok', onPress: () => this.getActivities() } ], {
						cancelable: false
					});
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


	render() {
		console.log(this.state);
		const formElements = [];
		for (let key in this.state.form) {
			formElements.push({
				id: key,
				config: this.state.form[key]
			});
		}
		spinner = <CustomSpinner color="blue" />;
		const list = this.state.activities.map((act) => <Actividad 
															key={act.id} 
															id={act.id} 
															token={this.state.token}
															isAdmin={this.state.isAdmin} 
															refresh={this.getActivities} 
															data={act.activityData}
															describe={this.props} />);

		const body = (
			<View style={styles.body}>
				<Card>
					<CustomCardItemTitle
						title="Calendario de actividades"
						description="Visualice, agregue y edite actividades relevantes."
						image={require('../../assets/images/Noticia/noticia.png')}
						showButtons={this.state.showButtons}
						get={this.getActivities}
						add={() => this.setState({ addAct: true, showButtons: false })}
						isAdmin={this.state.isAdmin}
					/>
					<CardItem bordered>
						<View style={styles.cardBody}>
							{this.state.loading ? spinner: <View style={styles.scrollDataList}>{list}</View>}
						</View>
					</CardItem>
				</Card>
			</View>
		);

		const addAct = (
			<View style={styles.body}>
				<Card>
					<CustomCardItemTitle
						title="Agregar actividad"
						description="Agregue una actividad"
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
									changed1={() => this.getTime(e.id)}
									loadPhoto={() => this.loadPhotoHandler()}
									image={this.state.image}
									name={this.state.fileNameImage}
								/>
							))}
							{!this.state.loading ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
								<CustomButton 
									style="Success" 
									name="Agregar" 
									clicked={() => this.uploadPhotoHandler()} />
								<CustomButton
									style="Danger"
									name="Regresar"
									clicked={() => this.getActivities()}
								/>
							</View> : spinner}
						</View>
					</CardItem>
				</Card>
			</View>
		);

		return (
			<SafeAreaView style={styles.safe}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar
							open={this.props}
							title={!this.state.addAct ? 'Actividades' : 'Agregar actividad'}
						/>
					</View>
					<StatusBar color="#FEA621" />
					<ScrollView>{!this.state.addAct ? body : addAct}</ScrollView>
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
	cardBody: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
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
	scrollDataList: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		flexWrap: 'wrap',
	}
});
