import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { Item, Input, Label, Textarea, DatePicker, Picker } from 'native-base';
import { normalize } from '../AuxiliarFunctions/FontResponsive';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';

const customInput = ( props ) => {
    
    let input = null;
    let image = (
        props.image && <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <Image
                source={props.image}
                style={{ height: 160, width: 200 }} />
            <Text style={{ fontSize: 16, color: 'grey' }}>{props.name}</Text>
        </View>
    );
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
        case 'FloatingLabelWhite':
            input = (
                <Item floatingLabel>
                    <Label style={{ color: 'white', fontSize: normalize(15) }}>{props.holder}</Label>
                    <Input
                        style={{ color: 'white' }}
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
        case 'PickerSchedule':
                input = (
                    <Picker
                            mode="dropdown"
                            iosHeader={props.value}
                            iosIcon={<Image style={{ width: 25, height: 25 }} source={require('../../assets/images/ArrowDown/arrow-down.png')} />}
                            style={{ width: undefined }}
                            selectedValue={props.value}
                            onValueChange={props.changed}
                        >
                            <Picker.Item label="Matutino" value="Matutino" />
                            <Picker.Item label="Vespertino" value="Vespertino" />
                    </Picker>
                );
        break;
        case 'LoadImage':
            input = (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                    {image}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F3F2F1', borderRadius: 5, paddingLeft: 10, paddingRight: 10 }}>
                        <Image
                            style={{ height: 30, width: 30 }}
                            source={require('../../assets/images/Imagen/image.png')} />
                        <Text style={{ fontSize: 20 }}>{props.holder}</Text>
                        <TouchableOpacity onPress={props.loadPhoto}>
                            <Image
                                style={{ height: 30, width: 30 }}
                                source={require('../../assets/images/Add/add.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
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