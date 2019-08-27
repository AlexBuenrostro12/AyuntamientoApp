import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Card } from 'native-base';

const { height, width } = Dimensions.get('window');

const ListData = (props) => {
	const icons = props.data.map((dt) => (
		<TouchableOpacity
			style={styles.marginContainer}
			// in the property onPress, there is an special case to BusEscolar.js and Buses.js that's why pass other properties instead dt.title
			onPress={() =>
				dt.title ? props.clicked(dt.title, props.id) : props.clicked(dt.horaSalida, dt.destino, props.id)}
			key={props.id}
		>
			<ImageBackground
				style={styles.image}
				source={!dt.imagen ? require('../../assets/images/Ayuntamiento/fondo.jpg') : { uri: dt.imagen }}
			>
				<View style={styles.textContainer}>
					{dt.title ? (
						<Text style={styles.text}>{dt.title}</Text>
					) : (
						<Text style={styles.text}>
							{dt.destino} - {dt.horaSalida}
						</Text>
					)}
				</View>
			</ImageBackground>
		</TouchableOpacity>
	));
	const list = props.data.map((dt) => (
		<TouchableOpacity
			style={styles.marginContainer}
			// in the property onPress, there is an special case to BusEscolar.js and Buses.js that's why pass other properties instead dt.title
			onPress={() =>
				dt.title ? props.clicked(dt.title, props.id) : props.clicked(dt.horaSalida, dt.destino, props.id)}
			key={props.id}
		>
			<View
				style={{
					justifyContent: 'center',
					width: width / 1.18,
					backgroundColor: !dt.odd ? 'gainsboro' : 'white'
				}}
			>
				{dt.title ? (
					<Text style={styles.textList}>
						{dt.fecha} / {dt.title}
					</Text>
				) : (
					<Text style={styles.textList}>
						{dt.destino} - {dt.horaSalida}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	));

	return <View>{props.showLikeIcons ? icons : list}</View>;
};

export default ListData;

const styles = StyleSheet.create({
	marginContainer: {
		marginTop: 2,
		marginBottom: 10
	},
	image: {
		height: width / 2.38,
		width: width / 2.38,
		resizeMode: 'contain',
		flexDirection: 'column',
		justifyContent: 'flex-end'
	},
	imageEvent: {
		height: width / 2.38,
		width: width / 2.38,
		resizeMode: 'contain',
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	text: {
		alignSelf: 'center',
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold'
	},
	eventText: {
		alignSelf: 'center',
		color: 'white',
		fontSize: 14,
		fontWeight: 'bold'
	},
	textContainer: {
		justifyContent: 'center',
		height: width / 2.38 / 2,
		width: width / 2.38,
		backgroundColor: 'black',
		opacity: 0.5
	},
	textList: {
		alignSelf: 'flex-start',
		color: '#676766',
		fontSize: 16,
		fontWeight: 'bold'
	}
});
