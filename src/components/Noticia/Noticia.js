import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../../components/ListData/ListData';

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
		const obj = {};
		for (let dataName in this.props.data) {
			if (dataName === 'noticia') {
				obj.title = this.props.data[dataName];
			}
			if (dataName === 'imagen'){
				obj.imagen = this.props.data[dataName];
			}
		}
		data.push(obj);
		const listData = <ListData data={data} id={this.props.id} clicked={this.clickedListHandler} />;

		return <View>{listData}</View>
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
