import React from 'react';
import { StyleSheet } from 'react-native';
import { Header, Left, Right, Container } from 'native-base';
import IconMenu from '../../UI/IconMenu/IconMenu';

const headerToolbar = ( props ) => (
    <Header style={styles.header}>
        <Left>
            <IconMenu open={props.open}/>
        </Left>
        <Right>

        </Right>
    </Header>
);

const styles = StyleSheet.create({
    header: {
        
    }
});

export default headerToolbar;
