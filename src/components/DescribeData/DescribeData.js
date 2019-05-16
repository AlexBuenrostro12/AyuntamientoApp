import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomButton from '.././CustomButton/CustomButton';

export default class DescribreData extends Component {
	state = {
		zoomImage: false,
		fullHeight: null,
		fullWidth: null
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

	render() {
		console.log('DrecibeData.js: ', this.props);
		const { getParam, navigate } = this.props.navigation;
		const data = getParam('data', null);
		console.log('DrecibeData.js: ', data);
		if (data.imagen) this.getFullImageSize(data.imagen);
		let card = null;
		switch (data.type) {
			case 'noticia':
				card = (
					<View style={{ flex: 1 }}>
						<Card>
							<CardItem header>
								<View style={styles.header}>
									<View style={styles.titleContainer}>
										<Text style={styles.title}>{data.noticia}</Text>
										{data.isAdmin && (
											<View style={styles.btnsAdm}>
												<TouchableOpacity
													onPress={() => {
														data.deleteItem();
													}}
												>
													<Image
														style={styles.btnsAdmImg}
														source={require('../../assets/images/Delete/delete.png')}
													/>
												</TouchableOpacity>
											</View>
										)}
									</View>
									<Text style={styles.direction}>{data.direccion}</Text>
								</View>
							</CardItem>
							<CardItem>
								<Body>
									<TouchableOpacity
										style={{ alignSelf: 'center', }}
										onPress={() => this.setState({ zoomImage: true })}
									>
										<Image style={styles.image} source={{ uri: data.imagen }} />
									</TouchableOpacity>
									<Text style={styles.descripcion}>{data.descripcion}</Text>
								</Body>
							</CardItem>
							<CardItem footer>
								<Text style={styles.fecha}>Fecha: {data.fecha}</Text>
							</CardItem>
							<View style={{ flex: 1, flexGrow: 1, marginTop: 5, marginBottom: 5 }}>
								<CustomButton
									style="DangerBorder"
									name="Cerrar"
									clicked={() => navigate('Noticias')}
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

		const image = (
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
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.view}>
					<StatusBar color="#FEA621" />
					{!this.state.zoomImage && <ScrollView style={styles.body}>{card}</ScrollView>}
					{this.state.zoomImage && <ScrollView style={{ flex: 1, margin: 2 }}>{image && image}</ScrollView>}
				</View>
			</SafeAreaView>
		);
	}
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1
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
		margin: 2,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		color: 'black'
	},
	direction: {
		fontSize: 16,
		fontWeight: 'normal',
		color: 'black'
	},
	descripcion: {
		fontSize: 16,
		fontWeight: 'normal',
		color: 'black'
	},
	fecha: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'black'
	},
	header: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	}
});
