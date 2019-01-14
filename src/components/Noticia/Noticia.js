import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Text, Separator, Content, Left, Right } from 'native-base';
import CustomToast from '../CustomToast/CustomToast';
import IconRight from '../../UI/IconRight/IconRight';

export default class Noticia extends Component {
    state = {
        listItems: null
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
                <ListItem key={dt.name}>
                    <Left>
                        <Text>{dt.name}</Text>
                    </Left>
                    <Right>
                        <TouchableOpacity> 
                            <IconRight />
                        </TouchableOpacity>
                    </Right>
                </ListItem>
            );
        })
        //add onPress evento to TouchableOpacity
        return (
            <View>
                {list}
            </View>
        );
    }     
}

const styles = StyleSheet.create({

});
