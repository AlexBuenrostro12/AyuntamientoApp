import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Left, Right } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';

export default class Consulta extends Component {
    state = {

    }

    render() {
        const data = [];
        for( let dataName in this.props.data ) {
            if (dataName === 'nombre') {
                data.push({
                    name: this.props.data[dataName]
                })
            }
        }
        const list = data.map(dt => (
            <View key={dt.name} style={styles.list}>
                <ListItem key={dt.name}>
                    <Left>
                        <TouchableOpacity>
                            <Text>{dt.name}</Text>
                        </TouchableOpacity>
                    </Left>
                    <Right>
                        <IconRight />
                    </Right>
                </ListItem>
            </View>
        ));
        return(
            <ScrollView>
                {list}
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
