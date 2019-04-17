import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Item, Input, Label, Textarea, Content, DatePicker } from 'native-base';

const customInput = ( props ) => {
    
    let input = null;

    switch (props.itemType) {
        case 'FloatingLabel':
            input = (
                <Item floatingLabel>
                    <Label>{props.holder}</Label>
                    <Input
                        onChangeText={props.changed}
                        secureTextEntry={props.password}/>
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
        case 'Date':
            input = (
                <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date(2018, 1, 1)}
                    maximumDate={new Date(2022, 12, 31)}
                    locale={"es"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"calendar"}
                    placeHolderText={props.holder}
                    textStyle={{ color: "black" }}
                    placeHolderTextStyle={{ color: "black" }}
                    onDateChange={props.changed}
                    disabled={false}
                    />
            );
        break;
        case 'Hour': 
                input = (
                    <Item floatingLabel>
                        <Label>{props.holder}</Label>
                        <Input
                            value={props.value}
                            onTouchStart={props.changed1}/>
                    </Item>
                );
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