import React from 'react';
import { Text, View, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { height, width } = Dimensions.get('window');

const customCardItemTitle = (props) => (
		<ImageBackground
			style={styles.container}
			resizeMode="cover"
			width={width * 0.95}
			source={require('../../assets/images/Preferences/banner.jpeg')}
		>
			<View style={styles.responsiveContainer}>
			{/* View image */}
			<View style={styles.buttonsContainer}>
				<Image style={styles.image} source={props.image} />
			</View>
			{/* View text */}
			<View style={styles.textContainer}>
				<Text style={styles.title}>{props.title}</Text>
				<Text style={styles.description}>{props.description}</Text>
				<Text style={styles.info}>{props.info}</Text>
			</View>
			</View>
		</ImageBackground>
);

export default customCardItemTitle;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: 'gainsboro',
	},
	responsiveContainer: {
		flex: 1,
		flexDirection: 'row',
		width: width * 0.95,
		justifyContent: 'space-around',
	},
	textContainer: {
		flex: 2,
		flexDirection: 'column',
		alignSelf: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: 6,
	},
	title: {
		color: '#f8ae40',
		fontSize: 18,
		fontWeight: 'bold'
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
		alignItems: 'center',
		paddingHorizontal: 6,
	},
	iconImage: {
		height: 45,
		width: 45,
		resizeMode: 'contain'
	}
});
