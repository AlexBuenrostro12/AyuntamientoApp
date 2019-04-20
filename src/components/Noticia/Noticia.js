import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, View, Image, Alert } from 'react-native';
import { ListItem, Text, Left, Right, Card, CardItem, Body } from 'native-base';
import styled from 'styled-components';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';
import axios from '../../../axios-ayuntamiento';

const StyledListNews = styled.View`
    margin-left: 2px;
    margin-right: 2px;
    margin-top: ${props => props.theme.customMarginValue};
    margin-bottom: ${props => props.theme.customMarginValue};
`;

const StyledCard = styled.View``;

const StyledButton = styled.View`
    flex: ${props => props.theme.commonFlex};
    flex-grow: 1;
    margin-top: ${props => props.theme.customMarginValue};
    margin-bottom: ${props => props.theme.customMarginValue};
`;

export default class Noticia extends Component {
    state = {
        noticia: null,
        categoria: null,
        descripcion: null,
        fecha: null,
        itemKey: null,
        showItemCard: false
    }

    clickedListHandler = (identifier, key) => {
        for (let dataName in this.props.data) {
            const fecha = this.props.data['fecha'].split("T", 1);
            if (this.props.data[dataName] === identifier) {
                this.setState({ noticia: this.props.data[dataName] });
                this.setState({ categoria: this.props.data['categoria'] });
                this.setState({ descripcion: this.props.data['descripcion'] });
                this.setState({ fecha: fecha });
                this.setState({ itemKey: key });
            }
        }
        this.setState({ showItemCard: true });
    }

    showItemList = () => {
        this.setState({ showItemCard: false })
    }

    deleteItemListHandler = () => {
        console.log('deleteItemListHandler:res: ', this.props.token, this.state.itemKey);
        axios
			.delete('/news' + '/' + this.state.itemKey + '.json?auth=' + this.props.token)
			.then((response) => {
                console.log('deleteItemListHandler:res: ', response);
				Alert.alert('Noticia', 'Noticia eliminada con exito!', [ { text: 'Ok', onPress: () => this.refreshItemsHandler() } ], {
					cancelable: false
				});
			})
			.catch((error) => {
                console.log('deleteItemListHandler:res: ', error)
				Alert.alert('Noticia', 'Noticia fallida al eliminar!', [ { text: 'Ok' } ], {
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
            if (dataName === 'noticia') {
                data.push({
                    noticia: this.props.data[dataName]
                })
            }
        }
        const listNews = (
            <StyledListNews>
                {data.map(dt => (
                    <ListItem key={dt.noticia}>
                        <Left>
                            <TouchableOpacity onPress={() => this.clickedListHandler(dt.noticia, this.props.id)}>
                                <Text>{dt.noticia}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <IconRight describe={() => this.clickedListHandler(dt.noticia, this.props.id)} />
                        </Right>
                    </ListItem>
                ))}
            </StyledListNews>
        );
        const card = (
            <StyledCard>
                <Card>
                    <CardItem header>
                        <View style={styles.btnsContainer}>
                            <Text>{this.state.noticia} / {this.state.categoria}</Text>
                            {this.props.isAdmin && <View style={styles.btnsAdm}>
                                <TouchableOpacity onPress={() => this.deleteItemListHandler()}>
                                    <Image style={styles.btnsAdmImg} source={require('../../assets/images/Delete/delete.png')}/>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>{this.state.descripcion}</Text>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <Text>Fecha: {this.state.fecha}</Text>
                    </CardItem>
                    <StyledButton>
                        <CustomButton
                            style="DangerBorder"
                            name="Cerrar"
                            clicked={() => this.showItemList()} />
                    </StyledButton>
                </Card>
            </StyledCard>
        );
        return (
            <ScrollView>
                {!this.state.showItemCard ? listNews : card}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
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
})