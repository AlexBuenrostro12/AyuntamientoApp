import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import menu from '../../assets/images/Menu/menu.png';

const iconMenu = ( props ) => (
    <TouchableOpacity onPress={() => props.open.navigation.openDrawer()}>
        <Image 
            style={styles.icon} 
            source={menu} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    icon: {
        height: 25,
        width: 25,
      },
});

export default iconMenu;