import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { Card, CardItem, Thumbnail, Left, Body } from 'native-base';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';

const SCROLLVIEW_REF = 'scrollview';

export default class SwiperBanner extends Component {
	state = {
		bannerItems: [],
		heightScreen: 0,
		widthScreen: 0,
		startAutoPlay: true,
		timerID: null,
		currentIndex: 0,
		childrenCount: 0,
		width: 0,
		preScrollX: null,
		scrollInterval: 2500
	};

	// componentDidMount() {
	// 	if (this.state.startAutoPlay) this.startAutoPlayHandler();
	// 	else this.stopAutoPlayHandler();
	// }

	// onScrollHandler = (e) => {
	// 	let { x } = e.nativeEvent.contentOffset,
	// 		offset,
	// 		position = Math.floor(x / this.state.width);
	// 	if (x === this.state.preScrollX) return;
	// 	this.setState({ preScrollX: x });
	// 	offset = x / this.state.width - position;

	// 	if (offset === 0) {
	// 		let timerid = setInterval(this.goToNextPageHandler, this.state.scrollInterval);
	// 		this.setState({ currentIndex: position, timerID: timerid });
	// 	}
	// };
	// onScrollViewLayoutHandler = (e) => {
	// 	let { width } = e.nativeEvent.layout;
	// 	this.setState({ width: width });
	// };
	// goToNextPageHandler = () => {
	// 	this.stopAutoPlayHandler();
	// 	let nextIndex = (this.state.currentIndex + 1) % this.state.childrenCount;
	// 	this.refs[SCROLLVIEW_REF].scrollTo({ x: this.state.width * nextIndex });
	// };
	// startAutoPlayHandler = () => {
	// 	let timerid = setInterval(this.goToNextPageHandler, this.state.scrollInterval);
	// 	this.setState({ timerID: timerid });
	// };
	// stopAutoPlayHandler = () => {
	// 	if (this.state.timerID) {
	// 		clearInterval(this.state.timerID);
	// 		this.setState({ timerID: null });
	// 	}
	// };

	componentWillMount() {
		this.getNewsHandler();
	}
	getNewsHandler = () => {
		let bannerItems = [];
		let childrenCount = 0;
		if (this.props.news) {
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
	};

	_renderItem = ({ item }) => (
		<View key={item.noticia} style={styles.card}>
			{console.log('item: ', item)}
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
	_keyExtractor = (item, index) => item.noticia;

	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
				<Text style={styles.title}>GOBIERNO DE TECALITLÁN</Text>
				<FlatList
					horizontal
					ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
					data={this.state.bannerItems}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem}
				/>
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
		justifyContent: 'center',
		height: width * 0.8,
		width: width * 0.9,
		borderRadius: 3,
		margin: 5
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
		marginBottom: 45,
		marginTop: 45
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
	}
});
