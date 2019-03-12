import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Card, CardItem } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Spinner from '../../components/CustomSpinner/CustomSpinner';
import Consulta from '../../components/Consulta/Consulta';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';

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
        const spinner = (
            <Spinner
                color="blue" />
        );
        const consultaCiudadana = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CustomCardItemTitle
                        title="Consulta ciudadana"
                        description="Ayude mejorar aspectos 
                            de cada tema, contestanto las consultas."
                        image={require('../../assets/images/Descripcion/descripcion.png')} />
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column', marginBottom: 50, justifyContent: 'center' }}>
                            {this.state.loading ? spinner : list}
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
        flexDirection: 'column',
        flexWrap: 'wrap',
        overflow: 'scroll',
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
