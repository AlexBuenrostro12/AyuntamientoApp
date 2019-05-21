import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Alert,
	Image,
	TouchableOpacity,
	TimePickerAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import { Card, CardItem } from 'native-base';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustommSpinner from '../../components/CustomSpinner/CustomSpinner';
import axios from '../../../axios-ayuntamiento';
import Buses from '../../components/Buses/Buses';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

export default class BusEscolar extends Component {
	state = {
		buses: [],
		loading: true,
		addBus: false,
		token: null,
		isAdmin: null,
		form: {
			placa: {
				itemType: 'FloatingLabel',
				holder: 'Placa',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 20
				},
				valid: false
			},
			chofer: {
				itemType: 'FloatingLabel',
				holder: 'Chofer',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 25
				},
				valid: false
			},
			horaSalida: {
				itemType: 'Hour',
				holder: 'Salida',
				value: '',
				validation: {
					haveValue: true
				},
				valid: false
			},
			horaRegreso: {
				itemType: 'Hour',
				holder: 'Regreso',
				value: '',
				validation: {
					haveValue: true
				},
				valid: false
			},
			destino: {
				itemType: 'FloatingLabel',
				holder: 'Destino',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 30
				},
				valid: false
			}
		},
		formIsValid: false,
		showButtons: true
	};

	async componentDidMount() {
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			email = await AsyncStorage.getItem('@storage_email');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('BusEscolar.js: ', token);
			console.log('BusEscolar.js: ', parseExpiresIn, now);
			console.log('BusEscolar.js: ', email);
			if (token && parseExpiresIn > now) {
				this.setState({ token: token });
				if (email !== 'false') this.setState({ isAdmin: true });
				else this.setState({ isAdmin: false });
				//chek email to see if the user is admin
				this.getBuses();
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
					'Bus Escolar',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errores
		}
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

	getBuses = () => {
		this.setState({ loading: true, addBus: false, showButtons: true });
		axios
			.get('/buses.json?auth=' + token)
			.then((res) => {
				const fetchedBuses = [];
				for (let key in res.data) {
					fetchedBuses.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, buses: fetchedBuses });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
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

	sendNewBusHandler = () => {
		//check if the form is valid
		this.setState({ loading: true });
		if (this.state.formIsValid) {
			const formData = {};
			for (let formElementIdentifier in this.state.form) {
				formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
			}
			const buses = {
				busData: formData
			};

			axios
				.post('/buses.json?auth=' + this.state.token, buses)
				.then((response) => {
					this.setState({ loading: false });
					Alert.alert(
						'Bus escolar',
						'Nuevo bus enviado con exito!',
						[ { text: 'Ok', onPress: () => this.getBuses() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Bus escolar', 'Nuevo bus fallido al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			Alert.alert('Bus escolar', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
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
		const list = this.state.buses.map((bss) => (
			<Buses
				key={bss.id}
				id={bss.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getBuses}
				data={bss.busData}
				describe={this.props}
			/>
		));

		const spinner = <CustommSpinner color="blue" />;

		const bus = (
			<View style={{ flex: 1, margin: 5 }}>
				<Card>
					<CustomCardItemTitle
						title="Bus escolar"
						description="Consulta los horarios y destinos de tus camiones."
						image={require('../../assets/images/Ubicacion/search.png')}
						showButtons={this.state.showButtons}
						get={this.getBuses}
						add={() => this.setState({ addBus: true, showButtons: false })}
						isAdmin={this.state.isAdmin}
					/>
					<CardItem bordered>
						<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
							{this.state.loading ? spinner : <View style={styles.scrollDataList}>{list}</View>}
						</View>
					</CardItem>
				</Card>
			</View>
		);

		const addBus = (
			<View style={styles.body}>
				<Card>
					<CustomCardItemTitle
						title="Agregar nuevo horario"
						description="Agregue un nuevo horario"
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
							{!this.state.loading ? (
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
									<CustomButton
										style="Success"
										name="Agregar"
										clicked={() => this.sendNewBusHandler()}
									/>
									<CustomButton style="Danger" name="Regresar" clicked={() => this.getBuses()} />
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
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<HeaderToolbar open={this.props} title={!this.state.addBus ? 'Bus escolar' : 'Agregar Bus'} />

					<StatusBar color="#FEA621" />
					<ScrollView>{!this.state.addBus ? bus : addBus}</ScrollView>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		overflow: 'scroll'
	},
	view: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold'
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
		flexWrap: 'wrap'
	}
});
