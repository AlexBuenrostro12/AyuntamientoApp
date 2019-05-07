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
        const bus = [];
        let obj = {};
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
        bus.push(obj);
        console.log(bus);
        this.setState({ bus: bus, showItemCard: true, itemKey: key });
    }

    showItemList = () => {
        this.setState({ showItemCard: false });
    }

    alertCheckDeleteItem = () => {
        Alert.alert(
            'Actividad', 
            '¿Desea eliminar esta horario del bus?', 
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
        axios
			.delete('/buses' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
                console.log('deleteItemListHandler:res: ', response);
				Alert.alert('¡Bus escolar', 'Bus escolar eliminado con exito!', [ { text: 'Ok', onPress: () => this.refreshItemsHandler() } ], {
					cancelable: false
				});
			})
			.catch((error) => {
                console.log('deleteItemListHandler:res: ', error)
				Alert.alert('¡Bus escolar', 'Bus escolar fallido al eliminar!', [ { text: 'Ok' } ], {
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

        const cardBuses = (
            <View style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
                {this.state.bus.map(bs => (
                    <Card key={bs.chofer  + bs.horaSalida + bs.destino}>
                        <CardItem header>
                            <View style={styles.btnsContainer}>
                                <Text style={styles.textTitle}>{bs.destino}</Text>
                                {this.props.isAdmin && <View style={styles.btnsAdm}>
                                    <TouchableOpacity onPress={() => this.alertCheckDeleteItem()}>
                                        <Image style={styles.btnsAdmImg} source={require('../../assets/images/Delete/delete.png')}/>
                                    </TouchableOpacity>
                                </View>}
                            </View>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={styles.text}>Placa del camión: {bs.placa}</Text>
                                <Text style={styles.text}>Chofer: {bs.chofer}</Text>
                                <Text style={styles.text}>Salida: {bs.horaSalida}</Text>
                                <Text style={styles.text}>Regreso: {bs.horaRegreso}</Text>
                            </Body>
                        </CardItem>
                        <CardItem footer>
                            <Text style={styles.textTitle}>Horarios.</Text>
                        </CardItem>
                        <View style={{ flex: 1, flexGrow: 1, marginTop: 5, marginBottom: 5 }}>
                            <CustomButton
                                style="DangerBorder"
                                name="Cerrar"
                                clicked={() => this.showItemList()} />
                        </View>
                    </Card>
                ))}
            </View>
        );

        return (
            <ScrollView>
                {!this.state.showItemCard ? listBuses : cardBuses}
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