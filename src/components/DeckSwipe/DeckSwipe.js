import React, { Component } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { DeckSwiper, Card, CardItem, Thumbnail, Left, Body } from 'native-base';

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

    render(){
        return(
            <View style={styles.container}>
                <DeckSwiper 
                    dataSource={this.state.cards}
                    renderItem={ item =>
                        <Card style={styles.card}>
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
                                <Image style={styles.image} source={item.image} />
                            </CardItem>
                            <CardItem>
                                <Text>{item.text}</Text>
                            </CardItem>
                        </Card>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        elevation: 3
    },
    image: {
        flex: 1,
        height: 300
    }
});