import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, BackHandler, Image, Text, ScrollView } from 'react-native';
import { Card, CardItem } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axiosCloudinary from 'axios';
import MapView, { Marker, Callout } from 'react-native-maps';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomAddBanner from '../../components/CustomAddBanner/CustomAddBanner';
import CustomInput from '../../components/CustomInput/CustomInput';
import {
	food,
	medicServices,
	pharmacys,
	hotels,
	sports,
	schools,
	servicios,
	entretenimiento,
	iglesias
} from '../../components/AuxiliarFunctions/MarkersArray';

export default class Map extends Component {
	state = {
		token: null,
		isAdmin: false,
		addMarker: false,
		loading: false,
		formAddress: {
			name: {
				itemType: 'FloatingLabel',
				holder: 'Nombre',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
			},
			address: {
				itemType: 'FloatingLabel',
				holder: 'Domicilio',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
			},
			schedule: {
				itemType: 'FloatingLabel',
				holder: 'Horario',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
			},
			phone: {
				itemType: 'FloatingLabel',
				holder: 'Telefono',
				value: '',
				validation: {
					minLength: 1,
					maxLength: 55
				},
				valid: false
			}
		},
		formIsValid: false,
		picker: 'Datos especificos',
		specificData: true,
		options: {
			title: 'Elige una opción',
			takePhotoButtonTitle: 'Abrir camara.',
			chooseFromLibraryButtonTitle: 'Abrir galeria.',
			maxWidth: 800,
			maxHeight: 800
		},
		imageFormData: null,
		image: null,
		fileNameImage: null,
		focusedLocation: {
			latitude: 19.47151,
			longitude: -103.30706,
			latitudeDelta: 0.0122,
			longitudeDelta: width / height * 0.0122,
		},
		chosenLocation: false
	};

	//Style of drawer navigation
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/maps.png')}
				style={styles.drawerIcon}
				resizeMode="contain"
			/>
		)
	};
	async componentDidMount() {
		//BackHandler
		BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
		//GetToken
		let token = (expiresIn = email = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			email = await AsyncStorage.getItem('@storage_email');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('Map.js: ', token);
			console.log('Map.js: ', parseExpiresIn, now);
			console.log('Map.js: ', email);
			console.log('Map.js: ', this.props);
			if (token && parseExpiresIn > now) {
				// charge actividades
				this.setState({ token: token });
				if (email !== 'false') this.setState({ isAdmin: true });
				else this.setState({ isAdmin: false });

				// this.getActivities();
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
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
	}
	// Enable native button
	goBackHandler = () => {
		console.log('this.props: ', this.props);
		const { closeDrawer } = this.props.navigation;
		closeDrawer();
		return true;
	};

	inputChangeHandler = (text, inputIdentifier) => {
		const updatedForm = {
			...this.state.formAddress
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

		this.setState({ formAddress: updatedForm, formIsValid: formIsValid });
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

	changePickerHandler = (text) => {
		this.setState({ picker: text });
		if (text === 'Datos especificos') this.setState({ specificData: true });
		else this.setState({ specificData: false });
	};

	loadPhotoHandler = (show) => {
		console.log('show: ', show);
		if (show === 'library') {
			ImagePicker.launchImageLibrary(this.state.options, (response) => {
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
		} else {
			ImagePicker.launchCamera(this.state.options, (response) => {
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
		}
	};

	pickLocationHandler = (event) => {
		const coordinates = event.nativeEvent.coordinate;
		this.setState(prevState => {
			return {
				focusedLocation: {
					...prevState.focusedLocation,
					latitude: coordinates.latitude,
					longitude: coordinates.longitude,
				},
				chosenLocation: true,
			};
		});
	};

	render() {
		const spinner = <CustomSpinner color="blue" />;

		let chosenMarker = null;
		if (this.state.chosenLocation)
			chosenMarker = <Marker coordinate={this.state.focusedLocation} />;

		const initialRegion = {
			latitude: 19.47151,
			longitude: -103.30706,
			latitudeDelta: 0.0122,
			longitudeDelta: width / height * 0.0122
		};

		const formElements = [];
		for (let key in this.state.formAddress) {
			formElements.push({
				id: key,
				config: this.state.formAddress[key]
			});
		}

		const selectMarkerMap = (
			<MapView 
				style={styles.mapMarkerPicker}
				initialRegion={initialRegion}
				region={this.state.focusedLocation}
				onPress={(event) => this.pickLocationHandler(event)}
			>
				{chosenMarker}
			</MapView>
		);

		const map = (
			<MapView style={styles.map} initialRegion={initialRegion}>
				{/* Food */}
				{food.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderTourism}>
							<Image style={styles.marker} source={require('../../assets/images/Map/food.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Medic Services */}
				{medicServices.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderMedicalServices}>
							<Image style={styles.marker} source={require('../../assets/images/Map/hospital.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Pharmacys */}
				{pharmacys.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderMedicalServices}>
							<Image style={styles.marker} source={require('../../assets/images/Map/pharmacy.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* hotels */}
				{hotels.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderTourism}>
							<Image style={styles.marker} source={require('../../assets/images/Map/hotel.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Sports */}
				{sports.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderTourism}>
							<Image style={styles.marker} source={require('../../assets/images/Map/sport.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Schools */}
				{schools.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderSchool}>
							<Image style={styles.marker} source={require('../../assets/images/Map/school.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Servicios publicos */}
				{servicios.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderPublicServices}>
							<Image
								style={styles.marker}
								source={rst.logo ? rst.logo : require('../../assets/images/Map/public-service.png')}
							/>
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Entretenimiento recreativo */}
				{entretenimiento.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderTourism}>
							<Image
								style={styles.marker}
								source={rst.logo ? rst.logo : require('../../assets/images/Map/entertaiment.png')}
							/>
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
				{/* Iglesias */}
				{iglesias.map((rst, index) => (
					<Marker key={index + rst.latLong} coordinate={rst.latLong} title={rst.name}>
						<View style={styles.borderChurchs}>
							<Image style={styles.marker} source={require('../../assets/images/Map/church.png')} />
						</View>
						<Callout>
							<View style={{ flex: 1, width: 250 }}>
								{rst.name && <Text>{rst.name}</Text>}
								{rst.address && <Text>{rst.address}</Text>}
								{rst.schedule && <Text>{rst.schedule}</Text>}
								{rst.phone && <Text>Telefono: {rst.phone}</Text>}
							</View>
						</Callout>
					</Marker>
				))}
			</MapView>
		);

		const addMarkerTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner
					title="NUEVO MARCADOR"
					image={require('../../assets/images/Preferences/add-orange.png')}
				/>
			</View>
		);
		const addMarkerBody = (
			<Card style={styles.addMarker}>
				<ScrollView style={{ flex: 1 }}>
					<CardItem bordered>
						<View style={styles.cardBody}>
							<CustomInput
								key="select"
								itemType="PickAddress"
								value={this.state.picker}
								changed={(text) => this.changePickerHandler(text)}
							/>
							{this.state.specificData ? (
								formElements.map((e) => (
									<CustomInput
										key={e.id}
										itemType={e.config.itemType}
										holder={e.config.holder}
										value={e.config.value}
										changed={(text) => this.inputChangeHandler(text, e.id)}
									/>
								))
							) : (
								<CustomInput
									key={'ImagePicker'}
									itemType="LoadImage"
									loadPhoto={this.loadPhotoHandler}
									image={this.state.image}
									name={this.state.fileNameImage}
								/>
							)}
							{selectMarkerMap}
						</View>
					</CardItem>
				</ScrollView>
			</Card>
		);
		const addMarker = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addMarkerTitle}
				{this.state.loading && spinner}
				{addMarkerBody}
			</View>
		);

		return (
			<SafeAreaView style={styles.container}>
				<View>
					<HeaderToolbar
						open={this.props}
						title="Mapa"
						color="#e2487d"
						showContentRight={true}
						titleOfAdd="Nuevo marcador"
						get={true}
						add={() => this.setState({ addMarker: true })}
						goBack={() => this.setState({ addMarker: false })}
						isAdd={this.state.addMarker}
						save={true}
						isAdmin={true}
					/>
				</View>
				<StatusBar color="#c7175b" />
				<View style={styles.mapContainer}>{!this.state.addMarker ? map : addMarker}</View>
			</SafeAreaView>
		);
	}
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
	mapContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	map: {
		width: '100%',
		height: height * 0.88,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	},
	drawerIcon: {
		height: width * 0.07,
		width: width * 0.07
	},
	container: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'column',
		overflow: 'scroll'
	},
	marker: {
		height: width * 0.08,
		width: width * 0.08
	},
	borderFood: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 1,
		borderWidth: 2,
		borderColor: '#e2487d',
		backgroundColor: 'white',
		borderRadius: 1.5
	},
	borderSchool: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 1,
		borderWidth: 2,
		borderColor: '#00A3E4',
		backgroundColor: 'white',
		borderRadius: 1.5
	},
	borderPublicServices: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 1,
		borderWidth: 2,
		borderColor: '#A4AE39',
		backgroundColor: 'white',
		borderRadius: 1.5
	},
	borderTourism: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 1,
		borderWidth: 2,
		borderColor: '#E2487D',
		backgroundColor: 'white',
		borderRadius: 1.5
	},
	borderChurchs: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 1,
		borderWidth: 2,
		borderColor: '#EF7819',
		backgroundColor: 'white',
		borderRadius: 1.5
	},
	borderMedicalServices: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 1,
		borderWidth: 2,
		borderColor: '#00A19A',
		backgroundColor: 'white',
		borderRadius: 1.5
	},
	addMarker: {
		flex: 2,
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	cardBody: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	mapMarkerPicker: {
		width: '100%',
		height: 250,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	}
});
