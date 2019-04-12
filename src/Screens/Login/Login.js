import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBar from '../../UI/StatusBar/StatusBar';
import DraweNavigation from '../../components/Navigation/DrawerNavigation/DrawerNavigation';
import Aux from '../../hoc/Auxiliar/Auxiliar';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

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
				value: ''
			}
		},
		idToken: null,
		expiresIn: null,
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
		} catch (e) {
			Alert.alert('Login', '¡Error al almacenar token!', [{text: 'Ok'}], {cancelable: false});
		}
	}
	//Ingresa usuario con sus credenciales
	signInUser = (isAdmin) => {
		const url ='https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBix5LF2utfHvWl6VB2cjdvZKtjXdbLz98';
		let email = password = null;
		if(isAdmin) {
			email = this.state.form.email.value;
			password = this.state.form.password.value;
		} else {
			email = 'user@user.com';
			password = 'user123';
		}
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				email: email,
				password: password,
				returnSecureToken: true
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((parsedRes) => {
				console.log(parsedRes);
				const { idToken, error, expiresIn } = parsedRes;
				if (idToken) {
					const now = new Date();
					const expiryDate = now.getTime() + expiresIn * 1000;
					console.log(now, new Date(expiryDate));
					this.setState({ idToken: idToken, login: false, expiresIn: expiryDate });
					this.storeToken();
					//Storage token left
				} 
				if(error){
					Alert.alert('Login', '¡Error: ' + error.code + ', ' + error.message, [{text: 'Ok'}], {cancelable: false});
				}
			})
			.catch((err) => {
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
		const content = (
			<ImageBackground
				imageStyle={{ resizeMode: 'stretch' }}
				source={require('../../assets/images/Ayuntamiento/ayuntamiento.jpg')}
				style={{ flex: 1 }}
			>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View style={{ alignSelf: 'center' }}>
						<Text style={styles.text}>Inicio de sesión</Text>
					</View>
					<View style={styles.blueButton}>
						{/* Administrador */}
						{this.state.index && <CustomButton
													style="Info"
													name="Administrador"
													clicked={() => this.changeFormHandler(false, 'index')}/>}
						{/* Invitado */}
						{this.state.index && <CustomButton
													style="Info"
													name="Invitado"
													clicked={() => this.changeFormHandler(false, 'login')}/>}
						{/* Regresar */}
						{!this.state.index && <CustomButton
													style="Info"
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
							/>
						))}
						{/* Ingresar (botón verde) admin*/}
						{!this.state.index && <CustomButton
													style="Success"
													name="Ingresar"
													clicked={() => this.signInUser(true)}/>}
					</View>
				</View>
			</ImageBackground>
		);

		const form = (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar color="#ff9933" />
				<View style={{ flex: 1 }}>{content}</View>
			</SafeAreaView>
		);

	const drawer = <DraweNavigation token={this.state.idToken}/>;
		return <Aux>{this.state.login ? form : drawer}</Aux>;
	}
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontFamily: 'sans serif',
		fontSize: 35,
		fontWeight: 'bold',
		color: 'orange',
		backgroundColor: 'whitesmoke',
		borderRadius: 5
	},
	bckgrnd: {
		backgroundColor: 'whitesmoke',
		borderRadius: 5
	},
	blueButton: {
		alignSelf: 'center',
		width: width / 2,
		backgroundColor: 'whitesmoke',
		borderRadius: 5
	}
});

export default Login;
