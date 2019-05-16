import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, View, Image, Alert, Dimensions } from 'react-native';
import { ListItem, Text, Left, Right, Card, CardItem, Body } from 'native-base';
import styled from 'styled-components';
import IconRight from '../../UI/IconRight/IconRight';
import axios from '../../../axios-ayuntamiento';

const StyledListNews = styled.View`
	margin-left: 2px;
	margin-right: 2px;
	margin-top: ${(props) => props.theme.customMarginValue};
	margin-bottom: ${(props) => props.theme.customMarginValue};
`;

export default class Noticia extends Component {
	state = {
		noticia: null,
		direccion: null,
		descripcion: null,
		fecha: null,
		imagen: null,
		itemKey: null,
		showItemCard: false,
		deleted: false
	};

	clickedListHandler = (identifier, key) => {
		for (let dataName in this.props.data) {
			const fecha = this.props.data['fecha'].split('T', 1);
			if (this.props.data[dataName] === identifier) {
				this.setState({ noticia: this.props.data[dataName] });
				this.setState({ direccion: this.props.data['direccion'] });
				this.setState({ descripcion: this.props.data['descripcion'] });
				this.setState({ imagen: this.props.data['imagen'] });
				this.setState({ fecha: fecha });
				this.setState({ itemKey: key });
			}
		}
		this.setState({ showItemCard: true }, () => this.goToDescribeData());
		console.log('this.props: ', this.props)
	};

	goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
				noticia: this.state.noticia,
				direccion: this.state.direccion,
				descripcion: this.state.descripcion,
				imagen: this.state.imagen,
				fecha: this.state.fecha,
				isAdmin: this.props.isAdmin,
				deleteItem: this.alertCheckDeleteItem,
				type: 'noticia',
				deleted: this.state.deleted,
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	}

	alertCheckDeleteItem = () => {
		Alert.alert(
			'Actividad',
			'¿Desea eliminar esta noticia?',
			[ { text: 'Si', onPress: () => this.deleteItemListHandler() }, { text: 'No' } ],
			{
				cancelable: false
			}
		);
	};

	deleteItemListHandler = () => {
		console.log('deleteItemListHandler:res: ', this.props.token, this.state.itemKey);
		const { navigate } = this.props.describe.navigation;
		axios
			.delete('/news' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
				console.log('deleteItemListHandler:res: ', response);
				Alert.alert(
					'Noticia',
					'¡Noticia eliminada con exito!',
					[ { text: 'Ok', onPress: () => { navigate('Noticias'); this.refreshItemsHandler(); } } ],
					{
						cancelable: false
					}
				);
			})
			.catch((error) => {
				console.log('deleteItemListHandler:res: ', error);
				Alert.alert('Noticia', '¡Noticia fallida al eliminar!', [ { text: 'Ok' } ], {
					cancelable: false
				});
			});
	};

	refreshItemsHandler = () => {
		this.setState({ showItemCard: false });
		this.props.refresh();
	};

	render() {
		const data = [];
		for (let dataName in this.props.data) {
			if (dataName === 'noticia') {
				data.push({
					noticia: this.props.data[dataName]
				});
			}
		}
		const listNews = (
			<StyledListNews>
				{data.map((dt) => (
					<ListItem key={dt.noticia}>
						<Left>
							<TouchableOpacity onPress={() => this.clickedListHandler(dt.noticia, this.props.id)}>
								<Text>{dt.noticia}</Text>
							</TouchableOpacity>
						</Left>
						<Right>
							<IconRight describe={() => this.clickedListHandler(dt.noticia, this.props.id)} />
						</Right>
					</ListItem>
				))}
			</StyledListNews>
		);
		return <ScrollView>{listNews}</ScrollView>;
	}
}

const styles = StyleSheet.create({
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
		height: 160,
		width: 200,
		alignSelf: 'center'
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'black'
	},
	direction: {
		fontSize: 14,
		fontWeight: 'normal',
		color: 'black'
	},
	header: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	}
});
