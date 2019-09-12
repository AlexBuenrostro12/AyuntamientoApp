import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Image,
	Text,
	BackHandler,
	Alert,
	PermissionsAndroid,
	Platform
} from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import Email from 'react-native-email';
import Pdf from 'react-native-pdf';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import RNFetchBlob from 'rn-fetch-blob';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomButton from '.././CustomButton/CustomButton';
import HeaderToolbar from '../HeaderToolbar/HeaderToolbar';

export default class DescribreData extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	state = {
		zoomImage: false,
		fullHeight: null,
		fullWidth: null,
		data: null,
		navigate: null,
		loaded: false,
		nativeGoBAck: null,
		address: 'null',
		approved: false,
		noApproved: true,
		imageToRender: null,
		urlOfImage: null,
		nameOfImage: null,
	};

	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	static navigationOptions = {
		header: null,
		drawerLabel: () => null
	};

	getFullImageSize = (imagen, name) => {
		Image.getSize(imagen, (width, height) => {
			// calculate image width and height
			const screenWidth = Dimensions.get('window').width;
			const scaleFactor = width / screenWidth;
			const imageHeight = height / scaleFactor;
			this.setState({ fullWidth: screenWidth, fullHeight: imageHeight, urlOfImage: imagen, nameOfImage: Math.trunc(name) });
		});
	};
	componentDidMount() {
		// Geocoder.init('AIzaSyCnH6V7DIofwmPbRqYN4ToY15kC-Jx7LbI'); only works fine if pay for this api
		this.getDataHandler();
		//BackHandler
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	onBackButtonPressAndroid = () => {
		if (this.state.zoomImage) this.setState({ zoomImage: false, url: '' });
		else this.setState({ loaded: false }, () => this.state.navigate && this.state.navigate(this.state.data.type));

		return true;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	getAddressHandler = (latitude, longitude) => {
		Geocoder.from({
			latitude: latitude,
			longitude: longitude
		})
			.then((json) => {
				const addressComponent = json.results[0].formatted_address;
				console.log('address: ', addressComponent);
				this.setState({ address: addressComponent });
			})
			.catch((error) => console.warn(error));
	};

	getDataHandler = () => {
		console.log('this.props.describe: ', this.props);
		const { navigate, dangerouslyGetParent } = this.props.navigation;

		const data = dangerouslyGetParent().getParam('data');
		if (data.imagen) this.getFullImageSize(data.imagen, String(Math.random() * 10000));

		this.setState(
			{ data: data, navigate: navigate, loaded: true, approved: data.approved, noApproved: !data.approved },
			() => console.log('data: ', this.state)
		);
	};
	componentWillUpdate() {
		if (!this.state.loaded) this.getDataHandler();
	}
	// Enable native button
	goBackHandler = () => {
		if (this.state.zoomImage) this.setState({ zoomImage: false, url: '' });
		else this.setState({ loaded: false }, () => this.state.navigate && this.state.navigate(this.state.data.type));
	};
	//Send email
	emailHandler = (isToAdmin, type) => {
		if (isToAdmin) {
			Email('computo.tecalitlan@gmail.com', {
				subject: 'Asunto',
				body: 'Comentario'
			}).catch(console.error);
		} else {
			const {
				actividad,
				noticia,
				asunto,
				fecha,
				hora,
				localidad,
				calle,
				numero,
				colonia,
				cp,
				referencia,
				latitude,
				longitude,
				descripcion,
				direccion,
				nombre,
				email,
				comentario,
				destino,
				placa,
				chofer,
				horaSalida,
				horaRegreso,
				telefono,
				evento,
				tipo,
				dia,
				lugar,
				ubicacion,
				lugarSalida,
				lugarRegreso,
			} = this.state.data;
			let subject = (body = null);
			switch (type) {
				case 'Actividades':
					subject = actividad;
					body = direccion + '\n' + fecha + ' / ' + hora + '\n' + descripcion;
					break;
				case 'Noticias':
					subject = noticia;
					body = direccion + '\n' + fecha + '\n' + descripcion;
					break;
				case 'Sugerencias':
					subject = asunto;
					body = nombre + '\n' + fecha + '\n' + email + '\n' + comentario;
					break;
				case 'Bus Escolar':
					subject = 'Horario';
					body =
						'Destino: ' +
						destino +
						'\n' +
						'Placa: ' +
						placa +
						'\n' +
						'Chofer: ' +
						chofer +
						'\n' +
						'Lugar de salida: ' +
						lugarSalida +
						'\n'+
						'Salida: ' +
						horaSalida +
						'\n' +
						'Lugar de regreso: ' + 
						lugarRegreso +
						'\n' +
						'Regreso: ' +
						horaRegreso;
					break;
				case 'Reporte':
					const specific =
						'' +
						localidad +
						'\n' +
						calle +
						' #' +
						numero +
						'\n' +
						colonia +
						'\n' +
						cp +
						'\n' +
						fecha +
						'\n' +
						referencia;
					const current = '' + latitude + '\n' + longitude;
					subject = asunto;
					body =
						'DESCRIPCIÓN' +
						'\n' +
						direccion +
						'\n' +
						descripcion +
						'\n' +
						'UBICACIÓN' +
						'\n' +
						(latitude ? current : specific) +
						'\n' +
						'DATOS DE QUIEN REPORTA' +
						'\n' +
						nombre +
						'\n' +
						email +
						'\n' +
						telefono;
					break;
				case 'Eventos':
					subject = 'Evento';
					body =
						evento +
						'\n' +
						tipo +
						'\n' +
						'Día: ' +
						dia +
						'\n' +
						'Fecha: ' +
						fecha +
						'\n' +
						'Hora: ' +
						hora +
						'\n' +
						'Descripción: ' +
						descripcion;
					break;
				case 'Turismo':
					subject = 'Lugar';
					body =
						lugar +
						'\n' +
						'Descripción: ' +
						descripcion +
						'\n' +
						'Ubicación (coordenadas): ' +
						'\n' +
						'Latitude: ' +
						ubicacion.latitude +
						'\n' +
						'Longitude: ' +
						ubicacion.longitude;
					break;
			}
			console.log('subject: ', subject, 'body: ', body);
			Email('tu@contacto.com', {
				subject: subject,
				body: body
			}).catch(console.error);
		}
	};

	makeNameHandler = () => {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < 8; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};

	downloadImageHandler = async (url) => {
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
					title: 'Descargar',
					message: 'Es necesario este permiso para descargar imagenes',
					buttonNeutral: 'Preguntar despues',
					buttonNegative: 'Cancelar',
					buttonPositive: 'OK'
				});
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					console.log('You can download');
	
					const { config, fs } = RNFetchBlob;
					let DownloadDir = fs.dirs.DownloadDir;
					const stringName = this.makeNameHandler();
					const nameImage = String(this.state.nameOfImage) + String(stringName) + '.png';
					console.log('nameImage: ', nameImage);
					let options = {
						fileCache: true,
						addAndroidDownloads: {
							useDownloadManager: true,
							notification: true,
							path: DownloadDir + '/' + String(nameImage),
							mime: 'image/png',
							description: 'downloading_file'
						}
					};
					
					config(options).fetch('GET', url).then((res) => {
						if (res.data) {
							console.log('res: ', res);
							Alert.alert('TecaliApp', '¡Imagen almacenada en el dispositivo!');
						} else {
							console.log('Failed');
						}
					})
					 .catch(err => {
						 Alert.alert('Error: ', err.toString());
					 });
				} else {
					console.log('You cant download');
				}
			} catch (err) {
				console.warn(err);
			}
		} else {
			const { config, fs } = RNFetchBlob;
			let DocumentDir = fs.dirs.DocumentDir;
			const stringName = this.makeNameHandler();
			const nameImage = String(this.state.nameOfImage) + String(stringName) + '.png';
			console.log('nameImage: ', nameImage);
			let options = {
				fileCache: false,
				path: DocumentDir + '/' + String(nameImage)
			};
					
			config(options).fetch('GET', url).then((res) => {
				if (res.data) {
					console.log('res: ', res);
					Alert.alert('TecaliApp', '¡Imagen almacenada en el dispositivo!');
				} else {
					console.log('Failed');
				}
			})
			.catch(err => {
				Alert.alert('Error: ', err.toString());
			});
		}
	};

	render() {
		let card = (image = null);
		let elpdf = null;
		if (this.state.data && this.state.navigate) {
			const { data, navigate, address } = this.state;
			switch (data.type) {
				case 'Noticias':
					card = (
						<View style={{ flex: 1 }}>
							<Card>
								<CardItem header>
									<View style={styles.header}>
										<View style={styles.titleContainer}>
											<Text style={styles.title}>{data.noticia}</Text>
											{data.isAdmin && (
												<View style={styles.btnsAdm}>
													<TouchableOpacity onPress={() => data.deleteItem()}>
														<Image
															style={styles.btnsAdmImg}
															source={require('../../assets/images/Delete/delete.png')}
														/>
													</TouchableOpacity>
												</View>
											)}
										</View>
										<Text style={styles.direction}>{data.direccion.toUpperCase()}</Text>
									</View>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.fecha}>Fecha: {data.fecha}</Text>
										<Text style={styles.descripcion}>{data.descripcion}</Text>
										<TouchableOpacity
											style={{ alignSelf: 'center', marginBottom: 0.5 }}
											onPress={() => this.setState({ zoomImage: true })}
										>
											<Image style={styles.image} source={{ uri: data.imagen }} />
										</TouchableOpacity>
									</Body>
								</CardItem>
								<CardItem footer />
							</Card>
						</View>
					);
					break;
				case 'Buzón Ciudadano':
					card = (
						<View>
							<Card>
								<CardItem header>
									<View style={styles.titleContainer}>
										<Text style={styles.title}>{data.asunto}</Text>
										{data.isAdmin && (
											<View style={styles.btnsAdm}>
												<TouchableOpacity onPress={() => data.deleteItem()}>
													<Image
														style={styles.btnsAdmImg}
														source={require('../../assets/images/Delete/delete.png')}
													/>
												</TouchableOpacity>
											</View>
										)}
									</View>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.descripcion}>Sugerencia por: {data.nombre}</Text>
										<Text style={styles.descripcion}>Correo: {data.email}</Text>
										<Text style={styles.descripcion}>{data.comentario}</Text>
										{data.isAdmin && <Text style={styles.headerTitle}>Aprobar sugerencia</Text>}
										{data.isAdmin && (
											<View
												style={{
													flex: 1,
													justifyContent: 'space-between',
													flexDirection: 'row'
												}}
											>
												<View
													style={{
														flex: 1,
														flexDirection: 'row',
														justifyContent: 'space-evenly'
													}}
												>
													<Text>Aprobado</Text>
													<TouchableOpacity
														onPress={() => {
															this.setState({ approved: true, noApproved: false });
															data.approvedItem(true);
														}}
													>
														<View
															style={
																this.state.approved ? (
																	styles.approved
																) : (
																	styles.noApproved
																)
															}
														/>
													</TouchableOpacity>
												</View>
												<View
													style={{
														flex: 1,
														flexDirection: 'row',
														justifyContent: 'space-evenly'
													}}
												>
													<Text>No aprobado</Text>
													<TouchableOpacity
														onPress={() => {
															this.setState({ noApproved: true, approved: false });
															data.approvedItem(false);
														}}
													>
														<View
															style={
																this.state.noApproved ? (
																	styles.approved
																) : (
																	styles.noApproved
																)
															}
														/>
													</TouchableOpacity>
												</View>
											</View>
										)}
									</Body>
								</CardItem>
								<CardItem footer>
									<Text style={styles.fecha}>Fecha: {data.fecha}</Text>
								</CardItem>
							</Card>
						</View>
					);
					break;
				case 'Bus Escolar':
					card = (
						<View style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
							<Card key={data.chofer + data.horaSalida + data.destino}>
								<CardItem header>
									<View style={styles.titleContainer}>
										<Text style={styles.title}>{data.destino}</Text>
										{data.isAdmin && (
											<View style={styles.btnsAdm}>
												<TouchableOpacity onPress={() => data.deleteItem()}>
													<Image
														style={styles.btnsAdmImg}
														source={require('../../assets/images/Delete/delete.png')}
													/>
												</TouchableOpacity>
											</View>
										)}
									</View>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.descripcion}>Placa del camión: {data.placa}</Text>
										<Text style={styles.descripcion}>Chofer: {data.chofer}</Text>
										<Text style={styles.descripcion}>Lugar de salida: {data.lugarSalida}</Text>
										<Text style={styles.descripcion}>Salida: {data.horaSalida}</Text>
										<Text style={styles.descripcion}>Lugar de regreso: {data.lugarRegreso}</Text>
										<Text style={styles.descripcion}>Regreso: {data.horaRegreso}</Text>
									</Body>
								</CardItem>
								<CardItem footer>
									<Text style={styles.fecha}>Horarios.</Text>
								</CardItem>
							</Card>
						</View>
					);
					break;
				case 'Reporte ciudadano':
					const initialRegion = {
						latitude: data.latitude,
						longitude: data.longitude,
						latitudeDelta: 0.0122,
						longitudeDelta: width / height * 0.0122
					};
					card = (
						<View key={data.itemKey}>
							<Card>
								<CardItem header>
									<View style={styles.titleContainer}>
										<Text style={styles.title}>{data.asunto}</Text>
										{data.isAdmin && (
											<View style={styles.btnsAdm}>
												<TouchableOpacity onPress={() => data.deleteItem(data.itemKey)}>
													<Image
														style={styles.btnsAdmImg}
														source={require('../../assets/images/Delete/delete.png')}
													/>
												</TouchableOpacity>
											</View>
										)}
									</View>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.headerTitle}>Descripción</Text>
										<Text style={styles.descripcion}>{data.direccion.toUpperCase()}</Text>
										<Text style={styles.descripcion}>{data.descripcion}</Text>
										<TouchableOpacity
											style={{ alignSelf: 'center' }}
											onPress={() => this.setState({ zoomImage: true })}
										>
											<Image style={styles.image} source={{ uri: data.imagen }} />
										</TouchableOpacity>
										<Text style={styles.headerTitle}>Ubicación</Text>
										{!data.latitude ? (
											<View style={{ flex: 1 }}>
												<Text style={styles.descripcion}>{data.localidad}</Text>
												<Text style={styles.descripcion}>
													{data.calle} #{data.numero}
												</Text>
												<Text style={styles.descripcion}>{data.colonia}</Text>
												<Text style={styles.descripcion}>{data.cp}</Text>
												<Text style={styles.descripcion}>{data.fecha}</Text>
												<Text style={styles.descripcion}>{data.referencia}</Text>
											</View>
										) : (
											<View
												style={{
													flex: 1,
													flexDirection: 'column',
													justifyContent: 'space-between',
													width: '100%'
												}}
											>
												<MapView style={styles.map} initialRegion={initialRegion}>
													<Marker
														pinColor="red"
														coordinate={{
															latitude: data.latitude,
															longitude: data.longitude
														}}
													/>
												</MapView>
												{/* <Text style={styles.descripcion}>{this.state.address}</Text> */}
												<Text style={styles.descripcion}>{data.fecha}</Text>
											</View>
										)}
										<Text style={styles.headerTitle}>Datos de quien reporta</Text>
										<Text style={styles.descripcion}>{data.nombre}</Text>
										<Text style={styles.descripcion}>{data.email}</Text>
										<Text style={styles.descripcion}>{data.telefono}</Text>
										{data.isAdmin && <Text style={styles.headerTitle}>Aprobar reporte</Text>}
										{data.isAdmin && (
											<View
												style={{
													flex: 1,
													justifyContent: 'space-between',
													flexDirection: 'row'
												}}
											>
												<View
													style={{
														flex: 1,
														flexDirection: 'row',
														justifyContent: 'space-evenly'
													}}
												>
													<Text>Aprobado</Text>
													<TouchableOpacity
														onPress={() => {
															this.setState({ approved: true, noApproved: false });
															data.approvedItem(data.itemKey, true);
														}}
													>
														<View
															style={
																this.state.approved ? (
																	styles.approved
																) : (
																	styles.noApproved
																)
															}
														/>
													</TouchableOpacity>
												</View>
												<View
													style={{
														flex: 1,
														flexDirection: 'row',
														justifyContent: 'space-evenly'
													}}
												>
													<Text>No aprobado</Text>
													<TouchableOpacity
														onPress={() => {
															this.setState({ noApproved: true, approved: false });
															data.approvedItem(data.itemKey, false);
														}}
													>
														<View
															style={
																this.state.noApproved ? (
																	styles.approved
																) : (
																	styles.noApproved
																)
															}
														/>
													</TouchableOpacity>
												</View>
											</View>
										)}
									</Body>
								</CardItem>
								<CardItem footer>
									<Text style={styles.fecha}>Reporte ciudadano</Text>
								</CardItem>
							</Card>
						</View>
					);
					break;
				case 'Actividades':
					card = (
						<View>
							<Card>
								<CardItem header>
									<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
										<View style={styles.titleContainer}>
											<Text style={styles.title}>{data.actividad}</Text>
											{data.isAdmin && (
												<View style={styles.btnsAdm}>
													<TouchableOpacity onPress={() => data.deleteItem()}>
														<Image
															style={styles.btnsAdmImg}
															source={require('../../assets/images/Delete/delete.png')}
														/>
													</TouchableOpacity>
												</View>
											)}
										</View>
										<Text style={styles.direction}>{data.direccion.toUpperCase()}</Text>
									</View>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.fecha}>
											Fecha: {data.fecha} / Hora: {data.hora}
										</Text>
										<Text style={styles.descripcion}>{data.descripcion}</Text>
										<TouchableOpacity
											style={{ alignSelf: 'center' }}
											onPress={() => this.setState({ zoomImage: true })}
										>
											<Image style={styles.image} source={{ uri: data.imagen }} />
										</TouchableOpacity>
									</Body>
								</CardItem>
								<View style={styles.button}>
									<CustomButton
										style="SaveActivity"
										date={data.fecha}
										clicked={() => data.saveEvent()}
									/>
								</View>
							</Card>
						</View>
					);
					break;
				case 'Eventos':
					card = (
						<View>
							<Card>
								<CardItem header>
									<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
										<View style={styles.titleContainer}>
											<Text style={styles.title}>{data.evento}</Text>
											{data.isAdmin && (
												<View style={styles.btnsAdm}>
													<TouchableOpacity onPress={() => data.deleteItem()}>
														<Image
															style={styles.btnsAdmImg}
															source={require('../../assets/images/Delete/delete.png')}
														/>
													</TouchableOpacity>
												</View>
											)}
										</View>
										<Text style={styles.direction}>{data.tipo.toUpperCase()}</Text>
										<Text style={styles.direction}>DÍA {data.dia}</Text>
									</View>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.fecha}>
											Fecha: {data.fecha} / Hora: {data.hora}
										</Text>
										<Text style={styles.descripcion}>{data.descripcion}</Text>
										<TouchableOpacity
											style={{ alignSelf: 'center' }}
											onPress={() => this.setState({ zoomImage: true })}
										>
											<Image style={styles.image} source={{ uri: data.imagen }} />
										</TouchableOpacity>
									</Body>
								</CardItem>
								<View style={styles.button}>
									<CustomButton
										style="SaveActivity"
										date={data.fecha}
										clicked={() => data.saveEvent()}
									/>
								</View>
							</Card>
						</View>
					);
					break;
				case 'Transparencia':
					const source = { uri: data.url };
					console.log('source: ', source);
					elpdf = (
						<View
							style={{
								flex: 1,
								justifyContent: 'flex-start',
								alignItems: 'center',
								overflow: 'hidden',
								flexGrow: 2
							}}
						>
							<Pdf
								source={source}
								onLoadComplete={(numberOfPages, filePath) => {
									console.log(`number of pages: ${numberOfPages}`);
								}}
								onPageChanged={(page, numberOfPages) => {
									console.log(`current page: ${page}`);
								}}
								onError={(error) => {
									console.log(error);
								}}
								style={{
									flex: 1,
									width: width
								}}
							/>
						</View>
					);
					break;

				case 'Turismo':
					const urls = [];
					for (let key in data.imagenes) {
						urls.push({ url: data.imagenes[key] });
					}
					const regionInicial = {
						latitude: data.ubicacion.latitude,
						longitude: data.ubicacion.longitude,
						latitudeDelta: 0.0122,
						longitudeDelta: width / height * 0.0122
					};
					card = (
						<View>
							<Card>
								<CardItem header>
									<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
										<View style={styles.titleContainer}>
											<Text style={styles.title}>{data.lugar}</Text>
											{data.isAdmin && (
												<View style={styles.btnsAdm}>
													<TouchableOpacity onPress={() => data.deleteItem()}>
														<Image
															style={styles.btnsAdmImg}
															source={require('../../assets/images/Delete/delete.png')}
														/>
													</TouchableOpacity>
												</View>
											)}
										</View>
									</View>
								</CardItem>
								<CardItem>
									<Body style={{ justifyContent: 'space-around' }}>
										<Text style={[ styles.descripcion, { marginBottom: 5, marginTop: 5 } ]}>
											{data.descripcion}
										</Text>
										{urls.map((url, index) => (
											<TouchableOpacity
												key={index}
												style={{ alignSelf: 'center' }}
												onPress={() => {
													this.getFullImageSize(url.url, String(Math.random() * 10000));
													this.setState({ zoomImage: true });
												}}
											>
												<Image style={styles.image} source={{ uri: url.url }} />
											</TouchableOpacity>
										))}
										{/* <ScrollView
											horizontal={true}
											style={{ flex: 1, alignSelf: 'center', marginBottom: 10 }}
											contentContainerStyle={{ justifyContent: 'center' }}
										>
										</ScrollView> */}
										<Text style={[ styles.descripcion, { marginBottom: 5, marginTop: 5 } ]}>
											Ubicación
										</Text>
										<MapView
											style={styles.map}
											initialRegion={regionInicial}
											region={regionInicial}
										>
											<Marker
												pinColor="red"
												coordinate={{
													latitude: data.ubicacion.latitude,
													longitude: data.ubicacion.longitude
												}}
											/>
										</MapView>
									</Body>
								</CardItem>
							</Card>
						</View>
					);
					break;

				default:
					card = null;
					break;
			}

			image = (
				<View style={{ flex: 1, paddingTop: height * 0.08, justifyContent: 'center' }}>
					<TouchableOpacity
						style={{ flex: 1, alignSelf: 'center' }}
						onPress={() => this.setState({ zoomImage: false })}
						onLongPress={() =>
							Alert.alert(
								'Descargar',
								'¿Desea descargar esta imagen?',
								[
									{ text: 'Si', onPress: () => this.downloadImageHandler(this.state.urlOfImage) },
									{ text: 'No' }
								],
								{
									cancelable: false
								}
							)}
					>
						<Image
							style={{
								flex: 1,
								width: this.state.fullWidth,
								height: this.state.fullHeight,
								resizeMode: 'contain',
								alignSelf: 'center'
							}}
							source={{ uri: this.state.urlOfImage, scale: 1 }}
						/>
					</TouchableOpacity>
				</View>
			);
		}
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
				<View style={[ styles.container, { backgroundColor: !this.state.zoomImage ? 'white' : 'black' } ]}>
					<View>
						<HeaderToolbar
							title={this.state.data ? this.state.data.barProps.title : 'Describe Data Screen'}
							color={this.state.data ? this.state.data.barProps.bar : 'black'}
							showContentRight={true}
							sendEmail={card && this.emailHandler}
							describeGoBack={() => this.goBackHandler()}
							deleteManual={this.state.data && this.state.data.deleteItemManual}
							isAdmin={this.state.data && this.state.data.isAdmin}
							// here i go
						/>
					</View>
					<StatusBar color={this.state.data && this.state.data.barProps.status} />
					{!this.state.zoomImage && (
						<View style={{ flex: 1, margin: 5 }}>
							{card ? <ScrollView>{card}</ScrollView> : <View style={{ flex: 1 }}>{elpdf}</View>}
						</View>
					)}

					{this.state.zoomImage && <ScrollView style={{ flex: 1, margin: 2 }}>{image && image}</ScrollView>}
				</View>
			</SafeAreaView>
		);
	}
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		overflow: 'scroll'
	},
	view: {
		flex: 1
	},
	body: {
		flex: 1,
		flexDirection: 'column',
		height: height,
		width: width
	},
	btnsAdm: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	titleContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	btnsAdmImg: {
		height: 30,
		width: 30,
		resizeMode: 'contain',
		marginLeft: 2
	},
	image: {
		resizeMode: 'contain',
		height: height / 1.5,
		width: width / 0.95,
		alignSelf: 'center',
		margin: 2
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		color: 'black',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	direction: {
		fontSize: 17,
		fontStyle: 'italic',
		color: 'black',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	descripcion: {
		fontSize: 15,
		fontWeight: 'normal',
		color: 'black',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	fecha: {
		fontSize: 17,
		fontWeight: 'normal',
		fontStyle: 'italic',
		color: 'black',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	headerTitle: {
		marginBottom: 5,
		marginRight: 5,
		fontSize: 17,
		fontWeight: 'normal',
		fontStyle: 'normal',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular',
		backgroundColor: '#676766'
	},
	header: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	button: {
		flex: 1,
		flexGrow: 1,
		marginTop: 5,
		marginBottom: 5
	},
	map: {
		width: '100%',
		height: 250,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	},
	approved: {
		width: 25,
		height: 25,
		backgroundColor: '#008EFE',
		borderWidth: 2,
		borderColor: '#008EFE',
		borderRadius: 20
	},
	noApproved: {
		width: 25,
		height: 25,
		backgroundColor: '#FFFFFF',
		borderWidth: 2,
		borderColor: '#008EFE',
		borderRadius: 20
	}
});
