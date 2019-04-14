import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Card, ListItem, CardItem } from 'native-base';
import styled from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../../components/CustomButton/CustomButton';
import Manual from '../../components/Manual/Manual';

const StyledViewManuales = styled.View`
	flex: 1;
	margin: 5px;
`;

const StyledBodyManuales = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
`;

export default class Manuales extends Component {
	state = {
		manuales: [
			{
				name: 'Manual 1',
				url:
					'https://firebasestorage.googleapis.com/v0/b/ayuntamiento-77d3b.appspot.com/o/Make-History.pdf?alt=media&token=ffc16829-605f-4307-bbd8-5eb509e14383'
			},
			{
				name: 'Manual 2',
				url:
					'https://firebasestorage.googleapis.com/v0/b/ayuntamiento-77d3b.appspot.com/o/doc_iso27000_all.pdf?alt=media&token=eea1e5a7-d3cd-4bcb-b00d-3f364472359d'
			}
		],
		show: false,
		url: 'nothing',
		token: null,
		tokenIsValid: true
	};

	showManualHandler = (url) => {
		this.setState({ show: true, url: url });
	};

	hiddeManualHandler = () => {
		this.setState({ show: false });
	};

	async componentDidMount() {
		let token = (expiresIn = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('Manuales.js: ', token);
            console.log('Manuales.js: ', parseExpiresIn, now);
            console.log('Manuales.js: ', this.state.tokenIsValid);
			if (token && parseExpiresIn > now) {
				this.setState({ token: token });
			} else {
				this.setState({ tokenIsValid: false });
				try {
					console.log('Entro al try');
					await AsyncStorage.removeItem('@storage_token');
					await AsyncStorage.removeItem('@storage_expiresIn');
					//Use the expires in
				} catch (e) {
					//Catch posible errors
				}
				Alert.alert(
					'Manuales',
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
		const cardBody = (
			<View style={{ flex: 1, margin: 5 }}>
				<Card>
					<CustomCardItemTitle
						title="Manuales"
						description="Da clic sobre el manual que deseas ver."
						image={require('../../assets/images/Noticia/noticia.png')}
					/>
					<CardItem bordered>
						<StyledViewManuales>
							{this.state.manuales.map((m, index) => (
								<ListItem key={index}>
									<StyledBodyManuales>
										<TouchableOpacity onPress={() => this.showManualHandler(m.url)}>
											<Text>{m.name}</Text>
										</TouchableOpacity>
										<IconRight describe={() => this.showManualHandler(m.url)} />
									</StyledBodyManuales>
								</ListItem>
							))}
						</StyledViewManuales>
					</CardItem>
				</Card>
			</View>
		);

		const button = <CustomButton style="DangerBorder" clicked={() => this.hiddeManualHandler()} name="Cerrar" />;

		const manual = (
			<View style={{ flex: 1, height: Dimensions.get('window').height }}>
				<Manual url={this.state.url} token={this.state.token} />
				<View style={{ margin: 1.5 }}>{this.state.show ? button : null}</View>
			</View>
		);

		const body = (
			<View style={styles.container}>
				<View>
					<HeaderToolbar open={this.props} title="Manuales" />
				</View>
				<StatusBar color="#ff9933" />
				{cardBody}
			</View>
		);

		return (
			<SafeAreaView style={{ flex: 1 }}>
				{this.state.tokenIsValid ? (
					<View style={{ flex: 1 }}>{this.state.show ? manual : body}</View>
				) : (
					this.props.navigation.navigate('Auth')
				)}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		overflow: 'scroll'
	},
	view: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold'
	}
});
