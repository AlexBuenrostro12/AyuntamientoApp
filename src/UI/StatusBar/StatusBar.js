import React from 'react';
import { StatusBar } from 'react-native';

const statusBar = ( props ) => {
    return (
        <StatusBar
            backgroundColor={props.color}
            barStyle="light-content" />
    );
};

export default statusBar;