import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
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
					'https://firebasestorage.googleapis.com/v0/b/ayuntamiento-77d3b.appspot.com/o/Make-History.pdf?alt=media&token=ffc16829-605f-4307-bbd8-5eb509e14383',
				fecha: '22-05-2019'
			},
			{
				name: 'Manual 2',
				url:
					'https://firebasestorage.googleapis.com/v0/b/ayuntamiento-77d3b.appspot.com/o/doc_iso27000_all.pdf?alt=media&token=eea1e5a7-d3cd-4bcb-b00d-3f364472359d',
				fecha: '25-05-2019'
			}
		],
		show: false,
		url: 'nothing',
		token: null,
		showLikeIcons: true,
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
			if (token && parseExpiresIn > now) {
				this.setState({ token: token });
			} else {
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
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errors
		}
	}

	changeDisplay = () => {
		this.setState({ showLikeIcons: !this.state.showLikeIcons });
	};

	render() {

		const list = this.state.manuales.map((m, index) => (
			<Manual
				key={m.url}
				id={m.url}
				token={this.state.token}
				isAdmin={this.state.isAdmin}
				data={m}
				describe={this.props}
				index={index + 1}
				changeDisplay={this.changeDisplay}
				showLikeIcons={this.state.showLikeIcons}
			/>
		));


		const title = (
			<ScrollView style={{ flex: 1 }}>
				<CustomCardItemTitle
					title="MANUALES"
					description="Visualice los manuales de transparencia"
					info="Delice hacia abajo, para los manuales más antiguas."
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
		const manuales = (
			<View style={{ flex: 1 }}>
				{title}
				{body}
			</View>
		);
		
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar
							open={this.props}
							title="Manuales"
							color="#00a19a"
							showContentRight={true}
							add={() => this.setState({ show: true })}
							goBack={() => this.setState({ show: false })}
							isAdd={this.state.show}
							changeDisplay={this.changeDisplay}
							showLikeIcons={this.state.showLikeIcons}
						/>
					</View>
					<StatusBar color="#FEA621" />
					<View style={{ flex: 1, margin: 10 }}>
						{manuales}
					</View>
				</View>
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
