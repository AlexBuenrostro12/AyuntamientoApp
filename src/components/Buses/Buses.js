import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ListItem, Card, CardItem, Body } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';

export default class Buses extends Component {

    state = {
        bus: [],
        showItemCard: false
    }

    clickedListHandler = (identifier) => {
        const bus = [];
        for (let dataName in this.props.data) {
            if (this.props.data[dataName].horaSalida === identifier) {
                bus.push({
                    ...this.props.data[dataName]
                });
            }
        }
        this.setState({ bus: bus, showItemCard: true });
    }
    showItemList = () => {
        this.setState({ showItemCard: false });
    }

    render() {
        const data = [];
        for (let dataName in this.props.data) {
            data.push({
                destino: this.props.data[dataName].destino,
                horaSalida: this.props.data[dataName].horaSalida
            });
        }
        const listBuses = (
            <View style={{ flex: 1 }}>
                {data.map(dt => (
                    <ListItem key={dt.destino}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => this.clickedListHandler(dt.horaSalida)}>
                                <Text>{dt.destino} - {dt.horaSalida}</Text>
                            </TouchableOpacity>
                            <IconRight describe={() => this.clickedListHandler(dt.horaSalida)} />
                        </View>
                    </ListItem>
                ))}
            </View>
        );
        const cardBuses = (
            <View style={{ flex: 1, marginBottom: 50 }}>
                {this.state.bus.map(bs => (
                    <Card key={bs.chofer}>
                        <CardItem header>
                            <Text>{bs.destino} - {bs.horario}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>Camión: {bs.camion}</Text>
                                <Text>Chofer: {bs.chofer}</Text>
                                <Text>Salida: {bs.horaSalida}</Text>
                                <Text>Regreso: {bs.horaRegreso}</Text>
                            </Body>
                        </CardItem>
                        <CardItem footer>
                            <Text>Información.</Text>
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
            <View>
                {!this.state.showItemCard ? listBuses : cardBuses}
            </View>
        );
    }
}