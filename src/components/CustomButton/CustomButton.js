import React from 'react';
import { View, StyleSheet, Button, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

const customButton = (props) => {
	let button = null;

	switch (props.style) {
		case 'Success':
			button = <Button onPress={props.clicked} title={props.name} color="#869E25" />;
			break;

		case 'Danger':
			button = <Button onPress={props.clicked} title={props.name} color="#E0013F" />;
			break;

		case 'DangerBorder':
			button = <Button onPress={props.clicked} title={props.name} color="#E0013F" />;
			break;

		case 'Login':
			button = <Button onPress={props.clicked} title={props.name} color="#878787" />;
			break;

		case 'Emergencia':
			button = <Button onPress={props.clicked} title={props.name} color="red" />;
			break;
		case 'SuccessReport':
			button = <TouchableOpacity onPress={props.clicked} style={{ flex: 1, alignItems: "center", backgroundColor: "#bac95f", padding: 5, borderRadius: 3 }}>
				<Text style={styles.report}>{props.name}</Text>
			</TouchableOpacity>;
			break;
		case 'CallReport':
			button = <TouchableOpacity onPress={props.clicked} style={{ flex: 1, alignItems: "center", backgroundColor: "#c7175b", padding: 5, borderRadius: 3 }}>
				<Text style={styles.report}>{props.name}</Text>
			</TouchableOpacity>;
			break;
		case 'SaveActivity':
			button = (
				<View style={styles.saveActivity}>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text style={styles.saveActivityText}>{props.date}</Text>
						<Text style={styles.saveActivityTextInfo}>Guardar en calendario</Text>
					</View>
					<TouchableOpacity onPress={props.clicked}>
						<Image
							resizeMode="contain"
							style={styles.saveActivityImage}
							source={require('../../assets/images/Preferences/saveW.png')}
						/>
					</TouchableOpacity>
				</View>
			);
			break;
		default:
			button = <Button onPress={props.clicked} title={props.name} color="blue" />;
			break;
	}

	return <View style={styles.buttonStyle}>{button}</View>;
};

const styles = StyleSheet.create({
	text: {
		fontWeight: '500'
	},
	buttonStyle: {
		padding: 5,
		flexGrow: 1
	},
	saveActivity: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		backgroundColor: '#f8ae40',
		alignItems: 'center',
		width: width / 1.1,
		height: width / 8
	},
	saveActivityText: {
		fontSize: 18,
		fontStyle: 'normal',
		fontWeight: 'bold',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	saveActivityTextInfo: {
		fontSize: 16,
		fontStyle: 'italic',
		fontWeight: 'normal',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular'
	},
	saveActivityImage: {
		height: width / 12,
		width: width / 12
	},
	report: {
		fontSize: 16,
		fontStyle: 'normal',
		fontWeight: 'bold',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular',
		alignSelf: 'center',
		marginTop: Platform.OS === 'ios' ? 5 : 0,
	},
});

export default customButton;
