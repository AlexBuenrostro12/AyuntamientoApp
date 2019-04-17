import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, View } from 'react-native';
import { ListItem, Text, Left, Right, Card, CardItem, Body } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';

export default class Noticia extends Component {
    state = {
        actividad: null,
        hora: null,
        descripcion: null,
        fecha: null,
        showItemCard: false
    }

    clickedListHandler = (identifier) => {
        for (let dataName in this.props.data) {
            const fecha = this.props.data['fecha'].split("T", 1);
            if (this.props.data[dataName] === identifier) {
                this.setState({ actividad: this.props.data[dataName] });
                this.setState({ hora: this.props.data['hora'] });
                this.setState({ descripcion: this.props.data['descripcion'] });
                this.setState({ fecha: fecha });
            }
        }
        this.setState({ showItemCard: true });
    }

    showItemList = () => {
        this.setState({ showItemCard: false })
    }

    render() {

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
                            <TouchableOpacity onPress={() => this.clickedListHandler(dt.actividad)}>
                                <Text>{dt.actividad}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <IconRight describe={() => this.clickedListHandler(dt.actividad)} />
                        </Right>
                    </ListItem>
                ))}
            </View>
        );
        const card = (
            <View>
                <Card>
                    <CardItem header>
                        <Text>{this.state.actividad}</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>{this.state.descripcion}</Text>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <Text>Fecha: {this.state.fecha} / Hora: {this.state.hora}</Text>
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
                {!this.state.showItemCard ? listActivities : card}
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
});