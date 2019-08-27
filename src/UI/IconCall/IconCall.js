import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import call from '../../assets/images/Call/call.png';

const iconCall = ( props ) => (
    <TouchableOpacity onPress={() => Communications.phonecall(props.number, props.called)}>
        <Image 
            style={styles.icon} 
            source={call} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    icon: {
        height: 25,
        width: 25,
      },
});

export default iconCall;