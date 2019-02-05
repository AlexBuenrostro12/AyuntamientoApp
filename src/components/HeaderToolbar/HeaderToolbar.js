import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, Left, Right, Body, Title } from 'native-base';
import IconMenu from '../../UI/IconMenu/IconMenu';

const headerToolbar = (props) => (
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

const styles = StyleSheet.create({
    text: {
        fontSize: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
        padding: 5
    }
});

export default headerToolbar;
