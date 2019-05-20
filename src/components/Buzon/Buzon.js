import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../ListData/ListData';

export default class Buzon extends Component {
	state = {
		actividad: null,
		asunto: null,
		comentario: null,
		email: null,
		fecha: null,
		nombre: null,
		itemKey: null,
		showItemCard: false,
		deleted: null
	};

	clickedListHandler = (identifier, key) => {
		console.log('Actividad.js:clickList: ', identifier, key);
		for (let dataName in this.props.data) {
			const fecha = this.props.data['fecha'].split('T', 1);
			if (this.props.data[dataName] === identifier) {
				this.setState({ asunto: this.props.data[dataName] });
				this.setState({ comentario: this.props.data['comentario'] });
				this.setState({ email: this.props.data['email'] });
				this.setState({ fecha: fecha });
				this.setState({ nombre: this.props.data['nombre'] });
				this.setState({ itemKey: key });
			}
		}
		this.setState({ showItemCard: true }, () => this.goToDescribeData());
	};

	goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
				asunto: this.state.asunto,
				comentario: this.state.comentario,
				email: this.state.email,
				fecha: this.state.fecha,
				nombre: this.state.nombre,
				isAdmin: this.props.isAdmin,
				deleteItem: this.alertCheckDeleteItem,
				type: 'buzon'
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

	alertCheckDeleteItem = () => {
		Alert.alert(
			'Buzón ciudadano',
			'¿Desea eliminar esta sugerencia?',
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
			.delete('/suggestions' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
				console.log('deleteItemListHandler:res: ', response);
				Alert.alert(
					'Buzón ciudadano',
					'Sugerencia eliminada con exito!',
					[
						{
							text: 'Ok',
							onPress: () => {
								navigate('Buzón Ciudadano');
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
				Alert.alert('Buzón ciudadano', 'Sugerencia fallida al eliminar!', [ { text: 'Ok' } ], {
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
		console.log('data: ', this.props.data);
		for (let dataName in this.props.data) {
			if (dataName === 'asunto') {
				data.push({
					title: this.props.data[dataName]
				});
			}
		}
		const listData = <ListData data={data} id={this.props.id} clicked={this.clickedListHandler} />;

		return <View>{listData}</View>;
	}
}

const styles = StyleSheet.create({
	listSuggestions: {
		marginLeft: 2,
		marginRight: 2,
		marginTop: 5,
		marginBottom: 5
	},
	button: {
		flex: 1,
		flexGrow: 1,
		marginTop: 5,
		marginBottom: 5
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
	},
	image: {
		resizeMode: 'contain',
		height: 160,
		width: 200,
		alignSelf: 'center'
	}
});
