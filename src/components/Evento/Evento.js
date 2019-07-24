import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListDataEvent from '../../components/ListData/ListDataEvent';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

export default class Evento extends Component {
	state = {
		evento: null,
		direccion: null,
        fecha: null,
        hora: null,
		imagen: null,
		tipo: null,
		dia: null,
		itemKey: null,
		showItemCard: false,
		data: [],
	};

	clickedListHandler = (identifier, key) => {
		console.log('ClickedListHandler: ', identifier, 'key: ', key, 'id:', this.props.id);
		for (let dataName in this.props.data) {
			const fecha = this.props.data['fecha'].split('T', 1);
			if (this.props.data[dataName] === identifier) {
				this.setState({ evento: this.props.data[dataName] });
                this.setState({ descripcion: this.props.data['descripcion'] });
				this.setState({ fecha: fecha });
                this.setState({ hora: this.props.data['hora'] });
				this.setState({ imagen: this.props.data['imagen'] });
				this.setState({ tipo: this.props.data['tipo'] });
				this.setState({ dia: this.props.data['dia'] });
				this.setState({ itemKey: key });
			}
		}
		this.setState({ showItemCard: true }, () => this.goToDescribeData());
	};

	goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
				evento: this.state.evento,
				descripcion: this.state.descripcion,
				fecha: this.state.fecha,
				hora: this.state.hora,
				imagen: this.state.imagen,
				tipo: this.state.tipo,
				dia: this.state.dia,
				isAdmin: this.props.isAdmin,
				deleteItem: this.alertCheckDeleteItem,
				type: 'Eventos',
                barProps: { title: 'Eventos', status: '#c7175b', bar: '#e2487d' },
                saveEvent: this.saveEventHandler
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
    };
    
    saveEventHandler = async () => {
		const startDate = new Date(this.state.fecha.toString());

		const sYear = startDate.getFullYear();
		const sMonth = startDate.getMonth() + 1;
		const sDay = String(startDate).slice(8, -29);

		const eYear = startDate.getFullYear();
		const eMonth = startDate.getMonth() + 1;
		const eDay = String(startDate).slice(8, -29);

		const eventConfig = {
			title: this.state.evento.toString(),
			startDate: `${sYear}-${sMonth}-${(Number(sDay) + 1).toString()}T08:00:00.000Z`,
			endDate: `${eYear}-${eMonth}-${(Number(eDay) + 2).toString()}T08:00:00.000Z`,
			location: 'Tecalitlán, Jal.',
			notes: this.state.descripcion.toString() + '\n' + this.state.hora
		};

		const eventInfo = await AddCalendarEvent.presentEventCreatingDialog(eventConfig);
	};

	alertCheckDeleteItem = () => {
		Alert.alert(
			'Eventos',
			'¿Desea eliminar este evento?',
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
			.delete('/events' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
				Alert.alert(
					'Eventos',
					'¡Evento eliminado con exito!',
					[ { text: 'Ok', onPress: () => { navigate('Eventos'); this.refreshItemsHandler(); } } ],
					{
						cancelable: false
					}
				);
			})
			.catch((error) => {
				Alert.alert('Eventos', '¡Evento fallido al eliminar!', [ { text: 'Ok' } ], {
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
			if (dataName === 'evento') {
				obj.title = this.props.data[dataName];
			}
			if (dataName === 'imagen') {
				obj.imagen = this.props.data[dataName];
			}
			if (dataName === 'fecha') {	
				const fecha = this.props.data[dataName].split('T', 1);
				obj.fecha = fecha;
			}
			if (dataName === 'dia') {
				obj.dia = this.props.data[dataName];
			}
			if (dataName === 'tipo') {
				obj.tipo = this.props.data[dataName];
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
		const listData = <ListDataEvent 
							showLikeIcons={this.props.showLikeIcons} 
							data={this.state.data}
							id={this.props.id} 
							clicked={this.clickedListHandler} />;

		return <View>{listData}</View>
	}
}
