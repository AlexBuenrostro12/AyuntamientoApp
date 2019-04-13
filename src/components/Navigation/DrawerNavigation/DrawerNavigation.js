import React from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import {StyleSheet, View, Image, SafeAreaView, ScrollView } from 'react-native';
import iconLogo from '../../../assets/images/Logo/prs-logo.png';
import ManualesScreen from '../../../Screens/Manuales/Manuales';
import BuzonCiudadanoScreen from '../../../Screens/BuzonCiudadano/BuzonCiudadano';
import NoticiasScreen from '../../../Screens/Noticias/Noticias';
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
    'Manuales': ManualesScreen,
    'Buzón Ciudadano': BuzonCiudadanoScreen,
    'Noticias': NoticiasScreen,
    'Bus Escolar': BusEscolarScreen,
    'Incidencias': IncidenciasScreen,
},{
    contentComponent: CustomDrawerComponent
});

const MyNavigation = (props) => {
    return (
        <DrawerNavigation />
    );
}

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
        height: 130,
        width: 110,
    }
});

export default MyNavigation;
// export default () =>
//     <Root>
//         {/* <DrawerNavigation /> */}
//     </Root>;
    