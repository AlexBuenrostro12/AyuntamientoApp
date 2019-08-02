import React, { Component } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../ListData/ListData';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

export default class Noticia extends Component {
	state = {
		lugar: null,
		descripcion: null,
		ubicacion: null,
		imagenes: null,
		itemKey: null,
		showItemCard: false,
		data: []
	};

	clickedListHandler = (identifier, key) => {
		//Check the key
		console.log('TurismoAux.js:clickList: ', identifier, key);
		for (let dataName in this.props.data) {
			if (this.props.data[dataName] === identifier) {
				this.setState({ lugar: this.props.data[dataName] });
				this.setState({ descripcion: this.props.data['descripcion'] });
				this.setState({ ubicacion: this.props.data['ubicacion'] });
				this.setState({ imagenes: this.props.data['imagenes'] });
				this.setState({ itemKey: key });
			}
		}
		this.setState({ showItemCard: true }, () => this.goToDescribeData());
	};

	goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
				lugar: this.state.lugar,
				descripcion: this.state.descripcion,
				ubicacion: this.state.ubicacion,
				imagenes: this.state.imagenes,
				isAdmin: this.props.isAdmin,
				deleteItem: this.alertCheckDeleteItem,
				type: 'Turismo',
				barProps: { title: 'Turismo', status: '#00a3e4', bar: '#1dd2fc' },
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

	alertCheckDeleteItem = () => {
		Alert.alert(
			'Turismo',
			'¿Desea eliminar este lugar?',
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
			.delete('/tourism' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
				console.log('deleteItemListHandler:res: ', response);
				Alert.alert(
					'Turismo',
					'¡Lugar eliminado con exito!',
					[
						{
							text: 'Ok',
							onPress: () => {
								navigate('Turismo');
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
				Alert.alert('Turismo', '¡Lugar fallido al eliminar!', [ { text: 'Ok' } ], {
					cancelable: false
				});
			});
	};

	refreshItemsHandler = () => {
		this.setState({ showItemCard: false });
		this.props.refresh();
	};
	componentDidMount() {
		console.log('TurismoAux.js:props: ', this.props);
		const data = [];
		const obj = {};
		for (let dataName in this.props.data) {
			if (dataName === 'lugar') {
				obj.title = this.props.data[dataName];
			}
			if (dataName === 'imagenes') {
				obj.imagen = this.props.data[dataName].url0;
			}
		}
		const oddORnot = this.props.index % 2;
		let odd = null;
		if (oddORnot === 1) odd = false;
		else odd = true;
		obj.odd = odd;
		data.push(obj);
		this.setState({ data: data });
	}
	render() {
		const listData = (
			<ListData
				data={this.state.data}
				id={this.props.id}
				clicked={this.clickedListHandler}
				showLikeIcons={this.props.showLikeIcons}
			/>
		);

		return <View>{listData}</View>;
	}
}

const styles = StyleSheet.create({
	listActivities: {
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
