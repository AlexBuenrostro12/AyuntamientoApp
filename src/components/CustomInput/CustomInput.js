import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Item, Input, Label, Textarea, Content } from 'native-base';

const customInput = ( props ) => {
    
    let input = null;

    switch (props.itemType) {
        case 'FloatingLabel':
            input = (
                <Item floatingLabel>
                    <Label>{props.holder}</Label>
                    <Input
                        onChangeText={props.changed}/>
                </Item>
            );
        break;
        case 'Textarea':
            input = (
                <Textarea rowSpan={8} bordered placeholder={props.holder}
                    onChangeText={props.changed}/>
            );
        break;
        case 'Fecha':
            input = null;
        break;
    
        default:
            input = (
                <Item floatingLabel>
                    <Label>Defaul input</Label>
                    <Input />
                </Item>
            );
        break;
    }

    return(
        <View style={styles.inputElement}>
            {input}
        </View>
    );
}

const styles = StyleSheet.create({
    inputElement: {
        padding: 5
    }
})

export default customInput;