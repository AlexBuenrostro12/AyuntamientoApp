import React from 'react';
import { Text, View, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { CardItem } from 'native-base';

const { height, width } = Dimensions.get('window');

const customCardItemTitle = (props) => (
	// <CardItem header bordered style={{ flex: 1 }}>
			/* <View style={styles.container}> */
		<ImageBackground style={styles.container} resizeMode='contain' source={require('../../assets/images/Preferences/banner.jpeg')}>
				<View style={styles.buttonsContainer}>
					{/* image */}
					<Image style={styles.image} source={props.image} />
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.title}>{props.title}</Text>
					<Text style={styles.description}>{props.description}</Text>
					<Text style={styles.info}>{props.info}</Text>
				</View>
		</ImageBackground>
			/* </View> */
	// </CardItem>
);

export default customCardItemTitle;

const styles = StyleSheet.create({
	container: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	textContainer: {
		flex: 2,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignContent: 'flex-start',
		alignItems: 'flex-start',
		marginTop: 10,
	},
	title: {
		color: '#f8ae40',
		fontSize: 18,
		fontWeight: 'bold',
	},
	description: {
		color: '#676766',
		fontStyle: 'italic',
		fontSize: 16
	},
	info: {
		color: '#f8ae40',
		fontStyle: 'italic',
		fontSize: 14
	},
	image: {
        alignSelf: 'center',
        resizeMode: 'contain',
		height: width / 3.5,
		width: width / 3.5
	},
	buttonsContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	iconImage: {
		height: 45,
		width: 45,
		resizeMode: 'contain'
	}
});
