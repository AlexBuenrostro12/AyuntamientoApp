import React from 'react';
import { StyleSheet } from 'react-native';
import { Fab } from 'native-base';
import IconCall from '../IconCall/IconCall';

export default class FAB extends React.Component {
    state = {
        called: false,
        number: '3411381787'
    }
    render(){
        return (
        
            <Fab active={this.state.active}
                style={styles.fab}
                position="bottomRight"
                onPress={() => this.setState({ called: !this.state.called })}>
                <IconCall 
                    called={this.state.called}
                    number={this.state.number} />
            </Fab>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1
    },
    fab: {
        backgroundColor: 'red'
    }
});