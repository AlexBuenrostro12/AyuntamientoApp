import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Platform, Alert, TouchableOpacity } from 'react-native';
import { Form, Card, CardItem, Body } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import axiosImage from 'axios';
import axiosCloudinary from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import Ubicacion from '../../components/Incidencias/Ubicacion/Ubicacion';
import Multimedia from '../../components/Incidencias/Multimedia/Multimedia';
import Descripcion from '../../components/Incidencias/Descripcion/Descripcion';
import DatosPersonales from '../../components/Incidencias/DatosPersonales/DatosPersonales';
import CustomButton from '../../components/CustomButton/CustomButton';
import axios from '../../../axios-ayuntamiento';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import Incidencia from '../../components/Incidencias/Incidencia';

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
                    minLength: 1,
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
                    minLength: 1,
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
            chooseFromLibraryButtonTitle: 'Abrir galeria.',
            maxWidth: 800, 
			maxHeight: 800
        },
        incidentImage: null,
        fileNameImage: null,
        imageFormData: null,
        date: null,
        token: null,
        addIncident: null,
        incidents: [],
        isAdmin: null,
        urlUploadedImage: null,
        showButtons: true,
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
        this.setState({ date: today });
    }

    async componentDidMount() {
        //Get the token and time of expiration
		let token = email = (expiresIn = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
            expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
            email = await AsyncStorage.getItem('@storage_email');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('Incidencias.js: ', token);
            console.log('Incidencias.js: ', parseExpiresIn, now);
            console.log('Incidencias.js: ', this.state.tokenIsValid);
            console.log('Incidencias.js: ', email);
			if (token && parseExpiresIn > now) {
                this.setState({ token: token });
                
                if (email !== 'false')
					this.setState({ isAdmin: true });
				else
					this.setState({ isAdmin: false });

				this.getIncidents();
			} else {
				//Restrict screens if there's no token
				try {
					console.log('Entro al try');
					await AsyncStorage.removeItem('@storage_token');
					await AsyncStorage.removeItem('@storage_expiresIn');
					//Use the expires in
				} catch (e) {
					//Catch posible errors
				}
				Alert.alert(
					'Incidencias',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errors
		}
    }

    sendIncidentHandler = () => {
        this.setState({ loading: true })
        if (this.state.imageFormData && this.state.formDescripcionIsValid && this.state.formDatosPersonalesIsValid && this.state.formUbicacionIsValid) {
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
                personalData: datosPersonalesFormData,
                multimediaData: {
                    imagen: this.state.urlUploadedImage
                }
            }

            const { token } = this.state;
            axios.post('/incidents.json?auth=' + token, incident)
                .then(response => {
                    this.setState({ loading: false });
                    Alert.alert('Incidencias', '¡Incidencia enviada con exito!', [{ text: 'Ok', onPress:  () => this.getIncidents() }], { cancelable: false });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    Alert.alert('Incidencias', '¡Error al enviar incidencia!', [{ text: 'Ok' }], { cancelable: false });
                });

        } else {
            this.setState({ loading: false });
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
    };
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
                //Preset
                const UPLOAD_PRESET_NAME = 'ayuntamiento';
                const { fileName, fileSize, type, data, uri } = response;
                //Image form data
                const imageFormData = new FormData();
				imageFormData.append('file', {
					name: fileName,
					size: fileSize,
					type: type,
					data: data,
					uri: uri
                });
                imageFormData.append('upload_preset', UPLOAD_PRESET_NAME);
                this.setState({
                    incidentImage: { uri: uri },
                    fileNameImage: response.fileName,
                    imageFormData: imageFormData
                });
            }
        });
    }
    //Get incidents
    getIncidents = () => {
		this.setState({ loading: true, addIncident: false, showButtons: true });
		axios
			.get('/incidents.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedIncidents = [];
				for (let key in res.data) {
					fetchedIncidents.push({
						...res.data[key],
						id: key
					});
				}
                this.setState({ loading: false, incidents: fetchedIncidents.reverse() });
                console.log('Incidents: ', this.state.incidents);
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
    }
    
    uploadPhotoHandler = () => {
		//URL cloudinary
		const URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/storage-images/image/upload';
		this.setState({ loading: true });
		console.log('Form: ', this.state.imageFormData, this.state.formDatosPersonales, this.state.formDatosPersonalesIsValid, this.state.formDescripcion, this.state.formDescripcionIsValid, this.state.formUbicacion, this.state.formUbicacionIsValid);
		if (this.state.imageFormData && this.state.formDatosPersonalesIsValid && this.state.formDescripcionIsValid && this.state.formUbicacionIsValid) {
			axiosCloudinary({
				url: URL_CLOUDINARY,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: this.state.imageFormData
			})
				.then((response) => {
					console.log('ResponseCloudinary: ', response);
					//Destructurin response
					const { data } = response;
					console.log('ResponseDataCloudinary: ', data);
					//Destructuring data
					const { url, eager, } = data;
					//Send to state url response
					this.setState({ urlUploadedImage: url })
					console.log('stateofForm: ', this.state.form);
					//Call the method to upload new
					this.sendIncidentHandler();
				})
				.catch((err) => {
                    this.setState({ loading: false });
					Alert.alert('Actividades', 'Imagen fallida al enviar!', [ { text: 'Ok' } ], {
						cancelable: false
					});
					console.log('ErrorCloudinary: ', err);
				});
		} else {
			this.setState({ loading: false });
			Alert.alert('Actividades', '¡Complete el formulario correctamente!', [ { text: 'Ok' } ], {
				cancelable: false
			});
		}
	};

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
                    <CustomCardItemTitle
                        title="Ubicación"
                        description="Seleccione la localidad y
                            la direccion de la incidencia."
                        image={require('../../assets/images/Ubicacion/search.png')} />

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
                    <CustomCardItemTitle
                        title="Multimedia"
                        description="Seleccione una imagen desde su galeria
                            o directamente de la camara para conocer la incidencia."
                        image={require('../../assets/images/Multimedia/multimedia.png')} />

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
                    <CustomCardItemTitle
                        title="Descripción"
                        description="Llena los siguientes campos
                            para describir la incidencia."
                        image={require('../../assets/images/Descripcion/descripcion.png')} />

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
                    <CustomCardItemTitle
                        title="Datos personales"
                        description="Llena los siguientes campos
                            para llevar un control de incidencias."
                        image={require('../../assets/images/Email/email.png')} />

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
        const spinner = <CustomSpinner color="blue" />;
        const buttons =  (
            !this.state.loading ? (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
				<CustomButton 
					style="Success" 
					name="Agregar" 
					clicked={() => this.uploadPhotoHandler()} />
				<CustomButton
					style="Danger"
					name="Regresar"
					clicked={() => this.getIncidents()} />
            </View>) : spinner
        );
        const addIncident = (
            <Form>
                {ubicacion}
                {multimedia}
                {description}
                {datosPersonales}
                {buttons}
            </Form>
        );
        const list = this.state.incidents.map((inct) => <Incidencia 
															key={inct.id} 
															id={inct.id} 
															token={this.state.token}
															isAdmin={this.state.isAdmin} 
															refresh={this.getIncidents} 
                                                            personalData={inct.personalData}
                                                            descripcionData={inct.descripcionData}
                                                            multimediaData={inct.multimediaData}
                                                            ubicacionData={inct.ubicacionData}
                                                            describe={this.props} />);
        const body = (
			<View style={styles.body}>
				<Card>
					<CustomCardItemTitle
						title="Incidencias"
						description="Visualice, agregue algún tipo de incidencia facilmente."
                        image={require('../../assets/images/Noticia/noticia.png')}
                        showButtons={this.state.showButtons}
						get={this.getIncidents}
						add={() => this.setState({ addIncident: true, showButtons: false })}
						isAdmin={true}
					/>
					<CardItem bordered>
						<View style={styles.cardBody}>
                            {this.state.loading ? spinner: <View style={styles.scrollDataList}>{list}</View>}
						</View>
					</CardItem>
				</Card>
			</View>
		);

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View>
                        <HeaderToolbar
                            open={this.props}
                            title="Incidencias" />
                    </View>
                    <StatusBar color="#FEA621" />
                    <ScrollView>
                        {!this.state.addIncident ? body : addIncident}
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        overflow: 'scroll',
    },
    view: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    body: {
		flex: 1,
		margin: 5
	},
	cardBody: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	btns: {
		flex: 1,
		flexDirection: 'column'
	},
	btn: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#F3F2F1',
		justifyContent: 'space-between',
		margin: 5,
		borderRadius: 5
    },
    scrollDataList: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		flexWrap: 'wrap',
	}
});
