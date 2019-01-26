import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CardItem, CheckBox } from 'native-base';

export default class CustomQuestion extends Component {

    state = {
        survey: [],
        selected1: false,
        selected2: false,
        selected3: false
    }
    
    answerSelectedHandler1 = () => {
        this.setState({selected1: true, selected2: false, selected3: false});
    }
    answerSelectedHandler2 = () => {
        this.setState({selected1: false, selected2: true, selected3: false});
    }
    answerSelectedHandler3 = () => {
        this.setState({selected1: false, selected2: false, selected3: true});
    }
    render() {
        let question = body = inc1 = inc2 = inc3 = button = null;

        if (this.props.question !== null) {
            question = (
                <View>
                    <CardItem key={this.props.question.pregunta}>
                        <Text>{this.props.question.pregunta}</Text>
                    </CardItem>
                </View>
            );

            inc1 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"1.- " + this.props.question.inc1}</Text>
                    <TouchableOpacity style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10}} hitSlop={styles.hitSlop} onPress={() => this.answerSelectedHandler1()}>
                        <CheckBox checked={this.state.selected1} onPress={() => this.answerSelectedHandler1()} />
                    </TouchableOpacity>
                </View>
            );
            inc2 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"2.- " + this.props.question.inc2}</Text>
                    <TouchableOpacity style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10 }} hitSlop={styles.hitSlop} onPress={() => this.answerSelectedHandler2()}>
                        <CheckBox checked={this.state.selected2} onPress={() => this.answerSelectedHandler2()} />
                    </TouchableOpacity>
                </View>
            );
            inc3 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"3.- " + this.props.question.inc3}</Text>
                    <TouchableOpacity style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10}} hitSlop={styles.hitSlop} onPress={() => this.answerSelectedHandler3()} >
                        <CheckBox checked={this.state.selected3} onPress={() => this.answerSelectedHandler3()} />
                    </TouchableOpacity>
                </View>
            );


            body = (
                <CardItem>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        {inc1}
                        {inc2}
                        {inc3}
                    </View>
                </CardItem>
            );

        }

        return (
            <View key="form" >
                {question}
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