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
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 }}>
                <CustomButton
                    style="SuccessBorder"
                    clicked={null}
                    name="Enviar"
                    send={true} />
                <CustomButton
                    style="DangerBorder"
                    clicked={() => this.showItemList()}
                    name="Cerrar" />
            </View>
        );
        const card = (
            <View>
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
                                question={q.config.pregunta}
                                inc1={q.config.inc1}
                                inc2={q.config.inc2}
                                inc3={q.config.inc3} />
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
