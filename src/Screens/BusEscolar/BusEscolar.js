import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import { Card, CardItem } from 'native-base';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import CustommSpinner from '../../components/CustomSpinner/CustomSpinner';
import axios from '../../../axios-ayuntamiento';
import Buses from '../../components/Buses/Buses';

export default class BusEscolar extends Component {

    state = {
        buses: [],
        loading: true
    }

    componentDidMount() {
        const { token } = this.props.screenProps;
        axios.get('/bus.json?auth=' + token)
            .then(res => {
                const fetchedBuses = [];
                for (let key in res.data) {
                    fetchedBuses.push({
                        ...res.data[key],
                        id: key
                    });
                }
                this.setState({ loading: false, buses: fetchedBuses });
            })
            .catch(err => {
                this.setState({ loading: false });
            });
    }

    render() {
        const busesList = (
            this.state.buses.map(bss => (
                <Buses
                    key={bss.id}
                    data={bss.data} />
            ))
        );

        const spinner = (
            <CustommSpinner
                color="blue" />
        );

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <HeaderToolbar
                        open={this.props}
                        title="Bus escolar" />

                    <StatusBar color="#ff9933" />
                    <ScrollView>
                        <View style={{ flex: 1, margin: 5 }}>
                            <Card>
                                <CustomCardItemTitle
                                    title="Bus escolar"
                                    description="Consulta los horarios y destinos de tus camiones."
                                    image={require('../../assets/images/Ubicacion/search.png')} />
                                <CardItem>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                        {this.state.loading ? spinner : busesList}
                                    </View>
                                </CardItem>
                            </Card>
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