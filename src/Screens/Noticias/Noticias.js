import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { Card, CardItem } from 'native-base';
import styled, { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
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
			categoria: {
				itemType: 'FloatingLabel',
				holder: 'Categoria',
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
		},
	};

	async componentDidMount() {
		let token = expiresIn = null;
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
				if (email !== 'false')
					this.setState({ isAdmin: true });
				else
					this.setState({ isAdmin: false });
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
		this.setState({ loading: true, addNew: false });
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

	sendNewHandler = () => {
		//check if the form is valid
		this.setState({ loading: true });
		if (this.state.formIsValid) {
			const formData = {};
			for (let formElementIdentifier in this.state.form) {
				formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
			}
			const news = {
				newData: formData
			};

			axios
				.post('/news.json?auth=' + this.state.token, news)
				.then((response) => {
					Alert.alert('Noticias', 'Noticia enviada con exito!', [ { text: 'Ok', onPress: () => this.getNews() } ], {
						cancelable: false
					});
				})
				.catch((error) => {
					Alert.alert('Noticias', 'Noticia fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			Alert.alert('Actividades', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};

	render() {
		const list = this.state.news.map((nw) => <Noticia 
													key={nw.id} 
													id={nw.id}
													token={this.state.token}
													isAdmin={this.state.isAdmin}
													refresh={this.getNews}
													data={nw.newData} />);
		const spinner = <CustomSpinner color="blue" />;
		const formElements = [];
		for (let key in this.state.form) {
			formElements.push({
				id: key,
				config: this.state.form[key]
			});
		}
		console.log(this.state);
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
								{this.state.isAdmin && <View style={styles.btn}>
									<Text style={{ fontSize: 20 }}>Agregar noticia</Text>
									<TouchableOpacity onPress={() => this.setState({ addNew: true })}>
										<Image
											style={{ height: 30, width: 30, resizeMode: 'contain' }}
											source={require('../../assets/images/Add/add.png')}
										/>
									</TouchableOpacity>
								</View>}
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
								/>
							))}
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
								<CustomButton 
									style="Success" 
									name="Agregar" 
									clicked={() => this.sendNewHandler()} />
								<CustomButton
									style="Danger"
									name="Regresar"
									clicked={() => this.getNews()}
								/>
							</View>
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
	},
});
