import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Noticia from '../../components/Noticia/Noticia';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';

export default class Noticias extends Component {
    state = {
        news: [],
        loading: true,
        items: [
            'Simon Mignolet',
            'Nathaniel Clyne',
            'Dejan Lovren',
            'Mama Sakho',
            'Emre Can'
          ]
    
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
        let form = (
            this.state.news.map(nw => (
                <Noticia 
                    key={nw.id}
                    data={nw.data} />
                ))
        );
        let spinner = (
            <CustomSpinner 
                color="blue"/>
        );

        return(
            <View style={styles.container}>
                <View>
                    <HeaderToolbar 
                        open={this.props}
                        title="Noticias" />
                </View>
                <StatusBar color="#ff9933"/>
                <View style={styles.view}>
                    <ScrollView>
                        {this.state.loading ? spinner : form}
                    </ScrollView>
                </View>
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
        //alignItems: 'center',
        //justifyContent: 'center', 
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});