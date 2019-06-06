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
                case 'tipo':
                    obj.tipo = this.props.descripcionData[key];
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
                case 'direccion':
                    obj.direccion = this.props.ubicacionData[key];
                    break;
                case 'municipio':
                    obj.municipio = this.props.ubicacionData[key];
                    break;
                case 'fecha':
                    obj.fecha = this.props.ubicacionData[key];
                    break;
            }
        }
        obj.isAdmin = this.props.isAdmin;
        obj.deleteItem = this.alertCheckDeleteItem;
        obj.type =  'Reporte ciudadano';
        obj.barProps = { title: 'Reporte', status: '#c7175b', bar: '#e2487d' };
        this.setState({ showItemCard: true }, () => this.goToDescribeData(obj));
    }

    goToDescribeData = (obj) => {
		if (this.state.showItemCard) {
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

    alertCheckDeleteItem = (itemKey) => {
        Alert.alert(
            'Incidencia', 
            '¿Desea eliminar esta incidencia?', 
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
			Alert.alert('Incidencia', 'Incidencia eliminada con exito!', [ { text: 'Ok', onPress: () => { navigate('Incidencias'); this.refreshItemsHandler(); } } ], {
				cancelable: false
			});
		})
		.catch((error) => {
            console.log('deleteItemListHandler:res: ', error)
			Alert.alert('Incidencia', 'Incidencia fallida al eliminar!', [ { text: 'Ok' } ], {
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

        const listData = <ListData 
                            data={this.state.data} 
                            id={this.props.id} 
                            clicked={this.clickedListHandler}
                            showLikeIcons={this.props.showLikeIcons} />;

        return <View>{listData}</View>
    }
}

const styles = StyleSheet.create({
    listIncidents: {
        marginLeft: 2,
        marginRight: 2,
        marginTop: 5,
        marginBottom: 5,
    },
    button: {
        flex: 1,
        flexGrow: 1,
        marginTop: 5,
        marginBottom: 5,
    },
    btnsAdm: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'flex-end' ,
    },
    btnsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnsAdmImg: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginLeft: 2,
    },
    image: {
        resizeMode: 'contain',
        height: 160,
        width: 200,
        alignSelf: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    body: {
        fontSize: 15
    }
});