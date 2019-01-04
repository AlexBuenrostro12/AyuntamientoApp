
import React from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import {StyleSheet, View, Image, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import GabineteScreen from '../../../Screens/Gabinete/Gabinete';
import MisionVisionScreen from '../../../Screens/MisionVision/MisionVision';
import iconLogo from '../../../assets/images/Logo/logo.png';


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
    Gabinete: GabineteScreen,
    MisionyVision: MisionVisionScreen,
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