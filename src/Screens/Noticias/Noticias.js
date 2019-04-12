import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Image } from 'react-native';
import { Card, CardItem } from 'native-base';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import axios from '../../../axios-ayuntamiento';
import Noticia from '../../components/Noticia/Noticia';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
    commonFlex: '1',
    customMarginValue: '5px'
}

const StyledSafeArea = styled.SafeAreaView`
    flex: ${theme.commonFlex};
`;

const StyledContainer = styled.View`
    flex: ${theme.commonFlex};
    flex-direction: column;
    flex-wrap: wrap;
    overflow: scroll;
`;

const StyledHeader = styled.View``;

const StyledMainScroll = styled.ScrollView``;

const StyledNoticias = styled.View`
    flex: ${theme.commonFlex};
    margin: ${theme.customMarginValue};
`;

const StyledCardBody = styled.View`
    flex: ${theme.commonFlex};
    flex-direction: column;
    justify-content: center;
`;

export default class Noticias extends Component {
    state = {
        news: [],
        loading: true,
    }

    componentDidMount() {
        const { token } = this.props.screenProps;
        axios.get('/news.json?auth=' + token)
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
            <StyledNoticias>
                <Card>
                    <CustomCardItemTitle
                        title="Noticias"
                        description="Las noticias más 
                            relebantes de Tecalitlán a tu alcance."
                        image={require('../../assets/images/Noticia/noticia.png')} />
                    <CardItem bordered>
                        <StyledCardBody>
                            {this.state.loading ? spinner : list}
                        </StyledCardBody>
                    </CardItem>
                </Card>
            </StyledNoticias>
        );

        return(
            <StyledSafeArea>
                <StyledContainer>
                    <StyledHeader>
                        <HeaderToolbar 
                            open={this.props}
                            title="Noticias" />
                    </StyledHeader>
                    <StatusBar color="#ff9933"/>
                    <StyledMainScroll>
                        <ThemeProvider theme={theme}>
                            {noticias}
                        </ThemeProvider>
                    </StyledMainScroll>
                </StyledContainer>
            </StyledSafeArea>
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