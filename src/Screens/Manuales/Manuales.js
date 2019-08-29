import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	Dimensions,
	Alert,
	ScrollView,
	Image,
	BackHandler
} from 'react-native';
import { Card, CardItem } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import axiosPDF from 'axios';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import Manual from '../../components/Manual/Manual';
import CustomAddBanner from '../../components/CustomAddBanner/CustomAddBanner';
import axios from '../../../axios-ayuntamiento';

const { height, width } = Dimensions.get('window');

export default class Manuales extends Component {
	_didFocusSubscription;
	_willBlurSubscription;

	state = {
		show: false,
		token: null,
		showLikeIcons: true,
		resPdf: null,
		loading: false,
		manuals: [],
		date: null,
		isAdmin: null
	};

	constructor(props) {
		super(props);
		this._didFocusSubscription = props.navigation.addListener('didFocus', (payload) =>
			BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	//Style of drawer navigation
	static navigationOptions = {
		drawerLabel: () => (<Text style={styles.drawerLabel}>Transparencia</Text>),
		drawerIcon: ({ tintColor }) => (
			<Image
				source={require('../../assets/images/Drawer/transparency.png')}
				style={styles.drawerIcon}
				resizeMode="contain"
			/>
		)
	};

	async componentDidMount() {
		//BackHandler
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);

		let token = (expiresIn = email = null);
		try {
			console.log('Entro al try');
			token = await AsyncStorage.getItem('@storage_token');
			expiresIn = await AsyncStorage.getItem('@storage_expiresIn');
			email = await AsyncStorage.getItem('@storage_email');
			//Use the expires in
			const parseExpiresIn = new Date(parseInt(expiresIn));
			const now = new Date();
			console.log('Manuales.js: ', token);
			console.log('Manuales.js: ', parseExpiresIn, now);
			if (token && parseExpiresIn > now) {
				this.setState({ token: token });

				if (email !== 'false') this.setState({ isAdmin: true });
				else this.setState({ isAdmin: false });
				this.getManuals();
			} else {
				try {
					console.log('Entro al try');
					await AsyncStorage.removeItem('@storage_token');
					await AsyncStorage.removeItem('@storage_expiresIn');
					//Use the expires in
				} catch (e) {
					//Catch posible errors
				}
				Alert.alert(
					'Transparencia',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errors
		}
	}

	onBackButtonPressAndroid = () => {
		const { openDrawer, closeDrawer, dangerouslyGetParent } = this.props.navigation;
		const parent = dangerouslyGetParent();
		const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;

		if (!this.state.show) {
			if (isDrawerOpen) closeDrawer();
			else openDrawer();
		} else {
			this.setState({ show: false })
		}


		return true;
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	onSelectPdfHandler = () => {
		DocumentPicker.show(
			{
				filetype: [ DocumentPickerUtil.pdf() ]
			},
			(error, res) => {
				console.log('resPDF: ', res);
				this.setState({ resPdf: res });
			}
		);
	};

	uploadFile = ({ uri, fileName, fileSize, type } = res) => {
		console.log('Res: ', uri, type, fileName, fileSize);
		this.setState({ loading: true });
		const fd = new FormData();
		fd.append('file', {
			name: fileName,
			size: fileSize,
			type: type,
			uri: uri
		});
		axiosPDF({
			url: 'https://us-central1-ayuntamiento-77d3b.cloudfunctions.net/uploadFile',
			method: 'POST',
			headers: {
				'Content-Type': type
			},
			data: fd
		})
			.then((response) => {
				console.log('response: ', response);
				const { data } = response;
				console.log('data: ', data);
				const { resp } = data;
				console.log('resp: ', resp);
				let name = null;
				let encodeName = null;
				let bucket = null;
				for (let i = 0; i < resp.length; i++) {
					if (i === 0) {
						const element = resp[i];
						console.log('elementResp: ', element);
						encodeName = element.id;
						console.log('encode: ', encodeName);
						name = element.name;
						console.log('name: ', name);
						bucket = element.metadata['bucket'];
						console.log('bucket: ', bucket);
					}
				}
				//Make the url to download the pdf file
				const url =
					'https://firebasestorage.googleapis.com/v0/b/' +
					bucket +
					'/o/' +
					encodeName +
					'?alt=media&token=' +
					this.state.token;
				console.log('url: ', url);
				this.saveDataHandler(name, url);
			})
			.catch((err) => {
				console.log('error: ', err);
			});
	};

	savePdfHandler = () => {
		if (this.state.resPdf) {
			const { uri, type, fileName, fileSize } = this.state.resPdf;
			console.log('Save pdf: ', uri, 'type: ', type, 'file: ', fileName);
			this.uploadFile(this.state.resPdf);
		} else {
			Alert.alert(
				'Trasparencia',
				'¡Seleccione algun documento para subir!',
				[ { text: 'Ok', onPress: () => null } ],
				{ cancelable: false }
			);
		}
	};

	saveDataHandler = (file, url) => {
		this.getCurrentDate();
		const manual = {
			manualData: {
				name: file,
				url: url,
				date: this.state.date
			}
		};
		axios
			.post('/manuales.json?auth=' + this.state.token, manual)
			.then((response) => {
				this.setState({ loading: false });
				Alert.alert(
					'Transparencia',
					'¡Documento enviado con exito!',
					[ { text: 'Ok', onPress: () => this.getManuals() } ],
					{
						cancelable: false
					}
				);
			})
			.catch((error) => {
				this.setState({ loading: false });
				Alert.alert('Transparencia', 'Documento fallido al enviar!', [ { text: 'Ok' } ], {
					cancelable: false
				});
			});
	};

	getManuals = () => {
		this.setState({ loading: true, addManual: false, resPdf: null });
		axios
			.get('/manuales.json?auth=' + this.state.token)
			.then((res) => {
				const fetchedManuals = [];
				console.log('Manuales, res: ', res);
				for (let key in res.data) {
					fetchedManuals.push({
						...res.data[key],
						id: key
					});
				}
				this.setState({ loading: false, manuals: fetchedManuals.reverse() });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};

	getCurrentDate() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		today = mm + '/' + dd + '/' + yyyy;
		this.setState({ date: today });
	}

	render() {
		const spinner = <CustomSpinner color="blue" />;

		const list = this.state.manuals.map((m, index) => (
			<Manual
				key={m.id}
				id={m.id}
				token={this.state.token}
				refresh={this.getManuals}
				isAdmin={this.state.isAdmin}
				data={m.manualData}
				describe={this.props}
				index={index + 1}
				changeDisplay={this.changeDisplay}
				showLikeIcons={this.state.showLikeIcons}
			/>
		));

		const title = (
			<View style={{ marginBottom: 5, width: width * 0.94, height: width * 0.4 }}>
				<CustomCardItemTitle
					title="TRANSPARENCIA"
					description="Visualice los manuales de transparencia"
					info="Delice hacia abajo, para los manuales más antiguos."
					image={require('../../assets/images/Buzon/buzon.png')}
				/>
			</View>
		);

		const body = (
			<Card style={{ flex: 2, flexGrow: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ margin: 5, alignItems: 'center' }}>
					<View style={styles.cardBody}>
						{this.state.loading ? (
							spinner
						) : (
							<View style={this.state.showLikeIcons ? styles.scrollDataListIcons : styles.scrollDataList}>
								{list}
							</View>
						)}
					</View>
				</ScrollView>
			</Card>
		);
		const manuales = (
			<View style={{ flex: 1 }}>
				{title}
				{body}
			</View>
		);

		const addManualTitle = (
			<View style={{ flex: 1, marginBottom: 10 }}>
				<CustomAddBanner
					title="NUEVO DOCUMENTO"
					image={require('../../assets/images/Preferences/add-orange.png')}
				/>
			</View>
		);
		let source = null;
		source = this.state.resPdf ? { uri: this.state.resPdf.uri } : null;
		const elpdf = this.state.resPdf &&
		source && (
			<View
				style={{
					flex: 1,
					justifyContent: 'flex-start',
					alignItems: 'center',
					overflow: 'hidden',
					flexGrow: 2
				}}
			>
				{source && (
					<Pdf
						source={source}
						onLoadComplete={(numberOfPages, filePath) => {
							console.log(`number of pages: ${numberOfPages}`);
						}}
						onPageChanged={(page, numberOfPages) => {
							console.log(`current page: ${page}`);
						}}
						onError={(error) => {
							console.log(error);
						}}
						style={{
							flex: 1,
							width: width
						}}
					/>
				)}
			</View>
		);

		const addManualBody = (
			<Card style={styles.add}>
				<ScrollView style={{ flex: 1 }}>
					<CardItem>
						<TouchableOpacity style={styles.selectButton} onPress={() => this.onSelectPdfHandler()}>
							<Text style={styles.textSelect}>Seleccionar pdf</Text>
							<Image
								style={styles.imageSelect}
								resizeMode="contain"
								source={require('../../assets/images/Preferences/pdf.png')}
							/>
						</TouchableOpacity>
					</CardItem>
					<CardItem style={{ flex: 1 }}>{this.state.resPdf && elpdf}</CardItem>
				</ScrollView>
			</Card>
		);
		const addManual = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addManualTitle}
				{this.state.loading && spinner}
				{addManualBody}
			</View>
		);
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar
							open={this.props}
							title="Transparencia"
							color="#00a19a"
							titleOfAdd="Nuevo documento"
							showContentRight={true}
							isAdmin={this.state.isAdmin}
							get={this.getManuals}
							add={() => this.setState({ show: true })}
							goBack={() => this.setState({ show: false })}
							save={this.savePdfHandler}
							isAdd={this.state.show}
							changeDisplay={this.changeDisplay}
							showLikeIcons={this.state.showLikeIcons}
						/>
					</View>
					<StatusBar color="#00847b" />
					<View style={{ flex: 1, margin: 10 }}>{!this.state.show ? manuales : addManual}</View>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		overflow: 'scroll',
		backgroundColor: 'white'
	},
	view: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	scrollDataListIcons: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	scrollDataList: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'column'
	},
	cardBody: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	add: {
		flex: 2,
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	selectButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#00847b',
		alignSelf: 'center',
		alignContent: 'center'
	},
	textSelect: {
		alignSelf: 'center',
		fontSize: 16,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: 'white',
		fontFamily: 'AvenirNextLTPro-Regular',
		marginRight: 5
	},
	imageSelect: {
		width: width * 0.1,
		height: width * 0.1
	},
	drawerIcon: {
		height: width * 0.07,
		width: width * 0.07
	},
	drawerLabel: {
		width: width,
		marginLeft: 18,
		paddingBottom: 15,
		paddingTop: 15,
		color: '#676766',
		fontSize: 18,
		fontFamily: 'AvenirNextLTPro-Regular'
	}
});
