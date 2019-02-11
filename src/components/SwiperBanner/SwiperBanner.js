import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Card, CardItem, Thumbnail, Left, Body } from 'native-base';
import CustomButton from '../../components/CustomButton/CustomButton';

export default class SwiperBanner extends Component {
    state = {
        bannerItems: [],
        heightScreen: 0,
        widthScreen: 0,
    }

    componentWillMount() {
        let bannerItems = [];
        if (this.props.news) {
            this.props.news.map(nw => {
                bannerItems.push({
                    logo: require('../../assets/images/Ayuntamiento/ayuntamiento.jpg'),
                    nombre: nw.data.nombre,
                    categoria: nw.data.categoria,
                    fecha: nw.data.fecha,
                    logoCategoria: this.choseCategoryLogo(nw.data.categoria)
                });
            });
            let { height, width } = Dimensions.get('window');
            this.setState({ bannerItems: bannerItems, heightScreen: height, widthScreen: width });
        }
    }

    choseCategoryLogo = (category) => {
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

        const titleDescription = (
            <View style={{ flex: 1, margin: 5 }}>
                <Card>
                    <CardItem header bordered>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginTop: 18 }}>
                                <Text style={{ color: 'orange', fontSize: 18 }}>Banner de noticias</Text>
                                <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 14 }}>Deslice y conozca
                                    las noticias mas relevantes dando clic en la imagen.</Text>
                            </View>
                            <Image style={{ resizeMode: 'contain', height: 90, width: 70 }} source={require('../../assets/images/Home/home.png')} />
                        </View>
                    </CardItem>
                </Card>
            </View>
        );
        const scrollBanner = (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {this.state.bannerItems.map(item => (
                    <Card key={item.nombre} style={{ elevation: 3, height: this.state.heightScreen / 1.6, width: this.state.widthScreen / 1.07 }}>
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
                                activeOpacity={0.75}
                                style={styles.border}
                                onPress={() => this.props.open.navigation.navigate('Noticias')} >
                                <View style={{ alignItems: 'center' }}>
                                    <Image resizeMode='contain' style={{ height: this.state.heightScreen / 3, width: this.state.widthScreen / .6 }} source={item.logoCategoria} />
                                </View>
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem footer>
                            <Text style={styles.text}>{item.nombre}</Text>
                        </CardItem>
                    </Card>
                ))}
            </View>
        );
        return (
            <View style={{ flex: 1, flexDirection: 'column', }}>
                {titleDescription}
                <ScrollView style={{ flex: 1, marginLeft: 5, marginRight: 5, marginBottom: 5 }} horizontal={true} showsHorizontalScrollIndicator={false}>
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



