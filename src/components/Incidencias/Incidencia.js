import React, { Component } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../ListData/ListData';

export default class Incidencia extends Component {
    state = {
        actividad: null,
        hora: null,
        descripcion: null,
        fecha: null,
        imagen: null,
        itemKey: null,
        showItemCard: false,
        data: [],
    }

    clickedListHandler = (identifier, key) => {
        console.log('Actividad.js:clickList: ', identifier, key);
        //Construct the object with the data nesscesary to display
        let obj = {};
        obj.itemKey = key;
        //Add approvedData to the object
        for(let key in this.props.approvedData){
            switch (key) {
                case 'approved':
                    obj.approved = this.props.approvedData[key];
                    break;
            }
        }
        //Add personalData to the object
        for(let key in this.props.personalData){
            switch (key) {
                case 'email':
                    obj.email = this.props.personalData[key];
                    break;
                case 'nombre':
                    obj.nombre = this.props.personalData[key];
                    break;
                case 'telefono':
                    obj.telefono = this.props.personalData[key];
                    break;
            }
        }
        //Add descripcionData to the object
        for(let key in this.props.descripcionData){
            switch (key) {
                case 'asunto':
                    obj.asunto = this.props.descripcionData[key];
                    break;
                case 'descripcion':
                    obj.descripcion = this.props.descripcionData[key];
                    break;
                case 'direccion':
                    obj.direccion = this.props.descripcionData[key];
                    break;
            }
        }
        //Add multimediaData to the object 
        for(let key in this.props.multimediaData){
            switch (key) {
                case 'imagen':
                    obj.imagen = this.props.multimediaData[key];
                    break;
            }
        }
        //Add ubicacionData to the object
        for(let key in this.props.ubicacionData){
            switch (key) {
                case 'calle':
                    obj.calle = this.props.ubicacionData[key];
                    break;
                case 'colonia':
                    obj.colonia = this.props.ubicacionData[key];
                    break;
                case 'cp':
                    obj.cp = this.props.ubicacionData[key];
                    break;
                case 'fecha':
                    obj.fecha = this.props.ubicacionData[key];
                    break;
                case 'localidad':
                    obj.localidad = this.props.ubicacionData[key];
                    break;
                case 'numero':
                    obj.numero = this.props.ubicacionData[key];
                    break;
                case 'referencia':
                    obj.referencia = this.props.ubicacionData[key];
                    break;
                case 'latitude':
                    obj.latitude = this.props.ubicacionData[key];
                    break;
                case 'longitude':
                    obj.longitude = this.props.ubicacionData[key];
                    break;
            }
        }
        obj.isAdmin = this.props.isAdmin;
        obj.approvedItem = this.approveItemListHandler;
        obj.deleteItem = this.alertCheckDeleteItem;
        obj.type =  'Reporte ciudadano';
        obj.barProps = { title: 'Reporte', status: '#00a3e4', bar: '#1dd2fc' };
        this.setState({ showItemCard: true }, () => this.goToDescribeData(obj));
    }

    goToDescribeData = (obj) => {
		if (this.state.showItemCard) {
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
    };

    approveItemListHandler = (itemKey, approved) => {
        console.log('approveItemListHandler:res: ', this.props.token, this.state.itemKey);
        const { navigate } = this.props.describe.navigation;
        console.log('navigate: ', navigate, 'approved: ', approved);
        let title = '';
        if (approved) title = '¡Reporte aprobado con éxito!';
        else title = '¡Reporte desaprobado con éxito!';
        const obj = { 
            approvedData : {
                approved: approved
            } 
        };
        axios
		.patch('/incidents' + '/' + itemKey + '.json?auth=' + this.props.token, obj)
		.then((response) => {
            console.log('approveItemListHandler:res: ', response);
			Alert.alert('¡Reporte!', title, [ { text: 'Ok', onPress: () => { this.refreshItemsHandler(); } } ], {
				cancelable: false
			});
		})
		.catch((error) => {
            console.log('approveItemListHandler:res: ', error)
			Alert.alert('¡Reporte!', '¡Reporte fallido al aprobar!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		});
    }


    alertCheckDeleteItem = (itemKey) => {
        Alert.alert(
            'Reporte', 
            '¿Desea eliminar este reporte?', 
            [ 
                { text: 'Si', onPress: () => this.deleteItemListHandler(itemKey) }, 
                { text: 'No', }, 
            ], 
            {
                cancelable: false
            },
        )
    }

    deleteItemListHandler = (itemKey) => {
        console.log('deleteItemListHandler:res: ', this.props.token, this.state.itemKey);
        const { navigate } = this.props.describe.navigation;
        axios
		.delete('/incidents' + '/' + itemKey + '.json?auth=' + this.props.token)
		.then((response) => {
            console.log('deleteItemListHandler:res: ', response);
			Alert.alert('Reporte', '¡Reporte eliminado con exito!', [ { text: 'Ok', onPress: () => { navigate('Reporte ciudadano'); this.refreshItemsHandler(); } } ], {
				cancelable: false
			});
		})
		.catch((error) => {
            console.log('deleteItemListHandler:res: ', error)
			Alert.alert('Reporte', '¡Reporte fallido al eliminar!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		});
    }

    refreshItemsHandler = () => {
        this.setState({ showItemCard: false });
        this.props.refresh();
    }

    componentDidMount() {
		const data = [];
		const obj = {};
		for (let dataName in this.props.descripcionData) {
            if (dataName === 'asunto') {
                obj.title = this.props.descripcionData[dataName];
            }
        }
        for (let dataName in this.props.multimediaData) {
            if (dataName === 'imagen') {
                obj.imagen = this.props.multimediaData[dataName];
            }
        }
        for (let dataName in this.props.ubicacionData) {
            if (dataName === 'fecha') {
                obj.fecha = this.props.ubicacionData[dataName];
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
        console.log('this.props: ', this.props);
        const listData = <ListData 
                            data={this.state.data} 
                            id={this.props.id} 
                            clicked={this.clickedListHandler}
                            showLikeIcons={this.props.showLikeIcons} />;

        return <View>{listData}</View>
    }
}