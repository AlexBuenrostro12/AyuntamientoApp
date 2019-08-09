import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../ListData/ListData';

export default class Buses extends Component {
	state = {
		data: [],
		bus: [],
		showItemCard: false,
		itemKey: null,
		data: []
	};

	clickedListHandler = (salida, destino, key) => {
		const obj = {};
		for (let dataName in this.props.data) {
			console.log(this.props.data[dataName], salida, destino);
			switch (dataName) {
				case 'placa':
					obj.placa = this.props.data[dataName];
					break;
				case 'chofer':
					obj.chofer = this.props.data[dataName];
					break;
				case 'destino':
					obj.destino = this.props.data[dataName];
					break;
				case 'horaRegreso':
					obj.horaRegreso = this.props.data[dataName];
					break;
				case 'horaSalida':
					obj.horaSalida = this.props.data[dataName];
					break;
				case 'lugarSalida':
					obj.lugarSalida = this.props.data[dataName];
					break;
				case 'lugarRegreso':
					obj.lugarRegreso = this.props.data[dataName];
					break;
				default:
					null;
					break;
			}
		}
		obj.isAdmin = this.props.isAdmin;
		obj.deleteItem = this.alertCheckDeleteItem;
		obj.type = 'Bus Escolar';
		obj.barProps = { title: 'Bus Escolar', status: '#bac95f', bar: '#d4e283' };
		this.setState({ showItemCard: true, itemKey: key }, () => this.goToDescribeData(obj));
	};

	goToDescribeData = (obj) => {
		if (this.state.showItemCard) {
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

	alertCheckDeleteItem = () => {
		Alert.alert(
			'¡Bus escolar!',
			'¿Desea eliminar esta horario de autobus?',
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
			.delete('/buses' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
				console.log('deleteItemListHandler:res: ', response);
				Alert.alert(
					'¡Bus escolar!',
					'Bus escolar eliminado con exito!',
					[
						{
							text: 'Ok',
							onPress: () => {
								navigate('Bus Escolar');
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
				Alert.alert('¡Bus escolar!', 'Bus escolar fallido al eliminar!', [ { text: 'Ok' } ], {
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
		let obj = {};

		for (let dataName in this.props.data) {
			console.log(dataName, this.props.id);
			if (dataName === 'chofer') {
				obj.chofer = this.props.data[dataName];
			}
			if (dataName === 'destino') {
				obj.destino = this.props.data[dataName];
			}
			if (dataName === 'horaSalida') {
				obj.horaSalida = this.props.data[dataName];
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
		console.log('Componentdidmount: ', data);
	}

	render() {
		console.log('Buses.js: ', this.props);
		const listData = <ListData 
							data={this.state.data} 
							id={this.props.id} 
							clicked={this.clickedListHandler}
							showLikeIcons={this.props.showLikeIcons} />;

		return <View>{listData}</View>;
	}
}

const styles = StyleSheet.create({
	list: {
		marginLeft: 2,
		marginRight: 2,
		marginTop: 5,
		marginBottom: 5
	},
	text: {
		fontSize: 15,
		color: 'black'
	},
	textTitle: {
		fontSize: 15,
		color: 'black',
		fontWeight: 'bold'
	},
	btnsAdm: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	btnsContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	btnsAdmImg: {
		height: 30,
		width: 30,
		resizeMode: 'contain',
		marginLeft: 2
	}
});
