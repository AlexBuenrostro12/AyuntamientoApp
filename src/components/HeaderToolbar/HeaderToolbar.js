import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Header, Left, Right, Body, Title } from 'native-base';
import IconMenu from '../../UI/IconMenu/IconMenu';

const headerToolbar = (props) => {
    let { height, width } = Dimensions.get('window');
    const firtToolbar = (
        <Header>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Left>
                    <IconMenu open={props.open} />
                </Left>
                <Body style={styles.view}>
                    <Title style={styles.text}>{props.title}</Title>
                </Body>
                <Right>
                    {/* Could be other button */}
                </Right>
            </View>
        </Header>
    );
    const secondToolbar = (
        <View style={{ flex: 1, height: height / 11, width: width, backgroundColor: 'grey', padding: 5 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{ justifyContent: 'center', marginRight: 25 }}>
                    <IconMenu open={props.open} />
                </View>
                <View style={styles.view}>
                    <Title style={styles.text}>{props.title}</Title>
                </View>
            </View>
        </View>
    );

    return (
        <View>
            {secondToolbar}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
        padding: 5,
        justifyContent: 'center'
    }
});

export default headerToolbar;
