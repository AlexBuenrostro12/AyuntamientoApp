import React from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';

const customSpinner = ( props ) => {
    let spinner = null;
    spinner = (
        <Spinner color={props.color} />
    );

    return (
        <View>
            {spinner}
        </View>
    );
}

export default customSpinner;