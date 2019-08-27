import React, { Component } from 'react';
import { Text, ScrollView } from 'react-native';
import { Card, CardItem, Thumbnail, Left, Body } from 'native-base';
import styled from 'styled-components/native';
import CustomCardItemTitle from '../CustomCardItemTitle/CustomCardItemTitle';

const StyledView = styled.View`
    flex: ${props => props.theme.flex};
    flex-direction: column;
`;

const StyledViewCards = styled.View`
    flex: ${props => props.theme.flex};
    flex-direction: row;
    margin: ${props => props.theme.margin};
`;

const StyledImage = styled.Image`
    flex: ${props => props.theme.flex};
    height: 250;
    width: 250;
`;

const StyledViewCardTitle = styled.View`
    flex: ${props => props.theme.flex};
    margin: ${props => props.theme.margin};
`;

export default class DeckSwipe extends Component {
    state = {
        cards: [
            {
                name: 'Card one',
                text: 'Im the first card of the deck',
                image: require('../../assets/images/Ayuntamiento/ayuntamiento.jpg')
            },
            {
                name: 'Card two',
                text: 'Im the second card of the deck',
                image: require('../../assets/images/Ayuntamiento/ayuntamiento.jpg')
            },
            {
                name: 'Card tree',
                text: 'Im the third card of the deck',
                image: require('../../assets/images/Ayuntamiento/ayuntamiento.jpg')
            },
            {
                name: 'Card four',
                text: 'Im the fourt card of the deck',
                image: require('../../assets/images/Ayuntamiento/ayuntamiento.jpg')
            }

        ]
    }

    render() {
        const titleGabinete = (
            <StyledViewCardTitle>
                <Card>
                    <CustomCardItemTitle
                        title="Gabinete"
                        description="Deslice y conozca
                            los funcionarios publicos y sus puestos."
                        image={require('../../assets/images/Home/home.png')} />
                </Card>
            </StyledViewCardTitle>
        );

        const scrollBanner = (
            <StyledViewCards>
                {this.state.cards.map(item => (
                    <Card key={item.name} style={{ width: 300 }}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={item.image} />
                                <Body>
                                    <Text>{item.name}</Text>
                                    <Text note>Regidor</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <StyledImage resizeMode="contain" source={item.image} />
                        </CardItem>
                        <CardItem>
                            <Text>{item.text}</Text>
                        </CardItem>
                    </Card>
                ))}
            </StyledViewCards>
        );

        return (
            <StyledView>
                <ScrollView horizontal={false}>
                    {titleGabinete}
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        {scrollBanner}
                    </ScrollView>
                </ScrollView>
            </StyledView>
        );
    }
}