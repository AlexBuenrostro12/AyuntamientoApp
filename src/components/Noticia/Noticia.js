import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Text, Left, Right, Card, CardItem, Body } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';

export default class Noticia extends Component {
    state = {
        nombre: null,
        categoria: null,
        descripcion: null,
        fecha: null,
        showItemCard: false
    }

    clickedListHandler = (identifier) => {
        let noticia = [];
        for (let dataName in this.props.data) {
            if (this.props.data[dataName] === identifier) {
                this.setState({ nombre: this.props.data[dataName] });
                this.setState({ categoria: this.props.data['categoria'] });
                this.setState({ descripcion: this.props.data['descripcion'] });
                this.setState({ fecha: this.props.data['fecha'] });
            }
        }
        this.setState({ noticia: noticia, showItemCard: true });
    }

    showItemList = () => {
        this.setState({ showItemCard: false })
    }

    render() {

        const data = [];
        for (let dataName in this.props.data) {
            if (dataName === 'nombre') {
                data.push({
                    name: this.props.data[dataName]
                })
            }
        }
        const listNews = (
            <View style={{ marginTop: 5, marginLeft: 2, marginRight: 2, marginBottom: 5 }}>
                {data.map(dt => (
                    <ListItem key={dt.name}>
                        <Left>
                            <TouchableOpacity onPress={() => this.clickedListHandler(dt.name)}>
                                <Text>{dt.name}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <IconRight describe={() => this.clickedListHandler(dt.name)} />
                        </Right>
                    </ListItem>
                ))}
            </View>
        );
        const card = (
            <View style={styles.card}>
                <Card>
                    <CardItem header>
                        <Text>{this.state.nombre} / {this.state.categoria}</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>{this.state.descripcion}</Text>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <Text>{this.state.fecha}</Text>
                    </CardItem>
                    <View style={{ flex: 1, flexGrow: 1, marginTop: 5, marginBottom: 5 }}>
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
                {!this.state.showItemCard ? listNews : card}
            </ScrollView>
        );
    }
}