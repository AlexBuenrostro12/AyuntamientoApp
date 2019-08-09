import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../ListData/ListData';

export default class Manual extends Component {
	state = {
		nombre: null,
		url: null,
		fecha: null,
		itemKey: null,
		showItemCard: false,
		data: [],
	};

	clickedListHandler = (identifier, key) => {
		console.log('Manual.js:clickList: ', identifier, key);
		for (let dataName in this.props.data) {
			if (this.props.data[dataName] === identifier) {
				this.setState({ nombre: this.props.data[dataName] });
				this.setState({ url: this.props.data['url'] });
				this.setState({ fecha: this.props.data['date'] });
				this.setState({ itemKey: key });
			}
		}
		this.setState({ showItemCard: true }, () => this.goToDescribeData());
	};

	goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
				nombre: this.state.nombre,
				url: this.state.url,
				fecha: this.state.fecha,
				isAdmin: this.props.isAdmin,
				type: 'Transparencia',
				deleteItemManual: this.alertCheckDeleteItem,
				barProps: { title: 'Transparencia', status: '#00847b', bar: '#00a19a' }
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

	alertCheckDeleteItem = () => {
		Alert.alert(
			'Transparencia',
			'¿Desea eliminar este documento?',
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
			.delete('/manuales' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
				console.log('deleteItemListHandler:res: ', response);
				Alert.alert(
					'Transparencia',
					'¡Documento eliminado con exito!',
					[
						{
							text: 'Ok',
							onPress: () => {
								navigate('Transparencia');
								this.refreshItemsHandler();
							}
						}
					],
					{
						cancelable: false
					}
				);
			})
			.catch((error) => {
				console.log('deleteItemListHandler:res: ', error);
				Alert.alert('Transparencia', 'Documento fallida al eliminar!', [ { text: 'Ok' } ], {
					cancelable: false
				});
			});
	};

	refreshItemsHandler = () => {
		this.setState({ showItemCard: false });
		this.props.refresh();
	};


	componentDidMount() {
		console.log('manualProps: ', this.props);
		const data = [];
		const obj = {};
		for (let dataName in this.props.data) {
			if (dataName === 'name') {
				obj.title = this.props.data[dataName];
			}
			if (dataName === 'date') {	
				obj.fecha = this.props.data[dataName];;
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
	};

	render() {
		const listData = <ListData 
							data={this.state.data} 
							id={this.props.id} 
							clicked={this.clickedListHandler}
							showLikeIcons={this.props.showLikeIcons} />;

		return <View>{listData}</View>;
	}
}