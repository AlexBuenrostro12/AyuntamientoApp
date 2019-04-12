import React, { Component } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import SwiperBanner from '../../components/SwiperBanner/SwiperBanner';

export default class Home extends Component {
	state = {
		news: null,
		loading: true
	};

    //Obtiene el token y tiempo de expiracion almacenado globalmente en la app
    async componentDidMount() {
        let token = expiresIn = null;
        try {
			console.log('Entro al try');
            token = await AsyncStorage.getItem('@storage_token');
            expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
            //Use the expires in
		} catch (e) {
			//Catch posible errors
        }

		if (token) {
            console.log('Home.js: ', token, expiresIn);
			axios
				.get('/news.json?auth=' + token)
				.then((res) => {
					const fetchedNews = [];
					for (let key in res.data) {
						fetchedNews.push({
							...res.data[key],
							id: key
						});
					}
					this.setState({ loading: false, news: fetchedNews });
				})
				.catch((err) => {
					console.log(err);
					this.setState({ loading: true });
				});
		} else {
            //Restrict screens if there's no token
        }
	}

	render() {
		const spinner = <CustomSpinner color="blue" />;

		let swiperBanner = <SwiperBanner news={this.state.news} open={this.props} />;

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.view}>
					<View>
						<HeaderToolbar open={this.props} title="Home" />
					</View>
					<StatusBar color="#ff9933" />
					<View style={{ flex: 1 }}>
						<ScrollView>{this.state.loading ? spinner : swiperBanner}</ScrollView>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	text: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 25
	},
	view: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'column',
		overflow: 'scroll'
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold'
	}
});
