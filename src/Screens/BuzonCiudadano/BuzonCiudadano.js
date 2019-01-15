import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Form } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomToast from '../../components/CustomToast/CustomToast';
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
            fecha:  {
                itemType: 'Fecha',
                value: '',
                valid: true,
            }
        },
        loading: false,
        formIsValid: false,
        toastConfiguration: {
            type: {
                success: 'success',
                warning: 'warning',
                danger: 'danger'
            },
            text: {
                sText: '¡Comentario enviado!',
                wText: '¡Complete el formulario correctamente!',
                dText: '¡Sugerencia fallida al enviar!'
            },
        },
        toasts: null,
        showSuccessToast: false,
        showWarningToast: false,
        showDangerToast: false,
        date: 'null',

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
        this.setState({loading: true})
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
                    this.setState( { showSuccessToast: true } );
                    this.setTimeOut();
                } )
                .catch(error => {
                    this.setState( { showDangerToast: true } );
                    this.setTimeOut();
                });   
        } else {
            this.setState({ showWarningToast: true });
            this.setTimeOut();
        }
    }

    componentDidMount() {
        let success = (
                <CustomToast
                    type={this.state.toastConfiguration.type.success}
                    text={this.state.toastConfiguration.text.sText} />
        ); 
        let warning = (
                <CustomToast
                    type={this.state.toastConfiguration.type.warning}
                    text={this.state.toastConfiguration.text.wText} />
        );
        let danger = (
                <CustomToast
                    type={this.state.toastConfiguration.type.danger}
                    text={this.state.toastConfiguration.text.dText} />
        );
        let toasts = {
            success: success,
            warning: warning,
            danger: danger
        }

        this.setState({ toasts: toasts });
    }

    setTimeOut = () => {
        let that = this;
        setTimeout(function(){
            that.setState({ showSuccessToast: false, showWarningToast: false, showDangerToast: false });
        }, 3000);
    }

    checkValidity(value, rules) {
        let isValid = true;

        if(!rules) {
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
            let valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
            isValid = valid.test(value) && isValid;
        }

        return isValid; 
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
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

        const fecha = this.state.date;
        updatedDateElement.value = fecha;

        updatedSuggestionForm[inputIdentifier] = updatedFormElement;
        
        updatedSuggestionForm['fecha'] = updatedDateElement;

        let formIsValid = true;

        for(let inputIdentifier in updatedSuggestionForm) {
            formIsValid = updatedSuggestionForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({form: updatedSuggestionForm, formIsValid: formIsValid});
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

                {this.state.showSuccessToast ? this.state.toasts.success : null}
                {this.state.showWarningToast ? this.state.toasts.warning : null}
                {this.state.showDangerToast ? this.state.toasts.danger : null}

            </Form>
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
                        <StatusBar color="#ff9933"/>
                        <View>
                            {form}
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
