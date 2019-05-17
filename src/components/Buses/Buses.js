import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { ListItem, Card, CardItem, Body, Right, Left } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';
import axios from '../../../axios-ayuntamiento';

export default class Buses extends Component {

    state = {
        data: [],
        bus: [],
        showItemCard: false,
        itemKey: null
    }

    clickedListHandler = (salida, destino, key) => {  
        const obj = {};
        for (let dataName in this.props.data) {
            console.log(this.props.data[dataName], salida, destino);
            switch (dataName) {
                case 'placa':
                    obj.placa =  this.props.data[dataName];
                    break;
                case 'chofer':
                    obj.chofer =  this.props.data[dataName];
                    break;
                case 'destino':
                    obj.destino =  this.props.data[dataName];
                    break;
                case 'horaRegreso':
                    obj.horaRegreso =  this.props.data[dataName];
                    break;
                case 'horaSalida':
                    obj.horaSalida =  this.props.data[dataName];
                    break;      
                default:
                    null
                    break;
            }
        }
        obj.isAdmin = this.props.isAdmin;
        obj.deleteItem =  this.alertCheckDeleteItem;
        obj.type =  'bus';
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
            [ 
                { text: 'Si', onPress: () => this.deleteItemListHandler() }, 
                { text: 'No', }, 
            ], 
            {
                cancelable: false
            },
        )
    }

    deleteItemListHandler = () => {
        console.log('deleteItemListHandler:res: ', this.props.token, this.state.itemKey);
        const { navigate } = this.props.describe.navigation;
        axios
			.delete('/buses' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
                console.log('deleteItemListHandler:res: ', response);
				Alert.alert('¡Bus escolar!', 'Bus escolar eliminado con exito!', [ { text: 'Ok', onPress: () => { navigate('Bus Escolar'); this.refreshItemsHandler(); } } ], {
					cancelable: false
				});
			})
			.catch((error) => {
                console.log('deleteItemListHandler:res: ', error)
				Alert.alert('¡Bus escolar!', 'Bus escolar fallido al eliminar!', [ { text: 'Ok' } ], {
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
        data.push(obj)
        this.setState({ data: data });
        console.log('Componentdidmount: ', data);
    }

    render() {
        console.log('Buses.js: ', this.props);
        const listBuses = (
            <View style={styles.list}>
                {this.state.data.map(dt => (
                    <ListItem key={dt.destino + dt.horaSalida}>
                        <Left>
                            <TouchableOpacity onPress={() => this.clickedListHandler(dt.horaSalida, dt.destino, this.props.id)}>
                                <Text style={styles.text}>{dt.destino} - {dt.horaSalida}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <IconRight describe={() => this.clickedListHandler(dt.horaSalida, dt.destino, this.props.id)} />
                        </Right>
                    </ListItem>
                ))}
            </View>
        );

        return (
            <ScrollView>
                {listBuses}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        marginLeft: 2,
        marginRight: 2,
        marginTop: 5,
        marginBottom: 5,
    },
    text: {
        fontSize: 15,
        color: 'black'
    },
    textTitle: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
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
    }
});