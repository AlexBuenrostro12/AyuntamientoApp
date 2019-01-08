import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';

const customButton = ( props ) => {
    
    let button = null;

    switch (props.style) {
        case ( 'Success' ):
            button = (
                <Button block success
                    onPress={props.clicked}>
                    <Text style={styles.text}>{props.name}</Text>
                </Button>
            );    
        break;

        case ( 'Danger' ):
            button = (
                <Button block danger>
                    <Text style={styles.text}>{props.name}</Text>
                </Button>
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
    text:{
        fontWeight: 'bold'
    },
    buttonStyle: {
        padding: 5
    }
});

export default customButton;



