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
        sendSurvey: false

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
    showItemListHandler = () => {
        this.setState({ showCard: false, sendSurvey: false });
    }
    sendSurveyHandler = () => {
        this.setState({ sendSurvey: true });
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
                            <Text style={{ fontSize: 16 }}>{dt.name}</Text>
                        </TouchableOpacity>
                    </Left>
                    <Right>
                        <IconRight describe={() => this.clickListHandler(dt.name)} />
                    </Right>
                </ListItem>
            </View>
        ));
        const buttons = (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 }}>
                <CustomButton
                    style="SuccessBorder"
                    clicked={() => this.sendSurveyHandler()}
                    name="Enviar"
                    send={true} />
                <CustomButton
                    style="DangerBorder"
                    clicked={() => this.showItemListHandler()}
                    name="Cerrar" />
            </View>
        );
        const card = (
            <View style={styles.card}>
                <Card style={styles.card}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ flex: 1, fontSize: 20, fontWeight: 'bold' }}>{this.state.survey}</Text>
                    </View>
                    {this.state.questions.map(q => (
                        <View key={q.id}>
                            <CardItem>
                                <Text>{q.config.pregunta}</Text>
                            </CardItem>
                            <CustomQuestion
                                key={q.id}
                                survey={this.state.survey}
                                question={q.config.pregunta}
                                inc1={q.config.inc1}
                                inc2={q.config.inc2}
                                inc3={q.config.inc3}
                                sendSurvey={this.state.sendSurvey}
                                token={this.props.token} />
                                {/* Missing send the survey response */}
                        </View>

                    ))}
                    {buttons}
                </Card>
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
