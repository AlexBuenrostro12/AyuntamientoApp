import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Form } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import axios from '../../../axios-ayuntamiento';

export default class BuzonCiudadano extends Component {

    state = {
        btnStyle: 'Success',
        btnName: 'Enviar',
        form: {
            nombre:{
                itemType: 'FloatingLabel',
                holder: 'Nombre',
                value: '',
            },
            email: {
                itemType: 'FloatingLabel',
                holder: 'Email',
                value: '',
            },
            asunto: {
                itemType: 'FloatingLabel',
                holder: 'Asunto',
                value: '',
            },
            comentario: {
                itemType: 'Textarea',
                holder: 'Comentario',
                value: '',
            },
            fecha:  {
                itemType: 'Fecha',
                value: ''
            }
        },
        loading: false,
        entro: 'false',
        date: 'null'
    }

    getCurrentDate(){
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
        this.setState({date: today});
    }

    orderHandler = () => {

        const formData = {};
        for (let formElementIdentifier in this.state.form) {
            formData[formElementIdentifier] = this.state.form[formElementIdentifier].value;
        }
        const suggetion = {
            suggestionData: formData
        }
        
        axios.post('/suggestions.json', suggetion)
            .then(response => {
                this.setState( { loading: false } );
                //this.props.history.push('/');
            } )
            .catch(error => {
                this.setState( { loading: false } );
            });   
    }

    inputChangedHandler = ( text, inputIdentifier ) => {
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
        const fecha = this.state.date;
        updatedDateElement.value = fecha;
        updatedSuggestionForm[inputIdentifier] = updatedFormElement;
        updatedSuggestionForm['fecha'] = updatedDateElement;

        this.setState({form: updatedSuggestionForm}); //Falta validar entrada de email, agregar spinner y modal
    }

    render(){
        const formElementsArray = [];
        for (let key in this.state.form){
            formElementsArray.push({
                id: key,
                config: this.state.form[key]
            });
        }

        let form = (
            <Form>
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
            </Form>
        );

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <HeaderToolbar open={this.props} />
                    </View>
                    <StatusBar color="#ff9933"/>
                    <View>
                        <View style={styles.view}>
                            <Text style={styles.text}>Realiza queja o sugerencia</Text>
                        </View>
                        {form}
                    </View>
                </ScrollView>
            </View>
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
