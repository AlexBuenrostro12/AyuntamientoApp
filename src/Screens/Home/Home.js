import React, { Component, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import SwiperBanner from '../../components/SwiperBanner/SwiperBanner';


export default class Home extends Component {

    state = {
        news: null,
        loading: true
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

        const spinner = (
            <CustomSpinner 
                color="blue"/>
        );

        let swiperBanner = (
            <SwiperBanner news={this.state.news} open={this.props}/>
        );

        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.view}>
                    <View>
                        <HeaderToolbar 
                            open={this.props}
                            title="Home" />
                    </View>
                    <StatusBar color="#ff9933"/>
                    <View>
                        {this.state.loading ? spinner : swiperBanner}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 25
    },
    view: {
        flex: 1, 
        flexWrap: 'wrap', 
        flexDirection: 'column', 
        overflow: 'scroll'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});