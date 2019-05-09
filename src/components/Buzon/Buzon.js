import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, View, Image, Alert } from 'react-native';
import { ListItem, Text, Left, Right, Card, CardItem, Body } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';
import axios from '../../../axios-ayuntamiento';

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
    }

    clickedListHandler = (identifier, key) => {
        console.log('Actividad.js:clickList: ', identifier, key);
        for (let dataName in this.props.data) {
            const fecha = this.props.data['fecha'].split("T", 1);
            if (this.props.data[dataName] === identifier) {
                this.setState({ asunto: this.props.data[dataName] });
                this.setState({ comentario: this.props.data['comentario'] });
                this.setState({ email: this.props.data['email'] });
                this.setState({ fecha: fecha });
                this.setState({ nombre: this.props.data['nombre'] });
                this.setState({ itemKey: key });
            }
        }
        this.setState({ showItemCard: true });
    }

    showItemList = () => {
        this.setState({ showItemCard: false })
    }

    alertCheckDeleteItem = () => {
        Alert.alert(
            'Buzón ciudadano', 
            '¿Desea eliminar esta sugerencia?', 
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
		.delete('/suggestions' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
		.then((response) => {
            console.log('deleteItemListHandler:res: ', response);
			Alert.alert('Buzón ciudadano', 'Sugerencia eliminada con exito!', [ { text: 'Ok', onPress: () => this.refreshItemsHandler() } ], {
				cancelable: false
			});
		})
		.catch((error) => {
            console.log('deleteItemListHandler:res: ', error)
			Alert.alert('Buzón ciudadano', 'Sugerencia fallida al eliminar!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		});
    }

    refreshItemsHandler = () => {
        this.setState({ showItemCard: false });
        this.props.refresh();
    }

    render() {
        const data = [];
        for (let dataName in this.props.data) {
            if (dataName === 'asunto') {
                data.push({
                    asunto: this.props.data[dataName]
                })
            }
        }
        const listSuggestions = (
            <View style={styles.listSuggestions}>
                {data.map(dt => (
                    <ListItem key={dt.asunto}>
                        <Left>
                            <TouchableOpacity onPress={() => this.clickedListHandler(dt.asunto, this.props.id)}>
                                <Text>{dt.asunto}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <IconRight describe={() => this.clickedListHandler(dt.asunto, this.props.id)} />
                        </Right>
                    </ListItem>
                ))}
            </View>
        );
        
        const card = (
            <View>
                <Card>
                    <CardItem header>
                        <View style={styles.btnsContainer}>
                            <Text>{this.state.asunto}</Text>
                            {this.props.isAdmin && <View style={styles.btnsAdm}>
                                <TouchableOpacity onPress={() => this.alertCheckDeleteItem()}>
                                    <Image style={styles.btnsAdmImg} source={require('../../assets/images/Delete/delete.png')}/>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>Sugerencia por: {this.state.nombre}</Text>
                            <Text>Correo: {this.state.email}</Text>
                            <Text>{this.state.comentario}</Text>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <Text>Fecha: {this.state.fecha}</Text>
                    </CardItem>
                    <View style={styles.button}>
                        <CustomButton
                            style="DangerBorder"
                            name="Cerrar"
                            clicked={() => this.showItemList()} />
                    </View>
                </Card>
            </View>
        );
        return (
            <ScrollView>
                {!this.state.showItemCard ? listSuggestions : card}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listSuggestions: {
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