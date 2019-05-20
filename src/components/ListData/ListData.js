import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ImageBackground } from 'react-native';

const { height, width } = Dimensions.get('window');

const ListData = (props) =>
	props.data.map((dt) => (
		<TouchableOpacity
			style={styles.marginContainer}
			onPress={() => props.clicked(dt.title, props.id)}
			key={props.id}
		>
			<ImageBackground style={styles.image} source={!dt.imagen ? require('../../assets/images/Ayuntamiento/fondo.jpg') : { uri: dt.imagen }}>
				<View style={styles.textContainer}>
					<Text style={styles.text}>{dt.title}</Text>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	));

export default ListData;

const styles = StyleSheet.create({
	marginContainer: {
		marginTop: 2,
		marginBottom: 2
	},
	image: {
		height: width / 2.38,
		width: width / 2.38,
		resizeMode: 'contain',
		flexDirection: 'column',
		justifyContent: 'flex-end'
	}, 
	text: {
		alignSelf: 'center',
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	textContainer: {
		justifyContent: 'center',
		height: (width / 2.38) / 2,
		width: width / 2.38,
		backgroundColor: 'black',
		opacity: 0.5

	}
});
