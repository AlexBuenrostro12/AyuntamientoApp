import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Noticia from '../../components/Noticia/Noticia';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';

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
        let list = (
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
        let bottomSpace = (
            <View>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
            </View>
        );

        return(
            <SafeAreaView style={styles.container}>
                <View>
                    <View>
                        <HeaderToolbar 
                            open={this.props}
                            title="Noticias" />
                    </View>
                    <StatusBar color="#ff9933"/>
                    <ScrollView>
                        {this.state.loading ? spinner : list}
                        {bottomSpace}
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
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});