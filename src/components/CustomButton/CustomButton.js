import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

const customButton = (props) => {

    let button = null;

    switch (props.style) {

        case ('Success'):
            button = (
                <Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#869E25" />
            );
            break;

        case ('Danger'):
            button = (
                <Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#E0013F" />
            );
            break;

        case ('DangerBorder'):
            button = (
                <Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#E0013F" />
            );
            break;

        case 'Login': 
            button = (
                <Button
                    onPress={props.clicked}
                    title={props.name}
                    color="#878787" />
            );
            break;

        case 'Emergencia': 
            button = (
                <Button
                    onPress={props.clicked}
                    title={props.name}
                    color="red" />
            );
            break;
        default:
            button = (
                <Button
                    onPress={props.clicked}
                    title={props.name}
                    color="blue" />
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



