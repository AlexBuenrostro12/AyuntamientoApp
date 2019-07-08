import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Item, Input, Label, Textarea, DatePicker, Picker } from 'native-base';
import { normalize } from '../AuxiliarFunctions/FontResponsive';

const { height, width } = Dimensions.get('window');

const customInput = (props) => {
	let input = null;
	let image = props.image && (
		<View
			style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				marginBottom: 10
			}}
		>
			<Image source={props.image} style={{ height: 160, width: 200 }} />
			<Text style={{ fontSize: 16, color: 'grey' }}>{props.name}</Text>
		</View>
	);
	switch (props.itemType) {
		case 'InlineLabel':
			input = (
				<Item style={{ alignItems: 'center', width: width * .80, height: width * .10 }}>
					<Input placeholder={props.holder} value={props.value} onChangeText={props.changed} />
				</Item>
			);
			break;
		case 'FloatingLabel':
			input = (
				<Item floatingLabel>
					<Label>{props.holder}</Label>
					<Input onChangeText={props.changed} secureTextEntry={props.password} />
				</Item>
			);
			break;
		case 'FloatingLabelWhite':
			input = (
				<Item floatingLabel>
					<Label style={{ color: 'white', fontSize: normalize(15) }}>{props.holder}</Label>
					<Input style={{ color: 'white' }} onChangeText={props.changed} secureTextEntry={props.password} />
				</Item>
			);
			break;
		case 'Textarea':
			input = <Textarea rowSpan={8} bordered placeholder={props.holder} onChangeText={props.changed} />;
			break;
		case 'Fecha':
			input = null;
			break;
		case 'Date':
			input = (
				<DatePicker
					defaultDate={new Date()}
					minimumDate={new Date(2018, 1, 1)}
					maximumDate={new Date(2022, 12, 31)}
					locale={'es'}
					timeZoneOffsetInMinutes={undefined}
					modalTransparent={false}
					animationType={'fade'}
					androidMode={'calendar'}
					placeHolderText={props.holder}
					textStyle={{ color: 'black' }}
					placeHolderTextStyle={{ color: 'black' }}
					onDateChange={props.changed}
					disabled={false}
				/>
			);
			break;
		case 'Hour':
			input = (
				<Item floatingLabel>
					<Label>{props.holder}</Label>
					<Input value={props.value} onTouchStart={props.changed1} />
				</Item>
			);
			break;
		case 'PickerSchedule':
			input = (
				<Picker
					mode="dropdown"
					iosHeader={props.value}
					iosIcon={
						<Image
							style={{ width: 25, height: 25 }}
							source={require('../../assets/images/ArrowDown/arrow-down.png')}
						/>
					}
					style={{ width: undefined }}
					selectedValue={props.value}
					onValueChange={props.changed}
				>
					<Picker.Item label="Matutino" value="Matutino" />
					<Picker.Item label="Vespertino" value="Vespertino" />
				</Picker>
			);
			break;
		case 'PickerDirection':
			input = (
				<Picker
					mode="dropdown"
					iosHeader={props.value}
					iosIcon={
						<Image
							style={{ width: 25, height: 25 }}
							source={require('../../assets/images/ArrowDown/arrow-down.png')}
						/>
					}
					style={{ width: undefined }}
					selectedValue={props.value}
					onValueChange={props.changed}
				>
					<Picker.Item label="Direction 1" value="Direction 1" />
					<Picker.Item label="Direction 2" value="Direction 2" />
					<Picker.Item label="Direction 3" value="Direction 3" />
					<Picker.Item label="Direction 4" value="Direction 4" />
				</Picker>
			);
			case 'PickAddress':
			input = (
				<Picker
					mode="dropdown"
					iosHeader={props.value}
					iosIcon={
						<Image
							style={{ width: 25, height: 25 }}
							source={require('../../assets/images/ArrowDown/arrow-down.png')}
						/>
					}
					style={{ width: undefined }}
					selectedValue={props.value}
					onValueChange={props.changed}
				>
					<Picker.Item label="Datos especificos" value="Datos especificos" />
					<Picker.Item label="Tarjeta del negocio" value="Tarjeta del negocio" />
				</Picker>
			);
			break;
			case 'PickCategory':
			input = (
				<Picker
					mode="dropdown"
					iosHeader={props.value}
					iosIcon={
						<Image
							style={{ width: 25, height: 25 }}
							source={require('../../assets/images/ArrowDown/arrow-down.png')}
						/>
					}
					style={{ width: undefined }}
					selectedValue={props.value}
					onValueChange={props.changed}
				>
					<Picker.Item label="Educación" value="Educación" />
					<Picker.Item label="Servicios publicos" value="Servicios publicos" />
					<Picker.Item label="Gasolinera" value="Gasolinera" />
					<Picker.Item label="Hotel" value="Hotel" />
					<Picker.Item label="Alimentos" value="Alimentos" />
					<Picker.Item label="Deporte" value="Deporte" />
					<Picker.Item label="Cultura" value="Cultura" />
					<Picker.Item label="Templo" value="Templo" />
					<Picker.Item label="Consultorio medico" value="Consultorio medico" />
					<Picker.Item label="Farmacia" value="Farmacia" />
				</Picker>
			);
			break;
		case 'LoadImage':
			input = (
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
					{image}
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
						<TouchableOpacity
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'center',
								backgroundColor: '#00a19a',
								flexGrow: 1,
								marginRight: 2
							}}
							onPress={() => props.loadPhoto('library')}
						>
							<Image
								style={{ height: 30, width: 30 }}
								source={require('../../assets/images/Imagen/image-white.png')}
							/>
							<Text style={styles.photoText}>Agregar Foto</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'center',
								backgroundColor: '#00847b',
								flexGrow: 1,
								marginRight: 2
							}}
							onPress={() => props.loadPhoto('camera')}
						>
							<Image
								style={{ height: 30, width: 30 }}
								source={require('../../assets/images/Imagen/camera.png')}
							/>
							<Text style={styles.photoText}>Tomar Foto</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
			break;
		default:
			input = null
			break;
	}

	return <View style={styles.inputElement}>{input}</View>;
};

const styles = StyleSheet.create({
	inputElement: {
		padding: 5
	},
	photoText: {
		fontWeight: 'bold',
		color: 'white',
		alignSelf: 'center'
	}
});

export default customInput;
