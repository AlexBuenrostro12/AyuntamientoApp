import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Image } from 'react-native';
import { Card, CardItem } from 'native-base';
import styled, { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Noticia from '../../components/Noticia/Noticia';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';

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
		tokenIsValid: true
	};

	async componentDidMount() {
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
						this.setState({ loading: false });
					});
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
					[ { text: 'Ok', onPress: () => this.setState({ tokenIsValid: false }) } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
            //Catch posible errors
        }
	}

	render() {
		const list = this.state.news.map((nw) => <Noticia key={nw.id} data={nw.data} />);
		const spinner = <CustomSpinner color="blue" />;
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
						<StyledCardBody>{this.state.loading ? spinner : list}</StyledCardBody>
					</CardItem>
				</Card>
			</StyledNoticias>
		);

		return (
			<StyledSafeArea>
				{this.state.tokenIsValid ? <StyledContainer>
					<StyledHeader>
						<HeaderToolbar open={this.props} title="Noticias" />
					</StyledHeader>
					<StatusBar color="#ff9933" />
					<StyledMainScroll>
						<ThemeProvider theme={theme}>{noticias}</ThemeProvider>
					</StyledMainScroll>
				</StyledContainer> : this.props.navigation.navigate('Auth')}
			</StyledSafeArea>
		);
	}
}
