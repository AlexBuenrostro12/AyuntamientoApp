import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList, Platform } from 'react-native';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import axios from '../../../axios-ayuntamiento';


export default class SwiperBanner extends Component {
	state = {
		bannerItems: [],
		heightScreen: 0,
		widthScreen: 0,
		childrenCount: 0,
		refreshing: false,
		news: [],
		useState: false,
	};

	componentWillMount() {
		this.getNewsHandler();
	}
	getNewsHandler = () => {
		let bannerItems = [];
		let childrenCount = 0;
		if (this.props.news && !this.state.useState) {
			this.props.news.map((nw, index) => {
				let currentDate = new Date(nw.newData.fecha);
				let expiryDate = new Date(currentDate);
				expiryDate.setDate(expiryDate.getDate() + 3);
				let today = new Date();
				if (expiryDate > today) {
					childrenCount = childrenCount + 1;
					bannerItems.push({
						logo: require('../../assets/images/Ayuntamiento/logo-naranja.png'),
						noticia: nw.newData.noticia,
						direccion: nw.newData.direccion,
						fecha: nw.newData.fecha,
						imagen: nw.newData.imagen
					});
				}
			});
			let { height, width } = Dimensions.get('window');
			this.setState({
				childrenCount: childrenCount,
				bannerItems: bannerItems,
				heightScreen: height,
				widthScreen: width
			});
		}

		if (this.state.news) {
			this.setState({ bannerItems: null });

			this.state.news.map((nw, index) => {
				let currentDate = new Date(nw.newData.fecha);
				let expiryDate = new Date(currentDate);
				expiryDate.setDate(expiryDate.getDate() + 3);
				let today = new Date();
				if (expiryDate > today) {
					childrenCount = childrenCount + 1;
					bannerItems.push({
						logo: require('../../assets/images/Ayuntamiento/logo-naranja.png'),
						noticia: nw.newData.noticia,
						direccion: nw.newData.direccion,
						fecha: nw.newData.fecha,
						imagen: nw.newData.imagen
					});
				}
			});
			let { height, width } = Dimensions.get('window');
			this.setState({
				childrenCount: childrenCount,
				bannerItems: bannerItems,
				heightScreen: height,
				widthScreen: width
			});
		}
	};

	_loadMoreHadler = () => {
		this.setState({ refreshing: true });
		axios
			.get('/news.json?auth=' + this.props.token)
			.then((res) => {
				const fetchedNews = [];
				for (let key in res.data) {
					fetchedNews.push({
						...res.data[key],
						id: key
					});
				}
				setTimeout(() => {
					this.setState({ refreshing: false, news: fetchedNews, useState: true });
					this.getNewsHandler();
				}, 1500);
			})
			.catch((err) => {
				console.log(err);
				setTimeout(() => {
					this.setState({ refreshing: false });
				}, 1500);
			});
	};
	_renderItem = ({ item }) => (
		<View key={item.noticia} style={styles.card}>
			<TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.open.navigation.navigate('Noticias')}>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Image resizeMode="cover" style={styles.imageBanner} source={{ uri: item.imagen }} />
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.textCard}>{item.noticia}</Text>
					<Text style={styles.textCardSub}>{item.direccion}</Text>
					<Text style={styles.textCardSub}>{item.fecha.split('T', 1).toString()}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
	_keyExtractor = (item, index) => item.noticia.toString() + index.toString();

	_loading = () =>
		this.state.refreshing && (
			<View style={styles.loader}>
				<CustomSpinner color="blue" />
			</View>
		);

	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Text style={styles.title}>GOBIERNO DE TECALITLÁN</Text>
				</View>
				<View style={styles.bottomView}>
					<FlatList
						horizontal
						ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
						data={this.state.bannerItems}
						keyExtractor={this._keyExtractor}
						renderItem={this._renderItem}
						ListFooterComponent={this._loading}
						onEndReached={this._loadMoreHadler}
						onEndReachedThreshold={0.1}
						refreshing={this.state.refreshing}
						inverted={true}
					/>
				</View>
			</View>
		);
	}
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
	view: {
		flex: 1
	},
	scrollView: {
		flex: 1,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5
	},
	text: {
		fontSize: 15,
		fontWeight: 'bold'
	},
	border: {
		flex: 1,
		overflow: 'hidden',
		alignItems: 'center',
		position: 'relative',
		margin: 10
	},
	banner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5
	},
	bannerText: {
		fontSize: 25,
		color: 'orange'
	},
	card: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		height: width * 0.8,
		width: width * 0.9,
		borderRadius: Platform.OS === 'ios' ? 15 : 3,
		margin: 5,
	},
	textCard: {
		fontSize: 17,
		fontWeight: 'normal',
		fontStyle: 'normal',
		color: 'black',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	textCardSub: {
		fontSize: 16,
		fontWeight: 'normal',
		fontStyle: 'italic',
		color: 'grey',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	title: {
		alignSelf: 'center',
		fontSize: 22,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular',
		marginTop: 30
	},
	textContainer: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: 'white',
		alignItems: 'flex-start',
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3
	},
	imageBanner: {
		height: width * 0.4,
		width: width * 0.9,
		alignSelf: 'center',
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3
	},
	bottomView: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		marginLeft: 10
	},
	loader: {
		flex: 1,
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		alignContent: 'center'
	}
});
