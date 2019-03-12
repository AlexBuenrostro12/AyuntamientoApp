import React, { Component } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Text, Left, Right, Card, CardItem, Body } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomButton from '../CustomButton/CustomButton';
import styled from 'styled-components';

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
        this.setState({ showItemCard: true });
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
            <StyledListNews>
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
            </StyledListNews>
        );
        const card = (
            <StyledCard>
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