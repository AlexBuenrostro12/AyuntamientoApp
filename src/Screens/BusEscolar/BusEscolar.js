import React, { Component } from 'react';
import {
	View,Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Alert,
	TimePickerAndroid,
	Image, 
	Dimensions,
	BackHandler,
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
import CustomAddBanner from '../../components/CustomAddBanner/CustomAddBanner';
import KBAvoiding from '../../components/KBAvoiding/KBAvoiding';

export default class BusEscolar extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

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
			lugarSalida: {
				itemType: 'FloatingLabel',
				holder: 'Lugar de salida',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 30
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
			lugarRegreso: {
				itemType: 'FloatingLabel',
				holder: 'Lugar de regreso',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 30
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
			},
		},
		formIsValid: false,
		showButtons: true,
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
		drawerLabel: () => (<Text style={styles.drawerLabel}>Bus Escolar</Text>),
		drawerIcon: ({ tintColor }) => (
			<Image 
				source={require('../../assets/images/Drawer/bus.png')}
				style={styles.drawerIcon}
				resizeMode='contain' />
		)
	};

	async componentDidMount() {
		//BackHandler
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
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
	};

	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (!this.state.search && !this.state.addBus) {
			if (isDrawerOpen) closeDrawer();
			else openDrawer();
		}

		if (this.state.search)
			this.startSearch();
		
		if(this.state.addBus)
			this.setState({ addBus: false });
				
		return true;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
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
				this.setState({ loading: false, buses: fetchedBuses.reverse() });
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
			this.setState({ loading: false });
			Alert.alert('Bus escolar', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
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
			const filteredBusses = this.state.buses.filter((bs) => {
				const filterDriver = bs.busData['chofer'];
				const filterDestiny = bs.busData['destino'];
				console.log('filterDriver: ', filterDriver);
				console.log('filterDestiny: ', filterDestiny);
				if (filterDriver.includes(text) || filterDestiny.includes(text)) {
					ban = true;
					return bs;
				}
			});
			if (ban) {
				this.setState({ buses: filteredBusses });
			}
		} else this.getBuses();
	};
	startSearch = () => {
		this.setState({ search: !this.state.search });
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
		const list = this.state.buses.map((bss, index) => (
			<Buses
				key={bss.id}
				id={bss.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getBuses}
				data={bss.busData}
				describe={this.props}
				index={index + 1}
				showLikeIcons={this.state.showLikeIcons}
			/>
		));

		const spinner = <CustommSpinner color="blue" />;

		const title = (
			<View style={{ marginBottom: 5, width: width * 0.94, height: width * 0.40 }}>
				<CustomCardItemTitle
					title="BUS ESCOLAR"
					description="Consulta los horarios y destinos de tus camiones"
					info="Delice hacia abajo, para los horarios más antiguos."
					image={require('../../assets/images/Ubicacion/search.png')}
				/>
			</View>
		);

		const body = (
			<Card style={{ flex: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ margin: 5, alignItems: 'center' }}>
					<View style={styles.cardBody}>
						{this.state.loading ? (
								spinner
							) : (
								<View style={this.state.showLikeIcons ? styles.scrollDataListIcons : styles.scrollDataList}>
									{list}
								</View>
							)}
					</View>
				</ScrollView>
			</Card>
		);

		const bus = (
			<View style={{ flex: 1 }}>
				{title}
				{body}
			</View>
		);

		const addBusTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner title="NUEVO HORARIO" image={require('../../assets/images/Preferences/add-orange.png')} />
			</View>
		);
		const addBusBody = (
			<Card style={styles.add}>
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
								/>
							))}
						</View>
					</CardItem>
				</ScrollView>
			</Card>
		);

		const addBus = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addBusTitle}
				{this.state.loading && spinner}
				{addBusBody}
			</View>
		);

		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar 
							open={this.props} 
							title="Buses"
							color="#d4e283"
							showContentRight={true}
							titleOfAdd="Nuevo bus"
							get={this.getBuses}
							add={() => this.setState({ addBus: true })}
							goBack={() => this.setState({ addBus: false })}
							isAdd={this.state.addBus}
							save={this.sendNewBusHandler}
							isAdmin={this.state.isAdmin}
							changeDisplay={this.changeDisplay}
							showLikeIcons={this.state.showLikeIcons}
							changed={(text) => this.searchTextHandler(text)}
							value={this.state.texToSearch}
							search={this.filterData} 
							startSearch={this.startSearch}
							isSearch={this.state.search}
						/>	
					</View>
					<StatusBar color="#bac95f" />
					<KBAvoiding>
						<View style={{ flex: 1, margin: 10 }}>
							{!this.state.addBus ? bus : addBus}
						</View>
					</KBAvoiding>
				</View>
			</SafeAreaView>
		);
	}
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		overflow: 'scroll',
		backgroundColor: 'white'
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
	add: {
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
