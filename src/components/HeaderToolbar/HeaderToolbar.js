import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Title } from 'native-base';
import IconMenu from '../../UI/IconMenu/IconMenu';

const headerToolbar = (props) => {
    let { height, width } = Dimensions.get('window');
    const toolbar = (
        <View style={{ flex: 1, height: height / 11, width: width, backgroundColor: 'grey', padding: 5 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{ justifyContent: 'center', marginRight: 25 }}>
                    <IconMenu open={props.open} />
                </View>
                <View style={styles.view}>
                    <Text style={styles.text}>{props.title}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View>
            {toolbar}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 22,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    view: {
        padding: 5,
        justifyContent: 'center'
    }
});

export default headerToolbar;
