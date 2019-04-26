import React from 'react';
import { StyleSheet, SafeAreaView, View, Alert, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBar from '../../UI/StatusBar/StatusBar';

export default class Logout extends React.Component {

    state = {
        showAlert: true,
        alert: null
    }

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
				<View style={styles.view}>
					<StatusBar color="#FEA621" />
					<View style={{ flex: 1 }}>
                        {this.state.alert}
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
		fontWeight: 'bold'
	}
});
