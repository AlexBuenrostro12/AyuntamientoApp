import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Card, CardItem, Thumbnail, Left, Body } from 'native-base';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';

const SCROLLVIEW_REF = 'scrollview';

export default class SwiperBanner extends Component {
    state = {
        bannerItems: [],
        heightScreen: 0,
        widthScreen: 0,
        startAutoPlay: true,
        timerID: null,
        currentIndex: 0,
        childrenCount: 0,
        width: 0,
        preScrollX: null,
        scrollInterval: 2500,
    }

    componentDidMount() {
        // console.log('componentDidMount');
        if (this.state.startAutoPlay) 
            this.startAutoPlayHandler();
        else
            this.stopAutoPlayHandler();
    }

    onScrollHandler = (e) => {
        // console.log('onScrollHandler');
        // console.log(this.state);
        
        let { x } = e.nativeEvent.contentOffset, offset, position = Math.floor(x / this.state.width);
        if (x === this.state.preScrollX) return;
        this.setState({ preScrollX: x });
        offset = x / this.state.width - position;

        if (offset === 0) {
            let timerid = setInterval(this.goToNextPageHandler, this.state.scrollInterval);
            this.setState({ currentIndex: position, timerID: timerid });
        }
    }
    onScrollViewLayoutHandler = (e) => {
        // console.log('onScrollViewLAyoutHandler');
        let { width } = e.nativeEvent.layout;             
        this.setState({ width: width });
    }
    goToNextPageHandler = () => {
        // console.log('goToNextPageHandler');
        this.stopAutoPlayHandler();
         let nextIndex = (this.state.currentIndex + 1) % this.state.childrenCount;
         this.refs[SCROLLVIEW_REF].scrollTo({ x: this.state.width * nextIndex })
    }
    startAutoPlayHandler = () => {
        // console.log('startAutoPlayHandler');
        let timerid = setInterval(this.goToNextPageHandler, this.state.scrollInterval);
        this.setState({ timerID: timerid});
     }
    stopAutoPlayHandler = () => {
        // console.log('stopAutoPlayHandler');
         if (this.state.timerID) {
             clearInterval(this.state.timerID);
             this.setState({ timerID: null });
         }
     }

    componentWillMount() {
        // console.log('componentWillMount');
        this.getNewsHandler();
    }
    getNewsHandler = () => {
        console.log('Fire!!!');
        let bannerItems = [];
        let childrenCount = 0;
        if (this.props.news) {
            this.props.news.map((nw, index) => {
                let currentDate = new Date(nw.newData.fecha);
                let expiryDate = new Date(currentDate);
                expiryDate.setDate(expiryDate.getDate() + 3);
                let today = new Date();
                console.log('CurrentDay: ',currentDate, 'ExpiryDate: ', expiryDate, 'Today:', today);
                if (expiryDate > today) {
                    console.log('IF: ', nw.newData.noticia, nw.newData.fecha);
                    childrenCount = childrenCount + 1;
                    bannerItems.push({
                        logo: require('../../assets/images/Ayuntamiento/logo-naranja.png'),
                        noticia: nw.newData.noticia,
                        direccion: nw.newData.direccion,
                        fecha: nw.newData.fecha,
                        imagen: nw.newData.imagen
                    });
                }
            });
            let { height, width } = Dimensions.get('window');
            this.setState({ childrenCount: childrenCount , bannerItems: bannerItems, heightScreen: height , widthScreen: width  });
        }
    }

    render() {
        // console.log('render');

        const titleBanner = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CustomCardItemTitle
                        title="Banner de noticias"
                        description="Deslice y conozca
                            las noticias mas relevantes dando clic en la imagen."
                        image={require('../../assets/images/Home/home.png')} />
                </Card>
            </View>
        );
        const scrollBanner = (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {this.state.bannerItems.map(item => (
                    <Card key={item.noticia} style={{ elevation: 3, height: this.state.heightScreen / 1.6, width: this.state.widthScreen / 1.07 }}>
                        <CardItem header>
                            <Left>
                                <Thumbnail resizeMode='contain' source={item.logo} />
                                <Body>
                                    <Text style={styles.text}>{item.direccion}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={styles.border}
                                onPress={() => this.props.open.navigation.navigate('Noticias')} >
                                <View style={{ alignItems: 'center' }}>
                                    <Image resizeMode='contain' style={{ height: this.state.heightScreen / 3, width: this.state.widthScreen / .6 }} source={{ uri: item.imagen }} />
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem footer>
                            <Text style={styles.text}>{item.noticia}</Text>
                        </CardItem>
                    </Card>
                ))}
            </View>
        );
        return (
            <View style={{ flex: 1, flexDirection: 'column', margin: 5 }}>
                {titleBanner}
                <ScrollView style={styles.scrollView} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            onLayout={this.onScrollViewLayoutHandler}
                            onScroll={this.onScrollHandler}
                            ref={SCROLLVIEW_REF}
                            pagingEnabled={true}
                            scrollEventThrottle={8}
                            >
                    {scrollBanner}
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    scrollView: {
        flex: 1, 
        marginLeft: 5, 
        marginRight: 5, 
        marginBottom: 5,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    border: {
        flex: 1,
        overflow: 'hidden',
        alignItems: 'center',
        position: 'relative',
        margin: 10
    },
    banner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    bannerText: {
        fontSize: 25,
        color: 'orange'
    },
});



