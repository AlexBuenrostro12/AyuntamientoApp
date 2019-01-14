import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import rightArrow from '../../assets/images/RightArrow/arrow.png'

const iconRight = ( props ) => (
    <TouchableOpacity>
        <Image 
            style={styles.icon} 
            source={rightArrow} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    icon: {
        height: 25,
        width: 25,
      },
});

export default iconRight;