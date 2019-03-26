import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import PDF from 'react-native-pdf';
import CustomButton from '../CustomButton/CustomButton';

const manual = (props) => {
    const source = { uri: props.url };
    const button = (
        <CustomButton
            style="DangerBorder"
            clicked={() => props.goBack.navigation.navigate('Manuales')}
            name="Cerrar" />
    );
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            overflow: 'hidden',
            flexGrow: 2
        }}>
            <PDF
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    flexGrow: 2
                }} />
        </View>
    );
}

export default manual;