import React from 'react';
import { View, Dimensions } from 'react-native';
import PDF from 'react-native-pdf';
import CustomButton from '../CustomButton/CustomButton';

const manual = (props) => {
    const source = { uri: props.url };

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <PDF
                source={source}
                onLoadComplete={(numberOfPages,filePath)=>{
                    console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages)=>{
                    console.log(`current page: ${page}`);
                }}
                onError={(error)=>{
                    console.log(error);
                }}
                style={{ flex: 1, width: Dimensions.get('window').width }}/>
        </View>
    );
}

export default manual;