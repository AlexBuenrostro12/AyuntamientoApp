import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Platform, Alert } from 'react-native';
import { Form, Card, CardItem, Body } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import Ubicacion from '../../components/Incidencias/Ubicacion/Ubicacion';
import Multimedia from '../../components/Incidencias/Multimedia/Multimedia';
import Descripcion from '../../components/Incidencias/Descripcion/Descripcion';
import DatosPersonales from '../../components/Incidencias/DatosPersonales/DatosPersonales';
import CustomButton from '../../components/CustomButton/CustomButton';
import axios from '../../../axios-ayuntamiento';
import axiosImage from 'axios';
import ImagePicker from 'react-native-image-picker';

export default class Incidencias extends Component {
    state = {
        formDescripcion: {
            tipo: {
                itemType: 'Picker',
                value: 'electricidad',
                valid: true
            },
            asunto: {
                itemType: 'FloatingLabel',
                value: '',
                validation: {
                    minLength: 1,
                    maxLength: 35
                },
                valid: false
            },
            descripcion: {
                itemType: 'Textarea',
                value: '',
                validation: {
                    minLength: 1,
                    maxLength: 100
                },
                valid: false
            },
        },
        formDatosPersonales: {
            nombre: {
                itemType: 'FloatingLabel',
                value: '',
                holder: 'Nombre',
                validation: {
                    minLength: 3,
                    maxLength: 50
                },
                valid: false
            },
            email: {
                itemType: 'FloatingLabel',
                value: '',
                holder: 'Email',
                validation: {
                    required: true,
                    email: true
                },
                valid: false
            },
            telefono: {
                itemType: 'FloatingLabel',
                value: '',
                holder: 'Telefono',
                validation: {
                    minLength: 7,
                    maxLength: 10
                },
                valid: false
            }
        },
        formMultimedia: {
            imagen: {
                itemType: 'ImageButton',
                value: '',
                holder: 'IMAGEN',
                valid: true
            }
        },
        formUbicacion: {
            direccion: {
                itemType: 'FloatingLabel',
                value: '',
                validation: {
                    minLength: 5,
                    maxLength: 50
                },
                valid: false
            },
            municipio: {
                itemType: 'Picker',
                value: 'tecalitlan',
                valid: true
            },
            fecha: {
                value: '',
                valid: true
            }
        },
        formUbicacionIsValid: false,
        formDescripcionIsValid: false,
        formDatosPersonalesIsValid: false,
        loading: false,
        options: {
            title: 'Elige una opción',
            takePhotoButtonTitle: 'Abrir camara.',
            chooseFromLibraryButtonTitle: 'Abrir galeria.'
        },
        incidentImage: null,
        fileNameImage: null,
        imageData: null,
        date: null
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

    incidentsHandler = () => {
        this.setState({ loading: true })
        if (this.state.formDescripcionIsValid && this.state.formDatosPersonalesIsValid && this.state.formUbicacionIsValid) {
            const ubicacionFormData = {};
            const descripcionFormData = {};
            const datosPersonalesFormData = {};

            for (let formElementIdentifier in this.state.formUbicacion) {
                ubicacionFormData[formElementIdentifier] = this.state.formUbicacion[formElementIdentifier].value;
            }
            for (let formElementIdentifier in this.state.formDescripcion) {
                descripcionFormData[formElementIdentifier] = this.state.formDescripcion[formElementIdentifier].value;
            }
            for (let formElementIdentifier in this.state.formDatosPersonales) {
                datosPersonalesFormData[formElementIdentifier] = this.state.formDatosPersonales[formElementIdentifier].value;
            }

            const incident = {
                ubicacionData: ubicacionFormData,
                descripcionData: descripcionFormData,
                datosPersonalesData: datosPersonalesFormData,
                multimediaData: {
                    nombreImagen: this.state.fileNameImage
                }
            }

            axios.post('/incidents.json', incident)
                .then(response => {
                    Alert.alert('Incidencias', '¡Incidencia enviada con exito!', [{ text: 'Ok' }], { cancelable: false });
                })
                .catch(error => {
                    Alert.alert('Incidencias', '¡Error al enviar incidencia!', [{ text: 'Ok' }], { cancelable: false });
                });

            axiosImage.post('https://us-central1-ayuntamiento-77d3b.cloudfunctions.net/uploadFile', this.state.imageData)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    Alert.alert('Incidencias', '¡Error subir imagen!', [{ text: 'Ok' }], { cancelable: false });
                });
        } else {
            Alert.alert('Incidencias', '¡Comlete el formulario correctamente!', [{ text: 'Ok' }], { cancelable: false });
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
    inputChangeLocationHandler = (text, inputIdentifier) => {
        this.getCurrentDate();
        const updatedLocationForm = {
            ...this.state.formUbicacion
        };
        const updatedFormElement = {
            ...updatedLocationForm[inputIdentifier]
        };
        const updatedDateElement = {
            ...updatedLocationForm['fecha']
        }

        updatedFormElement.value = text;
        updatedDateElement.value = this.state.date
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

        updatedLocationForm[inputIdentifier] = updatedFormElement;
        updatedLocationForm['fecha'] = updatedDateElement;

        let formIsValid = true;

        for (let inputIdentifier in updatedLocationForm) {
            formIsValid = updatedLocationForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ formUbicacion: updatedLocationForm, formUbicacionIsValid: formIsValid });
    }
    inputChangeDescriptionHandler = (text, inputIdentifier) => {
        const updatedDescriptionForm = {
            ...this.state.formDescripcion
        };
        const updatedFormElement = {
            ...updatedDescriptionForm[inputIdentifier]
        };

        updatedFormElement.value = text;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

        updatedDescriptionForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;

        for (let inputIdentifier in updatedDescriptionForm) {
            formIsValid = updatedDescriptionForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ formDescripcion: updatedDescriptionForm, formDescripcionIsValid: formIsValid });
    }
    inputChangePersonalDataHandler = (text, inputIdentifier) => {
        const updatedPersonalDataForm = {
            ...this.state.formDatosPersonales
        };
        const updatedFormElement = {
            ...updatedPersonalDataForm[inputIdentifier]
        };

        updatedFormElement.value = text;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

        updatedPersonalDataForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;

        for (let inputIdentifier in updatedPersonalDataForm) {
            formIsValid = updatedPersonalDataForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ formDatosPersonales: updatedPersonalDataForm, formDatosPersonalesIsValid: formIsValid });
    }
    loadPhotoHandler = () => {
        ImagePicker.showImagePicker(this.state.options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }

            else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                const imageData = new FormData();
                imageData.append('name', 'image');
                imageData.append('image', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName,
                    data: response.data
                });
                this.setState({
                    incidentImage: source,
                    fileNameImage: response.fileName,
                    imageData: imageData
                });
            }
        });
    }

    render() {
        const formElementsUbicacion = [];
        for (let key in this.state.formUbicacion) {
            formElementsUbicacion.push({
                id: key,
                config: this.state.formUbicacion[key]
            });
        }
        const formElementsDescripcion = [];
        for (let key in this.state.formDescripcion) {
            formElementsDescripcion.push({
                id: key,
                config: this.state.formDescripcion[key]
            });
        }
        const formElementsDatosPersonales = [];
        for (let key in this.state.formDatosPersonales) {
            formElementsDatosPersonales.push({
                id: key,
                config: this.state.formDatosPersonales[key]
            });
        }
        const formElementsMultimedia = [];
        for (let key in this.state.formMultimedia) {
            formElementsMultimedia.push({
                id: key,
                config: this.state.formMultimedia[key]
            });
        }
        const ubicacion = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 18 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Ubicación</Text>
                                <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 14 }}>Seleccione la localidad y
                                    la direccion de la incidencia.</Text>
                            </View>
                            <Image style={{ height: 77, width: 85 }} source={require('../../assets/images/Ubicacion/search.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {formElementsUbicacion.map(element => (
                                <Ubicacion
                                    key={element.id}
                                    itemType={element.config.itemType}
                                    value={element.config.value}
                                    isValid={element.config.valid}
                                    changed={(text) => this.inputChangeLocationHandler(text, element.id)} />
                            ))}
                        </View>
                    </CardItem>
                </Card>
            </View>
        );
        const multimedia = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 25 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Multimedia</Text>
                                <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 14 }}>Seleccione una imagen desde su galeria
                                o directamente de la camara para conocer la incidencia.</Text>
                            </View>
                            <Image style={{ height: 85, width: 65 }} source={require('../../assets/images/Multimedia/multimedia.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {formElementsMultimedia.map(element => (
                                <Multimedia
                                    key={element.id}
                                    itemType={element.config.itemType}
                                    holder={element.config.holder}
                                    loadPhoto={() => this.loadPhotoHandler()}
                                    image={this.state.incidentImage}
                                    name={this.state.fileNameImage} />
                            ))}
                        </View>
                    </CardItem>
                </Card>
            </View>
        );
        const description = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 25 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Descripción</Text>
                                <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 14 }}>Llena los siguientes campos
                                    para describir la incidencia.</Text>
                            </View>
                            <Image style={{ height: 85, width: 75 }} source={require('../../assets/images/Descripcion/descripcion.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {formElementsDescripcion.map(element => (
                                <Descripcion
                                    key={element.id}
                                    itemType={element.config.itemType}
                                    value={element.config.value}
                                    isValid={this.state.formDescripcionIsValid}
                                    changed={(text) => this.inputChangeDescriptionHandler(text, element.id)} />
                            ))}
                        </View>
                    </CardItem>
                </Card>
            </View>
        );
        const datosPersonales = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 25 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Datos personales</Text>
                                <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 14 }}>Llena los siguientes campos
                                    para llevar un control de incidencias.</Text>
                            </View>
                            <Image style={{ height: 85, width: 85 }} source={require('../../assets/images/Email/email.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {formElementsDatosPersonales.map(element => (
                                <DatosPersonales
                                    key={element.id}
                                    itemType={element.config.itemType}
                                    value={element.config.value}
                                    holder={element.config.holder}
                                    isValid={this.state.formDatosPersonalesIsValid}
                                    changed={(text) => this.inputChangePersonalDataHandler(text, element.id)} />
                            ))}
                        </View>
                    </CardItem>
                </Card>
            </View>
        );
        const button = (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <CustomButton
                    style="Success"
                    name="Enviar"
                    clicked={() => this.incidentsHandler()} />
            </View>
        );
        let form = (

            <Form>
                {ubicacion}
                {multimedia}
                {description}
                {datosPersonales}
                {button}
            </Form>
        );

        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <View>
                        <HeaderToolbar
                            open={this.props}
                            title="Incidencias" />
                    </View>
                    <StatusBar color="#ff9933" />
                    <ScrollView>
                        {form}
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: '11%'
    },
    view: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});
