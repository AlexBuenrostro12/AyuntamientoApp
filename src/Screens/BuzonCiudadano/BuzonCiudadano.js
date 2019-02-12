import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Image, Text, Alert } from 'react-native';
import { Form, Card, CardItem } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import axios from '../../../axios-ayuntamiento';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';

export default class BuzonCiudadano extends Component {

    state = {
        btnStyle: 'Success',
        btnName: 'Enviar',
        form: {
            nombre: {
                itemType: 'FloatingLabel',
                holder: 'Nombre',
                value: '',
                validation: {
                    minLength: 1,
                    maxLength: 35
                },
                valid: false,
            },
            email: {
                itemType: 'FloatingLabel',
                holder: 'Email',
                value: '',
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
            },
            asunto: {
                itemType: 'FloatingLabel',
                holder: 'Asunto',
                value: '',
                validation: {
                    minLength: 1,
                    maxLength: 15
                },
                valid: false,
            },
            comentario: {
                itemType: 'Textarea',
                holder: 'Comentario',
                value: '',
                validation: {
                    minLength: 1,
                    maxLength: 55
                },
                valid: false,
            },
            fecha: {
                itemType: 'Fecha',
                value: '',
                valid: true,
            }
        },
        loading: false,
        formIsValid: false,
        date: 'null',

    }

    getCurrentDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = mm + '/' + dd + '/' + yyyy;
        this.setState({ date: today });
    }

    orderHandler = () => {
        this.setState({ loading: true })
        if (this.state.formIsValid) {
            const formData = {};
            for (let formElementIdentifier in this.state.form) {
                formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
            }
            const suggetion = {
                suggestionData: formData
            }

            axios.post('/suggestions.json', suggetion)
                .then(response => {
                    Alert.alert('Buzón ciudadano', '¡Sugerencia enviada con exito!', [{text: 'Ok'}], {cancelable: false});
                })
                .catch(error => {
                    Alert.alert('Buzón ciudadano', '¡Sugerencia fallida al enviar!', [{text: 'Ok'}], {cancelable: false});
                });
        } else {
            Alert.alert('Buzón ciudadano', '¡Complete correctamente el formulario!', [{text: 'Ok'}], {cancelable: false});
        }
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (!rules) {
            return true;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.email) {
            let valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            isValid = valid.test(value) && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (text, inputIdentifier) => {
        this.getCurrentDate();
        const updatedSuggestionForm = {
            ...this.state.form
        };
        const updatedFormElement = {
            ...updatedSuggestionForm[inputIdentifier]
        };
        const updatedDateElement = {
            ...updatedSuggestionForm['fecha']
        };
        updatedFormElement.value = text;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

        const fecha = this.state.date;
        updatedDateElement.value = fecha;

        updatedSuggestionForm[inputIdentifier] = updatedFormElement;

        updatedSuggestionForm['fecha'] = updatedDateElement;

        let formIsValid = true;

        for (let inputIdentifier in updatedSuggestionForm) {
            formIsValid = updatedSuggestionForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ form: updatedSuggestionForm, formIsValid: formIsValid });
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.form) {
            formElementsArray.push({
                id: key,
                config: this.state.form[key]
            });
        }

        const buzonCiudadano = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CustomCardItemTitle
                            title="Buzón ciudadano"
                            description="Realice cualquier queja 
                                o sugerencia."
                            image={require('../../assets/images/Buzon/buzon.png')} />
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {formElementsArray.map(formElement => (
                                <CustomInput
                                    key={formElement.id}
                                    itemType={formElement.config.itemType}
                                    holder={formElement.config.holder}
                                    changed={(text) => this.inputChangedHandler(text, formElement.id)} />
                            ))}

                            <CustomButton
                                style={this.state.btnStyle}
                                name={this.state.btnName}
                                clicked={() => this.orderHandler()} />

                        </View>
                    </CardItem>
                </Card>
            </View>
        );
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <ScrollView>
                        <View>
                            <HeaderToolbar
                                open={this.props}
                                title="Sugerencias" />
                        </View>
                        <StatusBar color="#ff9933" />
                        <View>
                            {buzonCiudadano}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
