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
		},
		formIsValid: false,
		activities: [],
		isAdmin: true,
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
		this.setState({ loading: true, addAct: false });
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
					Alert.alert('Actividades', 'Actividad enviada con exito!', [ { text: 'Ok', onPress: () => this.getActivities() } ], {
						cancelable: false
					});
				})
				.catch((error) => {
					Alert.alert('Actividades', 'Actividad fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
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
															data={act.activityData} />);

		const body = (
			<View style={styles.body}>
				<Card>
					<CustomCardItemTitle
						title="Calendario de actividades"
						description="Visualice, agregue y edite actividades relevantes."
						image={require('../../assets/images/Noticia/noticia.png')}
					/>
					<CardItem bordered>
						<View style={styles.cardBody}>
							<View style={styles.btns}>
								<View style={styles.btn}>
									<Text style={{ fontSize: 20 }}>Recargar</Text>
									<TouchableOpacity onPress={() => this.getActivities()}>
										<Image
											style={{ height: 30, width: 30, resizeMode: 'contain' }}
											source={require('../../assets/images/Refresh/refresh.png')}
										/>
									</TouchableOpacity>
								</View>
								{this.state.isAdmin && <View style={styles.btn}>
									<Text style={{ fontSize: 20 }}>Agregar actividad</Text>
									<TouchableOpacity onPress={() => this.setState({ addAct: true })}>
										<Image
											style={{ height: 30, width: 30, resizeMode: 'contain' }}
											source={require('../../assets/images/Add/add.png')}
										/>
									</TouchableOpacity>
								</View>}
							</View>
							{this.state.loading ? spinner: list}
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
								/>
							))}
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
								<CustomButton 
									style="Success" 
									name="Agregar" 
									clicked={() => this.sendNewActivityHandler()} />
								<CustomButton
									style="Danger"
									name="Regresar"
									clicked={() => this.getActivities()}
								/>
							</View>
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
					<StatusBar color="#ff9933" />
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
	}
});
