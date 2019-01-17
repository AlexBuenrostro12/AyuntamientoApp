import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Text, Left, Right, Button, Card, CardItem, Body } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';

export default class Noticia extends Component {
    state = {
        nombre: null,
        categoria: null,
        descripcion: null,
        fecha: null,
        showItemCard: false
    }

    clickedListHandler = ( identifier ) => {
        let noticia = [];
        for(let dataName in this.props.data) {
            if(this.props.data[dataName] === identifier) {
                this.setState({nombre: this.props.data[dataName]});
                this.setState({categoria: this.props.data['categoria']});
                this.setState({descripcion: this.props.data['descripcion']});
                this.setState({fecha: this.props.data['fecha']});
            }
        }
        this.setState({ noticia: noticia, showItemCard: true });
    }

    showItemList = () => {
        this.setState({showItemCard: false})
    }
    
    render() {

        const data = [];
        for(let dataName in this.props.data){
            if (dataName === 'nombre') {
                data.push({
                    name: this.props.data[dataName]
                })
            }
        }
        const list = data.map(dt => {
            return (
                <View key={dt.name} style={styles.list}>
                    <ListItem key={dt.name}>
                        <Left>
                            <Text>{dt.name}</Text>
                        </Left>
                        <Right>
                            <IconRight describe={() => this.clickedListHandler(dt.name)}/>
                        </Right>
                    </ListItem>
                </View>
            );
        })
        //add onPress evento to TouchableOpacity
            const card = (
                <View style={styles.card}>
                    <TouchableOpacity onPress={() => this.showItemList()}>
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
                        </Card> 
                    </TouchableOpacity>
                </View>
            );

        return (
            <ScrollView>
                {!this.state.showItemCard ? list : card}
            </ScrollView>
        );
    }     
}

const styles = StyleSheet.create({
    card: {
        padding: 5
    },
    list: {
        padding: 5
    }
});
