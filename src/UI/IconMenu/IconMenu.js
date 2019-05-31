import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import menu from '../../assets/images/Menu/menu-white.png';

const { height, width } = Dimensions.get('window');

const iconMenu = ( props ) => (
    <TouchableOpacity onPress={() => props.open.navigation.openDrawer()}>
        <Image 
            style={styles.icon} 
            source={menu} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    icon: {
        height: height / 28,
        width: height / 28,
      },
});

export default iconMenu;