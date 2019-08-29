import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

const KBAvoiding = (props) => (
    <KeyboardAvoidingView style={{ flex: 1 }} enabled>
        {props.children}
    </KeyboardAvoidingView>
);

export default KBAvoiding;