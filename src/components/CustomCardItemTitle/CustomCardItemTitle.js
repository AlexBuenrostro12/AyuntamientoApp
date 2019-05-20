import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CardItem } from 'native-base';

const { height, width } = Dimensions.get('window');

const customCardItemTitle = (props) => (
	<CardItem header bordered>
		<View style={styles.container}>
			<View style={styles.textContainer}>
				<Text style={styles.title}>{props.title}</Text>
				<Text style={styles.description}>{props.description}</Text>
			</View>
			<View style={styles.buttonsContainer}>
				{/* Image */}
				<Image style={styles.image} source={props.image} />
				{/* refresh */}
				{props.showButtons && <TouchableOpacity onPress={() => props.get()}>
					<Image style={styles.iconImage} source={require('../../assets/images/Refresh/refresh.png')} />
				</TouchableOpacity>}
				{/* refresh */}
				{props.showButtons && <TouchableOpacity onPress={() => props.add()}>
					<Image style={styles.iconImage} source={require('../../assets/images/Add/add.png')} />
				</TouchableOpacity>}
			</View>
		</View>
	</CardItem>
);

export default customCardItemTitle;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	textContainer: {
		flex: 1,
		marginTop: 18
	},
	title: {
		color: 'orange',
		fontSize: 18
	},
	description: {
		color: 'grey',
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
