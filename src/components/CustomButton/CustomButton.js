import React from 'react';
import RN ,{ View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';

const customButton = (props) => {

    let button = null;

    switch (props.style) {
        case ('Info'):
            button = (
                <Button block info
                    onPress={props.clicked}>
                    <Text style={styles.text}>{props.name}</Text>
                </Button>
            );
            break;

        case ('Success'):
            button = (
                <RN.Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#869E25" />
            );
            break;

        case ('Danger'):
            button = (
                <RN.Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#E0013F" />
            );
            break;

        case ('SuccessBorder'):
            button = (
                <Button bordered success block
                    onPress={props.clicked}>
                    <Text style={styles.text}>{props.name}</Text>
                </Button>
            );
            break;

        case ('DangerBorder'):
            button = (
                <RN.Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#E0013F" />
            );
            break;

        case 'Login': 
            button = (
                <RN.Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#878787" />
            );
            break;

        case 'Emergencia': 
            button = (
                <RN.Button
                    onPress={props.clicked}
                    title={props.name}
                    color="red" />
            );
            break;
        default:
            button = (
                <Button block success
                    onPress={props.clicked}>
                    <Text style={styles.text}>{props.name}</Text>
                </Button>
            );
            break;
    }

    return (
        <View style={styles.buttonStyle}>
            {button}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontWeight: '500'
    },
    buttonStyle: {
        padding: 5,
        flexGrow: 1
    }
});

export default customButton;



