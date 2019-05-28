import React, { Component } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../ListData/ListData';

export default class Noticia extends Component {
	state = {
        actividad: null,
        direccion: null,
		hora: null,
		descripcion: null,
		fecha: null,
		imagen: null,
		itemKey: null,
		showItemCard: false,
		data: []
	};

	clickedListHandler = (identifier, key) => {
		//Check the key
		console.log('Actividad.js:clickList: ', identifier, key);
		for (let dataName in this.props.data) {
			const fecha = this.props.data['fecha'].split('T', 1);
			if (this.props.data[dataName] === identifier) {
                this.setState({ actividad: this.props.data[dataName] });
                this.setState({ direccion: this.props.data['direccion'] });
				this.setState({ hora: this.props.data['hora'] });
				this.setState({ descripcion: this.props.data['descripcion'] });
				this.setState({ fecha: fecha });
				this.setState({ imagen: this.props.data['imagen'] });
				this.setState({ itemKey: key });
			}
		}
		this.setState({ showItemCard: true }, () => this.goToDescribeData());
	};

	goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
                actividad: this.state.actividad,
                direccion: this.state.direccion,
				hora: this.state.hora,
				descripcion: this.state.descripcion,
				fecha: this.state.fecha,
				imagen: this.state.imagen,
				isAdmin: this.props.isAdmin,
				deleteItem: this.alertCheckDeleteItem,
				type: 'actividad'
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

	alertCheckDeleteItem = () => {
		Alert.alert(
			'Actividad',
			'¿Desea eliminar esta actividad?',
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
			.delete('/activities' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
				console.log('deleteItemListHandler:res: ', response);
				Alert.alert(
					'Actividad',
					'¡Actividad eliminada con exito!',
					[
						{
							text: 'Ok',
							onPress: () => {
								navigate('Actividades');
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
				Alert.alert('Actividad', '¡Actividad fallida al eliminar!', [ { text: 'Ok' } ], {
					cancelable: false
				});
			});
	};

	refreshItemsHandler = () => {
		this.setState({ showItemCard: false });
		this.props.refresh();
	};
	componentDidMount() {
		console.log('Actividad.js:props: ', this.props);
		const data = [];
		const obj = {};
		for (let dataName in this.props.data) {
			if (dataName === 'actividad') {
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
