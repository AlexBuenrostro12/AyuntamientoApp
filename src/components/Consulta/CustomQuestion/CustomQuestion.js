import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CardItem, CheckBox } from 'native-base';
import axios from '../../../../axios-ayuntamiento';
import CustomButton from '../../CustomButton/CustomButton';

export default class CustomQuestion extends Component {

    state = {
        questions: [],
        selected1: false,
        selected2: false,
        selected3: false,
        prueba: '',
        pruebaFormArray: '):',
        sendSurvey: true
    }

    loadFormHandler = (question, answer) => {
        //Algorithm to add question and answer
        const questions = [...this.state.questions];
        const surveyObject = { pregunta: question, respuesta: answer };
        let insertObject = false;

        if (questions.length === 0) {
            questions.push({ ...surveyObject });
        }

        if (questions.length >= 1) {
            for (let key in questions) {
                if (questions[key].pregunta !== surveyObject.pregunta) {
                    insertObject = true;
                } else {
                    questions[key].respuesta = surveyObject.respuesta;
                    insertObject = false;
                }
            }
        }

        if (insertObject) {
            questions.push({ ...surveyObject });
        }

        this.setState({ questions: questions });
    }

    answerCheckedHandler = (question, answer, indexCheckBox) => {
        //Change the position of the checkbox
        switch (indexCheckBox) {
            case '1':
                this.setState({ selected1: true, selected2: false, selected3: false, prueba: answer, pruebaFormArray: question });
                this.loadFormHandler(question, answer);
                break;
            case '2':
                this.setState({ selected1: false, selected2: true, selected3: false, prueba: answer, pruebaFormArray: question });
                this.loadFormHandler(question, answer);
                break;
            case '3':
                this.setState({ selected1: false, selected2: false, selected3: true, prueba: answer, pruebaFormArray: question });
                this.loadFormHandler(question, answer);
                break;

            default:
                break;
        }
    }

    sendSurverResponse = (sendSurvey) => {
        if (sendSurvey) {

            const formData = {
                nombreEncuesta: this.props.survey,
                preguntas: this.state.questions
            };

            const survey = {
                surveyData: formData
            };

            axios.post('/surveysResponse.json?auth=' + this.props.token, survey)
                .then(response => {
                    //this.setState({ showSuccessToast: true });
                    //this.setTimeOut();
                })
                .catch(error => {
                    //this.setState({ showDangerToast: true });
                    //this.setTimeOut();
                });
        }
    }

    render() {
        this.sendSurverResponse(this.props.sendSurvey);

        let body = inc1 = inc2 = inc3 = buttons = null;

        if (this.props !== null) {

            inc1 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"1.- " + this.props.inc1}</Text>
                    <TouchableOpacity
                        onPress={() => this.answerCheckedHandler(this.props.question, this.props.inc1, '1')}
                        style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10 }}
                        hitSlop={styles.hitSlop} >
                        <CheckBox
                            onPress={() => this.answerCheckedHandler(this.props.question, this.props.inc1, '1')}
                            checked={this.state.selected1} />
                    </TouchableOpacity>
                </View>
            );
            inc2 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"2.- " + this.props.inc2}</Text>
                    <TouchableOpacity
                        onPress={() => this.answerCheckedHandler(this.props.question, this.props.inc2, '2')}
                        style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10 }}
                        hitSlop={styles.hitSlop} >
                        <CheckBox
                            onPress={() => this.answerCheckedHandler(this.props.question, this.props.inc2, '2')}
                            checked={this.state.selected2} />
                    </TouchableOpacity>
                </View>
            );
            inc3 = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{"3.- " + this.props.inc3}</Text>
                    <TouchableOpacity
                        onPress={() => this.answerCheckedHandler(this.props.question, this.props.inc3, '3')}
                        style={{ marginTop: 2.5, marginBottom: 2.5, marginRight: 10 }}
                        hitSlop={styles.hitSlop} >
                        <CheckBox
                            onPress={() => this.answerCheckedHandler(this.props.question, this.props.inc3, '3')}
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
                        {/* <Text>{this.props.question + " / " + this.state.prueba + " / " + this.props.sendSurvey + " / " + this.state.pruebaFormArray}</Text> */}
                    </View>
                </CardItem>
            );
            buttons = (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 }}>
                    <CustomButton
                        style="SuccessBorder"
                        clicked={() => this.sendSurverResponse(true)}
                        name="Enviar"
                        send={true} />
                    <CustomButton
                        style="DangerBorder"
                        clicked={null}
                        name="Cerrar" />
                </View>
            );
        }

        return (
            <View>
                {body}
                {/* {buttons} */}
            </View>
        );
    }
}

styles = StyleSheet.create({
    hitSlop: {
        top: 5,
        bottom: 5,
        left: 10,
        right: 10,
    }
})