import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { ListItem, Left, Right, Card, CardItem } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Spinner from '../../components/CustomSpinner/CustomSpinner';
import Consulta from '../../components/Consulta/Consulta';
import IconRight from '../../UI/IconRight/IconRight';

export default class ConsultaCiudadana extends Component {
    state = {
        surveys: [],
        loading: true,
    }

    componentDidMount() {
        axios.get('/surveys.json')
            .then(res => {
                const fetchedSurveys = [];
                for (let key in res.data) {
                    fetchedSurveys.push({
                        ...res.data[key],
                        id: key
                    });
                }
                this.setState({ loading: false, surveys: fetchedSurveys });
            })
            .catch(err => {
                this.setState({ loading: false });
            });
    }

    render() {
        const list = (
            this.state.surveys.map(sv => (
                <Consulta
                    key={sv.id}
                    data={sv.data} />
            ))
        );
        const consultaCiudadana = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 18 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Consulta ciudadana</Text>
                                <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 14 }}>Ayude mejorar aspectos 
                                    de cada tema, contestanto las consultas.</Text>
                            </View>
                            <Image style={{ height: 90, width: 81 }} source={require('../../assets/images/Descripcion/descripcion.png')} />
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column', marginBottom: 50, justifyContent: 'center' }}>
                            {this.state.loading ? spinner : list}
                        </View>
                    </CardItem>
                </Card>
            </View>
        );
        const spinner = (
            <Spinner
                color="blue" />
        );

        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <View>
                        <HeaderToolbar
                            open={this.props}
                            title="Consultas" />
                    </View>
                    <StatusBar color="#ff9933" />
                    <ScrollView>
                        {consultaCiudadana}
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});
