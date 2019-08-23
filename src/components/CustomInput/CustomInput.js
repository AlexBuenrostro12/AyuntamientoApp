import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import { Item, Input, Label, Textarea, DatePicker, Picker } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
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
				<Item style={{ alignItems: 'center', width: width * 0.8, height: width * 0.1 }}>
					<Input style={{ color: '#676766', fontSize: 17 }} placeholder={props.holder} value={props.value} onChangeText={props.changed} />
				</Item>
			);
			break;
		case 'FloatingLabel':
			input = (
				<Item floatingLabel>
					<Label style={{ color: '#676766', fontSize: 17 }}>{props.holder}</Label>
					<Input style={{ color: '#676766', fontSize: 17 }} onChangeText={props.changed} secureTextEntry={props.password} />
				</Item>
			);
			break;
		case 'FloatingLabelWhite':
			input = (
				<Item floatingLabel>
					<Label style={{ color: 'white', fontSize: normalize(15) }}>{props.holder}</Label>
					<Input onEndEditing={() => props.endEditing(props.holder)} onFocus={() => props.focused(props.holder)} style={{ color: 'white' }} onChangeText={props.changed} secureTextEntry={props.password} />
				</Item>
			);
			break;
		case 'Textarea':
			input = <Textarea style={{ color: '#676766', fontSize: 17 }} rowSpan={8} bordered placeholder={props.holder} onChangeText={props.changed} />;
			break;
		case 'Fecha':
			input = null;
			break;
		case 'Date':
			input = (
				// marginRight don't work 
				<View style={{  marginRight: Platform.OS === 'ios' ? 18 : 22 }}>
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
						textStyle={{ color: '#676766', fontSize: 17 }}
						placeHolderTextStyle={{ color: '#676766', fontSize: 17 }}
						onDateChange={props.changed}
						disabled={false}
					/>
				</View>
			);
			break;
		case 'Hour':
			input = (
				<Item floatingLabel>
					<Label style={{ color: '#676766', fontSize: 17 }}>{props.holder}</Label>
					<Input style={{ color: '#676766', fontSize: 17 }} value={props.value} onTouchStart={props.changed1} />
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
					style={{ width: undefined, alignSelf: 'flex-start', color: '#676766', fontSize: 17 }}
					selectedValue={props.value}
					onValueChange={props.changed}
				>
					<Picker.Item label="Matutino" value="Matutino" />
					<Picker.Item label="Vespertino" value="Vespertino" />
				</Picker>
			);
			break;
		case 'PickerDirection':
			const directions = [
				{ name: 'Reglamentos' },
				{ name: 'Secretario general' },
				{ name: 'Comunicación social' },
				{ name: 'Obras públicas' },
				{ name: 'Educación' },
				{ name: 'Planeación y participación ciudadana' },
				{ name: 'Turismo' },
				{ name: 'Fomento agropecuario' },
				{ name: 'Agua potable' },
				{ name: 'Servicios generales' },
				{ name: 'Parques y jardines' },
				{ name: 'Alumbrado público' },
				{ name: 'Cementerio' },
				{ name: 'Ecología' },
				{ name: 'Seguridad pública' },
				{ name: 'Protección civil' },
				{ name: 'Vialidad' },
			];
			const catItems = directions.map((dir, index) => (
				<Picker.Item key={index} label={dir.name} value={dir.name} />
			))
			input = (
				<Picker
					mode="dropdown"
					iosHeader={props.value}
					// iosIcon={null}
					style={Platform.OS === 'ios' ? { alignSelf: 'center', marginRight: 15 } : { width: undefined, color: '#676766', fontSize: 17, marginRight: 25 }}
					selectedValue={props.value}
					onValueChange={props.changed}
				>
					{catItems}
				</Picker>
			);
			break;
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
					style={{ width: undefined, color: '#676766', fontSize: 17 }}
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
					style={{ width: undefined, color: '#676766', fontSize: 17 }}
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
					<Picker.Item label="Servicios medicos" value="Servicios medicos" />
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
		case 'LoadMultipleImage':
			input = (
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
					{props.arrayOfUris.length !== 0 && (
						<View style={styles.scrollDataListIcons}>
							{props.arrayOfUris.map((u) => (
								<Image
									key={u.uri}
									source={u}
									style={{
										height: width * .45,
										width: width * .38,
										resizeMode: 'contain',
										marginRight: 3,
										marginBottom: 3
									}}
								/>
							))}
						</View>
					)}
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
							onPress={() => props.loadPhotos()}
						>
							<Image
								style={{ height: 30, width: 30 }}
								source={require('../../assets/images/Imagen/image-white.png')}
							/>
							<Text style={styles.photoText}>Agregar Fotos</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
			break;
		case 'PickDay':
			const days = [];
			for (let i = 1; i < 32; i++) days.push({ day: i });
			const daysItems = days.map((d) => (
				<Picker.Item key={d.day} label={d.day.toString()} value={d.day.toString()} />
			));
			input = (
				<View>
					<Text style={{ color: '#676766', fontSize: 17 }}>Seleccione día del evento</Text>
					<Picker
						mode="dropdown"
						iosHeader={props.value}
						iosIcon={
							<Image
								style={{ width: 25, height: 25 }}
								source={require('../../assets/images/ArrowDown/arrow-down.png')}
							/>
						}
						style={{ width: undefined, color: '#676766', fontSize: 17 }}
						selectedValue={props.value}
						onValueChange={props.changed}
					>
						{daysItems}
					</Picker>
				</View>
			);
			break;
		case 'PickTypeEvent':
			const typeEvents = props.typeEvents.map((e) => (
				<Picker.Item
					key={e.id}
					label={e.typeEventData.typeEvent.toString()}
					value={e.typeEventData.typeEvent.toString()}
				/>
			));
			const otherType = (
				<Item style={{ alignItems: 'center', width: width * 0.8, height: width * 0.1 }}>
					<Input
						placeholder="Nombre del nuevo evento"
						value={props.typeEvent}
						onChangeText={props.changedTypeEvent}
						style={{ color: '#676766', fontSize: 17 }}
					/>
				</Item>
			);
			let ban = false;
			if (props.value === 'Agregar evento') ban = true;
			input = (
				<View>
					<Text style={{ color: '#676766', fontSize: 17 }}>Seleccione tipo del evento</Text>
					<Picker
						mode="dropdown"
						iosHeader={props.value}
						iosIcon={
							<Image
								style={{ width: 25, height: 25 }}
								source={require('../../assets/images/ArrowDown/arrow-down.png')}
							/>
						}
						style={{ width: undefined, color: '#676766', fontSize: 17 }}
						selectedValue={props.value}
						onValueChange={props.changed}
					>
						{typeEvents}
					</Picker>
					{ban && otherType}
				</View>
			);
			break;
		case 'PickLocation':
			let chosenMarker = null;
			if (props.chosenLocation) chosenMarker = <Marker coordinate={props.focusedLocation} />;

			const initialRegion = {
				latitude: 19.47151,
				longitude: -103.30706,
				latitudeDelta: 0.0122,
				longitudeDelta: width / height * 0.0122
			};
			input = (
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
						<Text style={{ alignSelf: 'center', fontSize: 17, marginTop: 5, color: 'black' }}>Obtener ubicación actual</Text>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={() => props.findLocationHandler()}>
							<Image source={require('../../assets/images/Preferences/user-location.png')} style={{ width: width * .10, height: width * .10, resizeMode: 'contain', alignSelf: 'center' }} />
						</TouchableOpacity>
					</View>
					<MapView
						style={styles.mapMarkerPicker}
						initialRegion={initialRegion}
						region={props.focusedLocation}
						onPress={props.pickLocationHandler}
					>
						{chosenMarker}
					</MapView>
				</View>
			);
			break;
		default:
			input = null;
			break;
	}
	return <View style={styles.inputElement}>{input}</View>;
};

const styles = StyleSheet.create({
	inputElement: {
		padding: 5,
	},
	photoText: {
		fontWeight: 'bold',
		color: 'white',
		alignSelf: 'center'
	},
	mapMarkerPicker: {
		width: '100%',
		height: 250,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	},
	scrollDataListIcons: {
		flex: 2,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

export default customInput;
