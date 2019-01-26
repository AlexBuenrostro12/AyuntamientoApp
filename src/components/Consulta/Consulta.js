import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Left, Right, Card, CardItem, Body, CheckBox, Form } from 'native-base';
import IconRight from '../../UI/IconRight/IconRight';
import CustomQuestion from './CustomQuestion/CustomQuestion';
import CustomButton from '../CustomButton/CustomButton';


export default class Consulta extends Component {
    state = {
        questions: [],
        showCard: false,
        survey: null,
        surveyResult: [],
        form: {

        }
    }

    clickListHandler = (identifier) => {
        const questions = [];
        for (let dataName in this.props.data) {
            if (this.props.data[dataName] !== identifier) {
                questions.push({
                    id: dataName,
                    config: this.props.data[dataName]
                });
            }
        }
        this.setState({ questions: questions, showCard: true, survey: identifier });
    }
    showItemList = () => {
        this.setState({ showCard: false });
    }
    clickedAnswerHandler = (question, answer) => {
        const surveyResult = [];
        this.setState({ checked1: true })
    }

    answerSelectedHandler = (indentifier) => {

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
        const buttons = (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5}}>
                <CustomButton
                    style="SuccessBorder"
                    clicked={null}
                    name="Enviar" />
                <CustomButton 
                    style="DangerBorder"
                    clicked={() => this.showItemList()}
                    name="Cerrar" />
            </View>
        );
        const card = (
            <View key="card" style={styles.card}>
                <TouchableOpacity onPress={() => this.showItemList()}>
                    <Card>
                        <View key="surver" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.survey}</Text>
                        </View>
                        {this.state.questions.map(q => (
                            <CustomQuestion
                                id={q.id}
                                question={q.config}
                                survey={this.state.survey}
                                selected={() => this.answerSelectedHandler(q.id)} />
                        ))}
                        {buttons}

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
    },
    hitSlop: {
        top: 20,
        bottom: 20,
        left: 50,
        right: 50,
    }
});
