import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Left, Right, Card, CardItem, Body, Radio } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';


export default class Consulta extends Component {
    state = {
        questions: [],
        showCard: false,
        selected: 'false',
        value: null
    }

    clickListHandler = (identifier) => {
        const questions = [];
        for (let dataName in this.props.data) {
            if (this.props.data[dataName] !== identifier) {
                questions.push({
                    ...this.props.data[dataName]
                });
            }
        }
        this.setState({ questions: questions, showCard: true });
    }
    showItemList = () => {
        this.setState({ showCard: false });
    }

    render() {
        const data = [];
        for (let dataName in this.props.data) {
            if (dataName === 'nombre') {
                data.push({
                    name: this.props.data[dataName]
                })
            }
        }
        const list = data.map(dt => (
            <View key={dt.name} style={styles.list}>
                <ListItem key={dt.name}>
                    <Left>
                        <TouchableOpacity onPress={() => this.clickListHandler(dt.name)}>
                            <Text>{dt.name}</Text>
                        </TouchableOpacity>
                    </Left>
                    <Right>
                        <IconRight />
                    </Right>
                </ListItem>
            </View>
        ));
        const incisosKey = [];
        for (let inc in this.state.questions) {
            if (this.state.questions[inc] !== 'pregunta') {
                incisosKey.push({
                    ...this.state.questions[inc]
                })
            }
        }
        // const card = (
        //     this.state.questions.map(q => (
        //         <View key={q.pregunta} style={styles.card}>
        //             <TouchableOpacity onPress={() => this.showItemList()}>
        //                 <Card>
        //                     <CardItem>
        //                         <Text>{q.pregunta}</Text>
        //                     </CardItem>
        //                     <CardItem>
        //                         <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        //                             {/* <Text>{Object.values(q).filter(inc => inc !== q.pregunta)}</Text> */}
        //                             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        //                                 <Text>{q.inc1}</Text>
        //                                 <TouchableOpacity onPress={() => this.setState({selected: 'true'})}>
        //                                     <Text>{this.state.selected}</Text>
        //                                 </TouchableOpacity>
        //                             </View>
        //                             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        //                                 <Text>{q.inc2}</Text>
        //                                 <Text>RadioButton</Text>
        //                             </View>
        //                             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        //                                 <Text>{q.inc3}</Text>
        //                                 <Text>RadioButton</Text>
        //                             </View>
        //                         </View>
        //                     </CardItem>
        //                 </Card>
        //             </TouchableOpacity>
        //         </View>
        //     ))
        // );
        const card = (
            <View key="card" style={styles.card}>
                <TouchableOpacity onPress={() => this.showItemList()}>
                    <Card>
                        {this.state.questions.map(q => (
                            <View key={q.pregunta}>
                                <CardItem>
                                    <Text>{q.pregunta}</Text>
                                </CardItem>
                                <CardItem>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                                        {/* <Text>{Object.values(q).filter(inc => inc !== q.pregunta)}</Text> */}
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>{q.inc1}</Text>
                                            <TouchableOpacity onPress={() => this.setState({ selected: 'true' })}>
                                                <Text>{this.state.selected}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>{q.inc2}</Text>
                                            <Text>RadioButton</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>{q.inc3}</Text>
                                            <Text>RadioButton</Text>
                                        </View>
                                    </View>
                                </CardItem>
                            </View>
                        ))}
                    </Card>
                </TouchableOpacity>
            </View>
        );
        return (
            <ScrollView>
                {!this.state.showCard ? list : card}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        padding: 5
    },
    list: {
        padding: 5
    }
});
