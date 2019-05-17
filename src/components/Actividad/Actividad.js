import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, View, Image, Alert } from 'react-native';
import { ListItem, Text, Left, Right, Card, CardItem, Body } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';
import axios from '../../../axios-ayuntamiento';

export default class Noticia extends Component {
    state = {
        actividad: null,
        hora: null,
        descripcion: null,
        fecha: null,
        imagen: null,
        itemKey: null,
        showItemCard: false,
    }

    clickedListHandler = (identifier, key) => {
        console.log('Actividad.js:clickList: ', identifier, key);
        for (let dataName in this.props.data) {
            const fecha = this.props.data['fecha'].split("T", 1);
            if (this.props.data[dataName] === identifier) {
                this.setState({ actividad: this.props.data[dataName] });
                this.setState({ hora: this.props.data['hora'] });
                this.setState({ descripcion: this.props.data['descripcion'] });
                this.setState({ fecha: fecha });
                this.setState({ imagen: this.props.data['imagen'] });
                this.setState({ itemKey: key });
            }
        }
        this.setState({ showItemCard: true }, () => this.goToDescribeData());
    }

    goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
				actividad: this.state.actividad,
				hora: this.state.hora,
				descripcion: this.state.descripcion,
				fecha: this.state.fecha,
				imagen: this.state.imagen,
				isAdmin: this.props.isAdmin,
				deleteItem: this.alertCheckDeleteItem,
				type: 'actividad',
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

    alertCheckDeleteItem = () => {
        Alert.alert(
            'Actividad', 
            '¿Desea eliminar esta actividad?', 
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
		.delete('/activities' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
		.then((response) => {
            console.log('deleteItemListHandler:res: ', response);
			Alert.alert('Actividad', '¡Actividad eliminada con exito!', [ { text: 'Ok', onPress: () => { navigate('Actividades'); this.refreshItemsHandler(); } } ], {
				cancelable: false
			});
		})
		.catch((error) => {
            console.log('deleteItemListHandler:res: ', error)
			Alert.alert('Actividad', '¡Actividad fallida al eliminar!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		});
    }

    refreshItemsHandler = () => {
        this.setState({ showItemCard: false });
        this.props.refresh();
    }

    render() {
        console.log('Actividad.js:props: ', this.props)
        const data = [];
        for (let dataName in this.props.data) {
            if (dataName === 'actividad') {
                data.push({
                    actividad: this.props.data[dataName]
                })
            }
        }
        const listActivities = (
            <View style={styles.listActivities}>
                {data.map(dt => (
                    <ListItem key={dt.actividad}>
                        <Left>
                            <TouchableOpacity onPress={() => this.clickedListHandler(dt.actividad, this.props.id)}>
                                <Text>{dt.actividad}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <IconRight describe={() => this.clickedListHandler(dt.actividad, this.props.id)} />
                        </Right>
                    </ListItem>
                ))}
            </View>
        );
        
        return (
            <ScrollView>
                {listActivities}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listActivities: {
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
});