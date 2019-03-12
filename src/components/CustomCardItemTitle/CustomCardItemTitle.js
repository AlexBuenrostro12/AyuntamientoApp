import React from 'react';
import { Text, View, Image } from 'react-native';
import { CardItem } from 'native-base';

const customCardItemTitle = (props) => (
    <CardItem header bordered>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginTop: 18 }}>
                <Text style={{ color: 'orange', fontSize: 18 }}>{props.title}</Text>
                <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 14 }}>{props.description}</Text>
            </View>
            <Image style={{ resizeMode: 'contain', height: 100, width: 95 }} source={props.image} />
        </View>
    </CardItem>
);

export default customCardItemTitle;