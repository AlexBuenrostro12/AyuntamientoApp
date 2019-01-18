import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Card, DeckSwiper, CardItem, Thumbnail, Left, Body } from 'native-base';
import CustomButton from '../../components/CustomButton/CustomButton';

export default class SwiperBanner extends Component {
    state = {
        bannerItems: [],
        heightScreen: 0,
        widthScreen: 0,
    }

    componentWillMount() {
        let bannerItems = [];
        if(this.props.news) {
            this.props.news.map(nw => {
                bannerItems.push({
                    logo: require('../../assets/images/Ayuntamiento/ayuntamiento.jpg'),
                    nombre: nw.data.nombre,
                    categoria: nw.data.categoria,
                    fecha: nw.data.fecha,
                    logoCategoria: this.choseCategoryLogo(nw.data.categoria)
                });
            });
            let {height, width} = Dimensions.get('window');
            this.setState({bannerItems: bannerItems, heightScreen: height, widthScreen: width});
        }
    }
    
    choseCategoryLogo = ( category ) => {
        switch (category) {
            case 'Cultura':
                return require('../../assets/images/Cultura/cultura.jpg');
            case 'Deporte':
                return require('../../assets/images/Deporte/deporte.jpg');
            case 'Social':
                return require('../../assets/images/Social/social.jpg');
            case 'Agua':
                return require('../../assets/images/Agua/agua.jpg');
            default:
                return null;
        }
    }

    render() {
        
        let swiper = (
            <DeckSwiper
                dataSource={this.state.bannerItems}
                renderItem={item =>
                  <Card style={styles.card}>
                    <CardItem header>
                      <Left>
                        <Thumbnail source={item.logo} />
                        <Body>
                          <Text style={styles.text}>{item.categoria}</Text>
                        </Body>
                      </Left>
                    </CardItem>
                    <CardItem cardBody>
                      <TouchableOpacity 
                            activeOpacity={ 0.75 }  
                            style={styles.border}
                            onPress={() => this.props.open.navigation.navigate('Noticias')} >
                        <Image resizeMode='contain' style={{ flex: 1, height: this.state.heightScreen / 2.5 }} source={item.logoCategoria} />
                      </TouchableOpacity>
                    </CardItem>
                    <CardItem footer>
                      <Text style={styles.text}>{item.nombre}</Text>
                    </CardItem>
                  </Card>
                }
              /> //SwiperBanner
        );
        

        return(
            <View style={styles.view}>
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>Banner de noticias</Text>
                </View>
                <View style={styles.swiper}>
                    {swiper ? swiper : null}
                </View>
            </View>
        );
    }
    
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },  
    card: {
        elevation: 3,
    },
    text:{
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
        fontWeight: 'bold',
    },
    swiper: {
        margin:5,
    }
});



