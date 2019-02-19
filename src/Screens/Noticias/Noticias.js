import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Image } from 'react-native';
import { Card, CardItem } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Noticia from '../../components/Noticia/Noticia';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';

export default class Noticias extends Component {
    state = {
        news: [],
        loading: true,
    }

    componentDidMount() {
        axios.get('/news.json')
            .then(res => {
                const fetchedNews = [];
                for (let key in res.data) {
                    fetchedNews.push({
                        ...res.data[key],
                        id:  key
                    });
                }
                this.setState({ loading: false, news: fetchedNews });
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }
    
    render() {
        const list = (
            this.state.news.map(nw => (
                <Noticia 
                    key={nw.id}
                    data={nw.data} />
                ))
        );
        const spinner = (
            <CustomSpinner 
                color="blue"/>
        );
        const noticias = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CustomCardItemTitle
                        title="Noticias"
                        description="Las noticias más 
                            relebantes de Tecalitlán a tu alcance."
                        image={require('../../assets/images/Noticia/noticia.png')} />
                    <CardItem bordered>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                            {this.state.loading ? spinner : list}
                        </View>
                    </CardItem>
                </Card>
            </View>
        );

        return(
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View>
                        <HeaderToolbar 
                            open={this.props}
                            title="Noticias" />
                    </View>
                    <StatusBar color="#ff9933"/>
                    <ScrollView>
                        {noticias}
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
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});