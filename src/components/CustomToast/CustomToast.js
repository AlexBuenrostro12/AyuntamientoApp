import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Toast, Root } from 'native-base';

const CustomToast = ( props ) => {
    
    let toast = null;

    switch (props.type) {
        case ( 'success' ):
            toast = (
                Toast.show({
                    text: props.text,
                    type: props.type,
                    position: "bottom",
                    duration: 3000
                })
            );
        break;

        case ( 'warning' ):
            toast = (
                Toast.show({
                    text: props.text,
                    type: props.type,
                    position: "bottom",
                    duration: 3000
                })
            );
        break;

        case ( 'danger' ):
            toast = (
                Toast.show({
                    text: props.text,
                    type: props.type,
                    position: "bottom",
                    duration: 3000
                })
            );  
        break;
    }

    return (
        <View style={styles.buttonStyle}>
            {toast}
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

export default CustomToast;



