import React from 'react';
import { StyleSheet, SafeAreaView, View, Alert, ImageBackground, Image, Dimensions, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBar from '../../UI/StatusBar/StatusBar';

export default class Logout extends React.Component {

    state = {
        showAlert: true,
        alert: null
    };

     //Style of drawer navigation
	 static navigationOptions = {
		drawerLabel: () => (<Text style={styles.drawerLabel}>Salir</Text>),
		drawerIcon: ({ tintColor }) => (
			<Image 
				source={require('../../assets/images/Drawer/logout.png')}
				style={styles.drawerIcon}
				resizeMode='contain' />
		)
	};

    componentDidMount() {
        const alert = Alert.alert(
            'Salir',
            '¡Hasta pronto!',
            [ 
                { text: 'Ok', onPress: () => this.removeStorage() },
            ],
            { cancelable: false }
        );
        this.setState({ alert: alert });
        console.log('Logout: ComponentDidMount');
    }

    removeStorage = async () => {
        try {
            console.log('Entro al try');
            await AsyncStorage.removeItem('@storage_token');
            await AsyncStorage.removeItem('@storage_expiresIn');
            await AsyncStorage.removeItem('@storage_email');
            //Go back to Auth screen
            this.props.navigation.navigate('Auth');  
            console.log('Logout: Try, removeStorage');
             
        } catch (e) {
            //Catch posible errors
        }
        
    }

	render() {
		return (
			<SafeAreaView style={styles.container}>
				{/* Chek if the token is valid yet if it's not return to the login */}
				<StatusBar color="#FEA621" />
                <ImageBackground
                    imageStyle={{ resizeMode: 'stretch' }}
                    source={require('../../assets/images/Ayuntamiento/fondo.jpg')}
                    style={styles.containerImage}
                >
                    <Image 
						style={styles.image} 
						source={require('../../assets/images/Ayuntamiento/logo.png')} />
                </ImageBackground>
				<View style={null}>
                    {this.state.alert}
				</View>
			</SafeAreaView>
		);
	}
}
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
    },
    containerImage: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',	
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
		fontWeight: 'bold'
    },
    image: {
		resizeMode: 'contain',
		height: height / 2,
		width: width / 2,
		alignSelf: 'center',
    },
    drawerIcon: {
		height: width * .07,
		width: width * .07,
	},
	drawerLabel: {
		width: width,
		marginLeft: 18,
		paddingBottom: 15,
		paddingTop: 15,
		color: '#676766',
		fontSize: 18,
		fontFamily: 'AvenirNextLTPro-Regular'
	}
});
