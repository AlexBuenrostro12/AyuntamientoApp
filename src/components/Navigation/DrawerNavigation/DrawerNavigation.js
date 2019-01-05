
import React from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import {StyleSheet, View, Image, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import iconLogo from '../../../assets/images/Logo/logo.png';
import GabineteScreen from '../../../Screens/Gabinete/Gabinete';
import MisionVisionScreen from '../../../Screens/MisionVision/MisionVision';
import PlanMunicipalDesarrollo from '../../../Screens/PlanMunicipalDesarrollo/PlanMunicipalDesarrollo';
import Reglamentos from '../../../Screens/Reglamentos/Reglamentos';
import Organizacion from '../../../Screens/Organizacion/Organizacion';
import Manuales from '../../../Screens/Manuales/Manuales';
import GestionPublica from '../../../Screens/GestionPublica/GestionPublica';
import OrganizacionesCiviles from '../../../Screens/OrganizacionesCiviles/OrganizacionesCiviles';
import DesarrolloUrbano from '../../../Screens/DesarrolloUrbano/DesarrolloUrbano';

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


const drawerNavigation = createDrawerNavigator({
    'Gabinete': GabineteScreen,
    'Misión y Visión': MisionVisionScreen,
    'Plan Municipal de Desarrollo': PlanMunicipalDesarrollo,
    'Reglamentos': Reglamentos,
    'Organización': Organizacion,
    'Manuales': Manuales,
    'Gestión Pública': GestionPublica,
    'Organizaciones Civiles': OrganizacionesCiviles,
    'Desarrollo Urbano': DesarrolloUrbano,
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

export default drawerNavigation;