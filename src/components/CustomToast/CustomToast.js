import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Toast, Root } from 'native-base';

const CustomToast = ( props ) => {
    
    let toast = null;

    switch (props.type) {
        case ( 'success' ):
            if (props.show) {
                toast = (
                    Toast.show({
                        type: ""+props.type,
                        text: ""+props.text,
                        buttonText: "Okay",
                        position: "bottom"
                    })
                );    
            }
        break;

        case ( 'warning' ):
            if (props.show){
                toast = (
                    Toast.show({
                        text: props.text,
                        buttonText: "Okay",
                        type: props.type,
                        position: "bottom"
                    })
                );
            }
        break;

        case ( 'danger' ):
            if (props.show) {
                toast = (
                    Toast.show({
                        type: ""+props.type,
                        text: ""+props.text,
                        buttonText: "Okay",
                        position: "bottom"
                    })
                );    
            }  
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



