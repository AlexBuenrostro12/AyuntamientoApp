import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, Dimensions, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Communications from 'react-native-communications';
import StatusBar from '../../UI/StatusBar/StatusBar';
import Aux from '../../hoc/Auxiliar/Auxiliar';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import Spinner  from '../../components/CustomSpinner/CustomSpinner';

class Login extends Component {
	state = {
		login: true,
		index: true,
		form: {
			email: {
				itemType: 'FloatingLabel',
				holder: 'Email',
				value: ''
			},
			password: {
				itemType: 'FloatingLabel',
				holder: 'Contraseña',
				value: '',
				password: true
			}
		},
		idToken: null,
		expiresIn: null,
		email: null,
		loading: false,
	};
	//Cambia de formulario dependiendo click de cada boton
	changeFormHandler = (ban, identifier) => {
		switch (identifier) {
			case 'index':
				this.setState({ index: ban });
				break;
			case 'login': 
				this.signInUser(false);
				this.state.idToken && this.state.expiresIn && this.setState({ login: ban });
				break;
		
			default:
				null;
				break;
		}
	};

	static navigationOptions = {
		header: null
	};
	
	//Controla el valor de los input
	inputChangeHandler = (text, identifier) => {
		const updatedForm = {
			...this.state.form
		};
		const updatedElement = {
			...updatedForm[identifier]
		};
		updatedElement.value = text;

		updatedForm[identifier] = updatedElement;

		this.setState({ form: updatedForm });
	};
	//Almacena el token y tiempo de expiracion del mismo en la app globalmente
	storeToken = async () => {
		try {
			await AsyncStorage.setItem('@storage_token', this.state.idToken);
			await AsyncStorage.setItem('@storage_expiresIn', this.state.expiresIn.toString());
			await AsyncStorage.setItem('@storage_email', this.state.email.toString());
			this.setState({ login: false });
			this.props.navigation.navigate(!this.state.login && 'App')

		} catch (e) {
			Alert.alert('Login', '¡Error al almacenar token!', [{text: 'Ok'}], {cancelable: false});
		}
	}
	//Ingresa usuario con sus credenciales
	signInUser = (isAdmin) => {
		let url = null;
		const { email, password } = this.state.form;
		let body = null;
		if(isAdmin) {
			url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBix5LF2utfHvWl6VB2cjdvZKtjXdbLz98';
			//email = this.state.form.email.value;
			//password = this.state.form.password.value;
			body = {
				email: email.value,
				password: password.value,
				returnSecureToken: true
			}
		} else {
			url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBix5LF2utfHvWl6VB2cjdvZKtjXdbLz98';
			body = {
				returnSecureToken: true
			}
		}
		this.setState({ loading: true });
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((parsedRes) => {
				this.setState({ loading: false });
				console.log(parsedRes);
				const { idToken, error, expiresIn, email } = parsedRes;
				if (idToken) {
					const now = new Date();
					const expiryDate = now.getTime() + expiresIn * 1000;
					console.log(now, new Date(expiryDate));
					this.setState({ idToken: idToken, expiresIn: expiryDate, email: email ? 'true' : 'false' });
					this.storeToken();
				} 
				if(error){
					this.setState({ loading: false });
					Alert.alert('Login', '¡Error: ' + error.code + ', ' + error.message, [{text: 'Ok'}], {cancelable: false});
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
				alert('Authentication failed, please try again, catch');
			});
	};

	render() {
		const formElements = [];
		for (let key in this.state.form) {
			if (!this.state.index) {
				formElements.push({
					id: key,
					config: this.state.form[key]
				});
			}
		}
		console.log(this.state);

		const spinner = (
				<Spinner color="blue" />			
			// <View style={styles.spinner}>
			// </View>

		);

		const content = (
			
			<ImageBackground
			imageStyle={{ resizeMode: 'stretch' }}
			source={require('../../assets/images/Ayuntamiento/fondo.jpg')}
			style={styles.container}
			>
			<ScrollView style={styles.scroll}>
				<Image 
					style={styles.image} 
					source={require('../../assets/images/Ayuntamiento/logo.png')} />

				{!this.state.loading ? <View style={styles.form}>
						<View style={{ alignSelf: 'center' }}>
							<Text style={styles.text}>Inicio de sesión</Text>
						</View>
						<View style={styles.loginBtns}>
							{/* Administrador */}
							{this.state.index && <CustomButton
														style="Login"
														name="Administrador"
														clicked={() => this.changeFormHandler(false, 'index')}/>}
							{/* Invitado */}
							{this.state.index && <CustomButton
														style="Login"
														name="Invitado"
														clicked={() => this.changeFormHandler(false, 'login')}/>}
							{/* Invitado */}
							{this.state.index && <CustomButton
														style="Emergencia"
														name="Emergencia"
														clicked={() => Communications.phonecall('911', true)}/>}
							{/* Regresar al inicio */}
							{!this.state.index && <CustomButton
														style="Login"
														name="Regresar al inicio"
														clicked={() => this.changeFormHandler(true, 'index')}/>}
						</View>
						{/* Form */}
						<View style={styles.bckgrnd}>
							{formElements.map((e) => (
								<CustomInput
								key={e.id}
								itemType={e.config.itemType}
								holder={e.config.holder}
								changed={(text) => this.inputChangeHandler(text, e.id)}
								password={e.config.password}
								/>
								))}
							{/* Ingresar (botón verde) admin*/}
							{!this.state.index && <CustomButton
														style="Success"
														name="Ingresar"
														clicked={() => this.signInUser(true)}/>}
						</View>
					</View> : spinner}
				</ScrollView>
			</ImageBackground>
		);

		const form = (
			<SafeAreaView style={{ flex: 1 }}>
					<StatusBar color="#FEA621" />
					<View style={{ flex: 1 }}>{content}</View>
			</SafeAreaView>
		);

	return <Aux>{form}</Aux>;
	}
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',	
	},
	form: {
		flex: 1,
	},
	image: {
		resizeMode: 'contain',
		height: height / 2,
		width: width / 2,
		alignSelf: 'center',
	},
	text: {
		fontFamily: 'sans serif',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white',
		borderRadius: 5
	},
	bckgrnd: {
		borderRadius: 5
	},
	loginBtns: {
		alignSelf: 'center',
		width: width / 2,
		borderRadius: 5
	},
	spinner: {
		flex: 1,
	},
	scroll: {
		flex: 1,
	}
});

export default Login;
