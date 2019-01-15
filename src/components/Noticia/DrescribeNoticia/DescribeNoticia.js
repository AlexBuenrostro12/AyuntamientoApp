import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardItem, Body } from 'native-base';

const describeNoticia = ( props ) => {

    return(
        <Card>
            <CardItem header>
              <Text>NativeBase</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  //Your text here
                </Text>
              </Body>
            </CardItem>
            <CardItem footer>
              <Text>GeekyAnts</Text>
            </CardItem>
         </Card>
    );
}

export default describeNoticia;