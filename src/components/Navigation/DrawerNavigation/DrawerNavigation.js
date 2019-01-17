
import React from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import {StyleSheet, View, Image, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import iconLogo from '../../../assets/images/Logo/logo.png';
import GabineteScreen from '../../../Screens/Gabinete/Gabinete';
import MisionVisionScreen from '../../../Screens/MisionVision/MisionVision';
import PlanMunicipalDesarrolloScreen from '../../../Screens/PlanMunicipalDesarrollo/PlanMunicipalDesarrollo';
import ReglamentosScreen from '../../../Screens/Reglamentos/Reglamentos';
import OrganizacionScreen from '../../../Screens/Organizacion/Organizacion';
import ManualesScreen from '../../../Screens/Manuales/Manuales';
import GestionPublicaScreen from '../../../Screens/GestionPublica/GestionPublica';
import OrganizacionesCivilesScreen from '../../../Screens/OrganizacionesCiviles/OrganizacionesCiviles';
import DesarrolloUrbanoScreen from '../../../Screens/DesarrolloUrbano/DesarrolloUrbano';
import BuzonCiudadanoScreen from '../../../Screens/BuzonCiudadano/BuzonCiudadano';
import ConsultaCiudadanaScreen from '../../../Screens/ConsultaCiudadana/ConsultaCiudadana';
import NoticiasScreen from '../../../Screens/Noticias/Noticias';
import ActividadesScreen from '../../../Screens/Actividades/Actividades';
import BusEscolarScreen from '../../../Screens/BusEscolar/BusEscolar';
import HomeScreen from '../../../Screens/Home/Home';
import IncidenciasScreen from '../../../Screens/Incidencias/Incidencias';
import { Root } from 'native-base';

const CustomDrawerComponent = ( props ) => (
    <SafeAreaView style={styles.sAV}>
        <View style={styles.view}>
            <Image style={styles.image} source={iconLogo} />
        </View>
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
);


const DrawerNavigation = createDrawerNavigator({
    'Home':  HomeScreen,
    'Gabinete': GabineteScreen,
    'Misión y Visión': MisionVisionScreen,
    'Plan Municipal de Desarrollo': PlanMunicipalDesarrolloScreen,
    'Reglamentos': ReglamentosScreen,
    'Organización': OrganizacionScreen,
    'Manuales': ManualesScreen,
    'Gestión Pública': GestionPublicaScreen,
    'Organizaciones Civiles': OrganizacionesCivilesScreen,
    'Desarrollo Urbano': DesarrolloUrbanoScreen,
    'Buzón Ciudadano': BuzonCiudadanoScreen,
    'Consulta Ciudadana': ConsultaCiudadanaScreen,
    'Noticias': NoticiasScreen,
    'Actividades': ActividadesScreen,
    'Buz Escolar': BusEscolarScreen,
    'Incidencias': IncidenciasScreen,
},{
    contentComponent: CustomDrawerComponent
});

const styles = StyleSheet.create({
    sAV: {
        flex: 1
    },
    view: {
        height:150,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 120,
        width: 120,
        borderRadius: 2
    }
});

export default () =>
    <Root>
        <DrawerNavigation />
    </Root>;
    