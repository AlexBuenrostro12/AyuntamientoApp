import React from 'react';
import { StyleSheet, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { DrawerItems, createSwitchNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import iconLogo from '../../../assets/images/Logo/prs-logo.png';
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

const CustomDrawerComponent = (props) => (
	<SafeAreaView style={styles.sAV}>
		<View style={styles.view}>
			<Image style={styles.image} source={iconLogo} />
		</View>
		<ScrollView>
			<DrawerItems {...props} />
		</ScrollView>
	</SafeAreaView>
);

const AppDrawer = createDrawerNavigator({
  'Home':  HomeScreen,
  'Manuales': ManualesScreen,
  'Buzón Ciudadano': BuzonCiudadanoScreen,
  'Noticias': NoticiasScreen,
  'Bus Escolar': BusEscolarScreen,
  'Incidencias': IncidenciasScreen,
  'Actividades': ActividadesScreen,
  'Describe' : DescribeDataScreen,
  'Salir': LogoutScreen,
},{
  contentComponent: CustomDrawerComponent
});

const AuthStack = createStackNavigator({ Auth: LoginScreen });

export default createAppContainer(
	createSwitchNavigator(
		{
			App: AppDrawer,
			Auth: AuthStack,
		},
		{
			initialRouteName: 'Auth'
		}
  )
);

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
		height: 130,
		width: 110
	}
});