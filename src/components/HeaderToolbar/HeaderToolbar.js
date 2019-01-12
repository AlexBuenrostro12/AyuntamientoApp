import React from 'react';
import { StyleSheet } from 'react-native';
import { Header, Left, Right, Container, Body, Title, View } from 'native-base';
import IconMenu from '../../UI/IconMenu/IconMenu';

const headerToolbar = ( props ) => (
    <Header>
        <Left>
            <IconMenu open={props.open}/>
        </Left>
        <Body style={styles.view}>
            <Title style={styles.text}>{props.title}</Title>
        </Body>
        <Right></Right>
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
