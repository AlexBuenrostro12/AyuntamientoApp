import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ListItem } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Spinner from '../../components/CustomSpinner/CustomSpinner';
import Consulta from '../../components/Consulta/Consulta';

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
                        id:  key
                    });
                }
                this.setState({ loading: false, surveys: fetchedSurveys });
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    render() {
        let list = (
            this.state.surveys.map(sv => (
                <Consulta 
                    key={sv.id}
                    data={sv.data}/>
            ))
        );
        let spinner = (
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
                    <StatusBar color="#ff9933"/>
                    <ScrollView>
                        {this.state.loading ? spinner : list}
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
