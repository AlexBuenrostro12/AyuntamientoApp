import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CardItem, CheckBox } from 'native-base';

export default class CustomQuestion extends Component {

    state = {
        survey: [],
        selected1: false,
        selected2: false,
        selected3: false,
        prueba: ''
    }
    
    
    render() {
        let question = body = inc1 = inc2 = inc3 = button = null;

        if (this.props.question !== null) {
            // question = (
            //     <View>
            //         <CardItem>
            //             <Text>{this.props.question}</Text>
            //         </CardItem>
            //     </View>
            // );

            inc1 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"1.- " + this.props.inc1}</Text>
                    <TouchableOpacity 
                        style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10}} 
                        hitSlop={styles.hitSlop} >
                        <CheckBox 
                            checked={this.state.selected1} />
                    </TouchableOpacity>
                </View>
            );
            inc2 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"2.- " + this.props.inc2}</Text>
                    <TouchableOpacity 
                        style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10 }} 
                        hitSlop={styles.hitSlop} >
                        <CheckBox 
                            checked={this.state.selected2} />
                    </TouchableOpacity>
                </View>
            );
            inc3 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"3.- " + this.props.inc3}</Text>
                    <TouchableOpacity 
                        style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10}} 
                        hitSlop={styles.hitSlop} >
                        <CheckBox 
                            checked={this.state.selected3} />
                    </TouchableOpacity>
                </View>
            );


            body = (
                <CardItem>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        {inc1}
                        {inc2}
                        {inc3}
                        <Text>{this.state.prueba}</Text>
                    </View>
                </CardItem>
            );

        }

        return (
            <View>
                {/* {question} */}
                {body}
            </View>
        )
    }
}



styles = StyleSheet.create({
    hitSlop: {
        top: 8,
        bottom: 8,
        left: 10,
        right: 10,
    }
})