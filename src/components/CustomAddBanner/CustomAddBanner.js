import React from 'react';
import { Text, View, Image, StyleSheet, Dimensions } from 'react-native';
import { normalize } from '../AuxiliarFunctions/FontResponsive';
const { height, width } = Dimensions.get('window');

const customAddBanner = (props) => (
	<View style={styles.container}>
        <Image source={props.image} resizeMode='contain' style={styles.image} />
        <Text style={styles.title}>{props.title}</Text>
    </View>
);

export default customAddBanner;

const styles = StyleSheet.create({
	container: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: 'gainsboro',
        width: width * 0.95,
		justifyContent: 'space-around',
    },
    image: {
        height: width / 3.8,
		width: width / 3.8,
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 10,
    },
    title: {
        fontSize: normalize(22),
        color: "#f8ae40",
        fontWeight: 'bold',
        alignSelf: 'center',
    }
});
