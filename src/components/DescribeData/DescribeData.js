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
	BackHandler
} from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomButton from '.././CustomButton/CustomButton';
import HeaderToolbar from '../HeaderToolbar/HeaderToolbar';

export default class DescribreData extends Component {
	_isMounted = false;
	state = {
		zoomImage: false,
		fullHeight: null,
		fullWidth: null,
		data: null,
		navigate: null,
		loaded: false,
		nativeGoBAck: null
	};
	static navigationOptions = {
		header: null,
		drawerLabel: () => null
	};

	getFullImageSize = (imagen) => {
		Image.getSize(imagen, (width, height) => {
			// calculate image width and height
			const screenWidth = Dimensions.get('window').width;
			const scaleFactor = width / screenWidth;
			const imageHeight = height / scaleFactor;
			this.setState({ fullWidth: screenWidth, fullHeight: imageHeight });
		});
	};
	componentDidMount() {
		this.getDataHandler();
		BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
	}
	getDataHandler = () => {
		const { getParam, navigate } = this.props.navigation;
		const data = getParam('data', null);
		if (data.imagen) this.getFullImageSize(data.imagen);
		this.setState({ data: data, navigate: navigate, loaded: true }, () => console.log('data: ', this.state));
	};
	componentWillUpdate() {
		if (!this.state.loaded) this.getDataHandler();
	}
	// Disable the native button of return
	goBackHandler = () => true;

	render() {
		let card = (image = null);
		if (this.state.data && this.state.navigate) {
			const { data, navigate } = this.state;
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
				case 'buzon':
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
									</Body>
								</CardItem>
								<CardItem footer>
									<Text style={styles.fecha}>Fecha: {data.fecha}</Text>
								</CardItem>
								<View style={styles.button}>
									<CustomButton
										style="DangerBorder"
										name="Cerrar"
										clicked={() => navigate('Buzón Ciudadano')}
									/>
								</View>
							</Card>
						</View>
					);
					break;
				case 'bus':
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
										<Text style={styles.descripcion}>Salida: {data.horaSalida}</Text>
										<Text style={styles.descripcion}>Regreso: {data.horaRegreso}</Text>
									</Body>
								</CardItem>
								<CardItem footer>
									<Text style={styles.fecha}>Horarios.</Text>
								</CardItem>
								<View style={{ flex: 1, flexGrow: 1, marginTop: 5, marginBottom: 5 }}>
									<CustomButton
										style="DangerBorder"
										name="Cerrar"
										clicked={() => navigate('Bus Escolar')}
									/>
								</View>
							</Card>
						</View>
					);
					break;
				case 'incidencia':
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
										<Text style={styles.fecha}>Descripción</Text>
										<Text style={styles.descripcion}>
											{JSON.stringify(data.tipo).toUpperCase()}
										</Text>
										<Text style={styles.descripcion}>{data.descripcion}</Text>
										<TouchableOpacity
											style={{ alignSelf: 'center' }}
											onPress={() => this.setState({ zoomImage: true })}
										>
											<Image style={styles.image} source={{ uri: data.imagen }} />
										</TouchableOpacity>
										<Text style={styles.fecha}>Ubicación</Text>
										<Text style={styles.descripcion}>{data.direccion}</Text>
										<Text style={styles.descripcion}>{data.municipio}</Text>
										<Text style={styles.descripcion}>{data.fecha}</Text>
										<Text style={styles.fecha}>Datos de quien reporta</Text>
										<Text style={styles.descripcion}>{data.nombre}</Text>
										<Text style={styles.descripcion}>{data.email}</Text>
										<Text style={styles.descripcion}>{data.telefono}</Text>
									</Body>
								</CardItem>
								<CardItem footer>
									<Text style={styles.fecha}>Reporte de incidencia</Text>
								</CardItem>
								<View style={styles.button}>
									<CustomButton
										style="DangerBorder"
										name="Cerrar"
										clicked={() => navigate('Incidencias')}
									/>
								</View>
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
				default:
					card = null;
					break;
			}

			image = (
				<View style={{ flex: 1, paddingTop: height * 0.08 }}>
					<TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ zoomImage: false })}>
						<Image
							style={{
								flex: 1,
								width: this.state.fullWidth,
								height: this.state.fullHeight,
								resizeMode: 'contain',
								alignSelf: 'center'
							}}
							source={{ uri: data.imagen, scale: 1 }}
						/>
					</TouchableOpacity>
				</View>
			);
		}
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar
							open={this.props}
							title={this.state.data && this.state.data.barProps.title}
							color={this.state.data && this.state.data.barProps.bar}
							describeGoBack={() =>
								this.setState(
									{ loaded: false },
									() => this.state.navigate && this.state.navigate(this.state.data.type)
								)}
							// here i go
						/>
					</View>
					<StatusBar color={this.state.data && this.state.data.barProps.status} />
					{!this.state.zoomImage && (
						<View style={{ flex: 1, margin: 5 }}>
							<ScrollView>{card}</ScrollView>
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
	}
});
