import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ImageBackground } from 'react-native';

const { height, width } = Dimensions.get('window');

const ListData = (props) =>
	props.data.map((dt) => (
		<TouchableOpacity
			style={styles.marginContainer}
			onPress={() => props.clicked(dt.asunto, props.id)}
			key={dt.asunto}
		>
			<ImageBackground style={styles.image} source={require('../../assets/images/Ayuntamiento/fondo.jpg')}>
				<View style={styles.textContainer}>
					<Text style={styles.text}>{dt.asunto}</Text>
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
