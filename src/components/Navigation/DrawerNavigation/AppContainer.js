import React from 'react';
import { StyleSheet, View, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import {
	DrawerItems,
	createSwitchNavigator,
	createStackNavigator,
	createAppContainer,
	createDrawerNavigator
} from 'react-navigation';
import LoginScreen from '../../../Screens/Login/Login';
import ManualesScreen from '../../../Screens/Manuales/Manuales';
import BuzonCiudadanoScreen from '../../../Screens/BuzonCiudadano/BuzonCiudadano';
import NoticiasScreen from '../../../Screens/Noticias/Noticias';
import BusEscolarScreen from '../../../Screens/BusEscolar/BusEscolar';
import HomeScreen from '../../../Screens/Home/Home';
import IncidenciasScreen from '../../../Screens/Incidencias/Incidencias';
import ActividadesScreen from '../../../Screens/Actividades/Actividades';
import LogoutScreen from '../../../Screens/Logout/Logout';
import DescribeDataScreen from '../../DescribeData/DescribeData';
import MapScreen from '../../../Screens/Map/Map';
import EventosScreen from '../../../Screens/Eventos/Eventos';
import PagosScreen from '../../../Screens/Pagos/Pagos';
import AcercaDeScreen from '../../../Screens/AcercaDe/AcercaDe';
import TurismoScreen from '../../../Screens/Turismo/Turismo';

const CustomDrawerComponent = (props) => (
	<SafeAreaView style={styles.sAV}>
		<View style={styles.view}>
			<Image
				resizeMode="contain"
				style={styles.image}
				source={require('../../../assets/images/Logo/prs-logo.png')}
			/>
		</View>
		<ScrollView>
			<DrawerItems  {...props} />
		</ScrollView>
	</SafeAreaView>
);

const AppDrawer = createDrawerNavigator(
	{
		'Home': HomeScreen,
		'Transparencia': ManualesScreen,
		'Buzón Ciudadano': BuzonCiudadanoScreen,
		'Noticias': NoticiasScreen,
		'Bus Escolar': BusEscolarScreen,
		'Reporte ciudadano': IncidenciasScreen,
		'Actividades': ActividadesScreen,
		'Mapa de Tecalitlán': MapScreen,
		'Pagos': PagosScreen,
		'Eventos': EventosScreen,
		'Turismo': TurismoScreen,
		'Acerca de ...': AcercaDeScreen,
		'Salir': LogoutScreen
	},
	{
		contentComponent: CustomDrawerComponent,
		contentOptions: {
			// activeTintColor: '#676766',
			// labelStyle: {
			// 	fontSize: 17,
			// 	fontWeight: 'normal',
			// 	fontStyle: 'normal',
			// 	color: '#676766',
			// 	fontFamily: 'AvenirNextLTPro-Regular'
			// },
			activeBackgroundColor: '#f8ae40',
			itemStyle: {
				borderBottomWidth: 1 * 0.5,
				borderColor: '#676766'
			}
		},
	}
);

const AuthStack = createStackNavigator({ Auth: LoginScreen });
const DescribeStack = createStackNavigator({ Describe: DescribeDataScreen });

export default createAppContainer(
	createSwitchNavigator(
		{
			App: AppDrawer,
			Auth: AuthStack,
			Describe: DescribeStack,
		},
		{
			initialRouteName: 'Auth'
		}
	)
);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
	sAV: {
		flex: 1
	},
	view: {
		height: 150,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		height: width * 0.4,
		width: width * 0.4
	}
});
