import React, { Component } from 'react';
import { Alert, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Card, CardItem } from 'native-base';
import styled from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import axios from '../../../axios-ayuntamiento';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import Buzon from '../../components/Buzon/Buzon';

const StyledSafeArea = styled.SafeAreaView`flex: 1;`;

const StyledContainer = styled.View`
	flex: 1;
	flex-direction: column;
	flex-wrap: wrap;
	overflow: scroll;
`;

const StyledHeader = styled.View``;

const StyledMainScroll = styled.ScrollView``;

const StyledBuzon = styled.View`
	flex: 1;
	margin: 5px;
`;

const StyledForm = styled.View`
	flex: 1;
	flex-direction: column;
`;

export default class BuzonCiudadano extends Component {
	state = {
		btnStyle: 'Success',
		btnName: 'Enviar',
		form: {
			nombre: {
				itemType: 'FloatingLabel',
				holder: 'Nombre',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 40
				},
				valid: false
			},
			email: {
				itemType: 'FloatingLabel',
				holder: 'Email',
				value: '',
				validation: {
					required: true,
					email: true
				},
				valid: false
			},
			asunto: {
				itemType: 'FloatingLabel',
				holder: 'Asunto',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 20
				},
				valid: false
			},
			comentario: {
				itemType: 'Textarea',
				holder: 'Comentario',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 800
				},
				valid: false
			},
			fecha: {
				itemType: 'Fecha',
				value: '',
				valid: true
			}
		},
		loading: false,
		formIsValid: false,
		date: 'null',
		suggestions: [],
		token: null,
		isAdmin: null,
		addSuggestion: false,
		loading: false,
		showButtons: true,
		notifications: true,
		showLikeIcons: true,
		texToSearch: ''
	};

	async componentDidMount() {
		//Get the token and time of expiration
		let token = (expiresIn = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			email = await AsyncStorage.getItem('@storage_email');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('BuzonCiudadano.js: ', token);
			console.log('BuzonCiudadano.js: ', parseExpiresIn, now);
			console.log('BuzonCiudadano.js: ', this.state.tokenIsValid);
			console.log('BuzonCiudadano.js: ', email);
			if (token && parseExpiresIn > now) {
				this.setState({ token: token });
				if (email !== 'false') this.setState({ isAdmin: true });
				else this.setState({ isAdmin: false });
				this.getSuggestions();
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
					'Buzón ciudadano',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errors
		}
	}

	cleanForm = () => {
		const updatedSuggestionForm = {
			...this.state.form
		};

		for(let key in updatedSuggestionForm) {
			updatedSuggestionForm[key].value = ''
		}

		this.setState({ form: updatedSuggestionForm, formIsValid: false });
	};

	getSuggestions = () => {
		this.setState({ loading: true, addSuggestion: false, showButtons: true });
		this.cleanForm();
		console.log('StateForm:getSuggestions: ', this.state.form, this.state.formIsValid);
		axios
			.get('/suggestions.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedSuggestions = [];
				for (let key in res.data) {
					fetchedSuggestions.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, suggestions: fetchedSuggestions.reverse() });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};

	getCurrentDate() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		today = mm + '/' + dd + '/' + yyyy;
		this.setState({ date: today });
	}

	orderHandler = () => {
		this.setState({ loading: true });
		if (this.state.formIsValid) {
			const formData = {};
			for (let formElementIdentifier in this.state.form) {
				formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
			}
			const suggetion = {
				suggestionData: formData
			};

			axios
				.post('/suggestions.json?auth=' + this.state.token, suggetion)
				.then((response) => {
					this.setState({ loading: false });
					Alert.alert(
						'Buzón ciudadano',
						'¡Sugerencia enviada con exito!',
						[ { text: 'Ok', onPress: () => this.getSuggestions() } ],
						{
							cancelable: false
						}
					);
				})
				.catch((error) => {
					this.setState({ loading: false });
					Alert.alert('Buzón ciudadano', '¡Sugerencia fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Buzón ciudadano', '¡Complete correctamente el formulario!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
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

		return isValid;
	}

	inputChangedHandler = (text, inputIdentifier) => {
		this.getCurrentDate();
		const updatedSuggestionForm = {
			...this.state.form
		};
		const updatedFormElement = {
			...updatedSuggestionForm[inputIdentifier]
		};
		const updatedDateElement = {
			...updatedSuggestionForm['fecha']
		};
		updatedFormElement.value = text;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

		const fecha = this.state.date;
		updatedDateElement.value = fecha;

		updatedSuggestionForm[inputIdentifier] = updatedFormElement;

		updatedSuggestionForm['fecha'] = updatedDateElement;

		let formIsValid = true;

		for (let inputIdentifier in updatedSuggestionForm) {
			formIsValid = updatedSuggestionForm[inputIdentifier].valid && formIsValid;
		}
		this.setState({ form: updatedSuggestionForm, formIsValid: formIsValid });
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
			const filteredSuggestions = this.state.suggestions.filter((sgt) => {
				const filterSuggestion = sgt.suggestionData['asunto'];
				const filterDate = sgt.suggestionData['fecha'].split('T', 1);
				console.log('filterNew: ', filterSuggestion);
				console.log('filterDate: ', filterDate[0]);
				if (filterSuggestion.includes(text) || filterDate[0].includes(text)) {
					ban = true;
					return sgt;
				}
			});
			if (ban) {
				this.setState({ suggestions: filteredSuggestions });
			}
		} else this.getSuggestions();
	};

	render() {
		const formElementsArray = [];
		for (let key in this.state.form) {
			formElementsArray.push({
				id: key,
				config: this.state.form[key]
			});
		}
		const spinner = <CustomSpinner color="blue" />;
		console.log('suggestions: ', this.state.suggestions);
		console.log('sortSuggestion: ', this.state.suggestions.suggestionData);
		const list = this.state.suggestions.map((sgt, index) => (
			<Buzon
				key={sgt.id}
				id={sgt.id}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				refresh={this.getSuggestions}
				data={sgt.suggestionData}
				describe={this.props}
				index={index + 1}
				showLikeIcons={this.state.showLikeIcons}
			/>
		));
		const title = (
			<ScrollView style={{ flex: 1 }}>
				<CustomCardItemTitle
					title="BUZÓN CIUDADANO"
					description="Visualice y realice sugerencias de una manera sencilla."
					info="Delice hacia abajo, para las sugerencias más antiguas."
					image={require('../../assets/images/Buzon/buzon.png')}
				/>
			</ScrollView>
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
		const sugerencia = (
			<View style={{ flex: 1 }}>
				{title}
				{body}
			</View>
		);

		const addSugerencia = (
			<StyledBuzon>
				<Card>
					<CustomCardItemTitle
						title="Buzón ciudadano"
						description="Realice cualquier queja 
                                o sugerencia."
						image={require('../../assets/images/Buzon/buzon.png')}
					/>
					<CardItem bordered>
						<StyledForm>
							{formElementsArray.map((formElement) => (
								<CustomInput
									key={formElement.id}
									itemType={formElement.config.itemType}
									holder={formElement.config.holder}
									changed={(text) => this.inputChangedHandler(text, formElement.id)}
								/>
							))}
							{!this.state.loading ? (
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
									<CustomButton
										style={this.state.btnStyle}
										name={this.state.btnName}
										clicked={() => this.orderHandler()}
									/>
									<CustomButton
										style="Danger"
										name="Regresar"
										clicked={() => this.getSuggestions()}
									/>
								</View>
							) : (
								spinner
							)}
						</StyledForm>
					</CardItem>
				</Card>
			</StyledBuzon>
		);
		return (
			<StyledSafeArea>
				<StyledContainer>
					<StyledHeader>
						<HeaderToolbar 
							open={this.props} title="Sugerencias" 
							title="Sugerencias"
							color="#00a19a"
							titleOfAdd="Nueva sugerencia"
							get={this.getSuggestions}
							add={() => this.setState({ addSuggestion: true })}
							goBack={() => this.setState({ addSuggestion: false })}
							isAdd={this.state.addSuggestion}
							save={this.orderHandler}
							isAdmin={this.state.isAdmin}
							notifications={this.actOrDescNotification}
							actOrDesc={this.state.notifications}
							changeDisplay={this.changeDisplay}
							showLikeIcons={this.state.showLikeIcons}
							changed={(text) => this.searchTextHandler(text)}
							value={this.state.texToSearch}
							search={this.filterData}
						/>
					</StyledHeader>
					<StatusBar color="#FEA621" />
					<View style={{ flex: 1, margin: 10 }}>
						{this.state.addSuggestion ? addSugerencia : sugerencia}
					</View>
				</StyledContainer>
			</StyledSafeArea>
		);
	}
}

const styles = StyleSheet.create({
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
});
