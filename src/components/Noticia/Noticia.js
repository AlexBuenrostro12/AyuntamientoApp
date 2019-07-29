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
		data: [],
	};

	clickedListHandler = (identifier, key) => {
		console.log('ClickedListHandler: ', identifier, 'key: ', key, 'id:', this.props.id);
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
				type: 'Noticias',
				barProps: { title: 'Noticias', status: '#c7175b', bar: '#e2487d' }
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
		// console.log('deleteItemListHandler:res: ', this.props.token, this.state.itemKey);
		const { navigate } = this.props.describe.navigation;
		axios
			.delete('/news' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
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
				Alert.alert('Noticia', '¡Noticia fallida al eliminar!', [ { text: 'Ok' } ], {
					cancelable: false
				});
			});
	};

	refreshItemsHandler = () => {
		this.setState({ showItemCard: false });
		this.props.refresh();
	};

	componentDidMount() {
		const data = [];
		const obj = {};
		for (let dataName in this.props.data) {
			if (dataName === 'noticia') {
				obj.title = this.props.data[dataName];
			}
			if (dataName === 'imagen') {
				obj.imagen = this.props.data[dataName];
			}
			if (dataName === 'fecha') {	
				const fecha = this.props.data[dataName].split('T', 1);
				obj.fecha = fecha;
			}
		}
		const oddORnot = (this.props.index % 2);
		let odd = null;
		if(oddORnot === 1)
			odd = false;
		else
			odd = true;
		obj.odd = odd;
		data.push(obj);
		this.setState({ data: data });
	}

	render() {
		const listData = <ListData 
							showLikeIcons={this.props.showLikeIcons} 
							data={this.state.data}
							id={this.props.id} 
							clicked={this.clickedListHandler} />;

		return <View>{listData}</View>
	}
}
