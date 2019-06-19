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
	Platform
} from 'react-native';
import { Card, CardItem } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import * as firebase from 'firebase';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';
import Manual from '../../components/Manual/Manual';
import CustomAddBanner from '../../components/CustomAddBanner/CustomAddBanner';
import firebaseConfig from '../../../firebase-config';
import axios from '../../../axios-ayuntamiento';
import RNFetchBlob from 'rn-fetch-blob';

const firebaseapp = firebase.initializeApp(firebaseConfig);

const { height, width } = Dimensions.get('window');

export default class Manuales extends Component {
	state = {
		manuales: [
			{
				name: 'Manual 1',
				url:
					'https://firebasestorage.googleapis.com/v0/b/ayuntamiento-77d3b.appspot.com/o/Make-History.pdf?alt=media&token=ffc16829-605f-4307-bbd8-5eb509e14383',
				fecha: '22-05-2019'
			},
			{
				name: 'Manual 2',
				url:
					'https://firebasestorage.googleapis.com/v0/b/ayuntamiento-77d3b.appspot.com/o/doc_iso27000_all.pdf?alt=media&token=eea1e5a7-d3cd-4bcb-b00d-3f364472359d',
				fecha: '25-05-2019'
			}
		],
		show: false,
		url: 'nothing',
		token: null,
		showLikeIcons: true,
		resPdf: null,
		loading: false,
		manuals: [],
		date: null,
		isAdmin: null
	};

	async componentDidMount() {
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
					'Manuales',
					'¡Tiempo de espera agotado, inicie sesion de nuevo!',
					[ { text: 'Ok', onPress: () => this.props.navigation.navigate('Auth') } ],
					{ cancelable: false }
				);
			}
		} catch (e) {
			//Catch posible errors
		}
	}

	changeDisplay = () => {
		this.setState({ showLikeIcons: !this.state.showLikeIcons });
	};

	onSelectPdfHandler = () => {
		DocumentPicker.show(
			{
				filetype: [ DocumentPickerUtil.pdf() ]
			},
			(error, res) => {
				console.log('resPDF: ', res)
				// Android
				console.log(
					res.uri,
					res.type, // mime type
					res.fileName,
					res.fileSize
				);
				this.setState({ resPdf: res });
			}
		);
	};

	createFile = (uri, type, name) => {
		const enc = encodeURIComponent(uri);
		console.log('encodeuri: ', enc);
	};

	savePdfHandler = () => {
		console.log('Save pdf: ', this.state.resPdf);
		const { uri, type, fileName, fileSize } = this.state.resPdf;
		console.log('Save pdf: ', uri, 'type: ', type, 'file: ', fileName);
		const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
		const storage = firebaseapp.storage();
		const storageRef = storage.ref();
		const file = this.createFile(uri, type, name);
		const blob = new Blob([ file ], { type: type });
		console.log('File: ', file);
		console.log('Blob: ', blob);
		const enc = encodeURIComponent(uri);

		const metadata = {
			contentType: type
		};

		// Upload file and metadata to the object 'images/mountains.jpg'
		const uploadTask = storageRef.child('manuals/' + fileName).putString(enc, 'base64');

		uploadTask.on(
			firebase.storage.TaskEvent.STATE_CHANGED,
			(snapshot) => {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
				console.log('Upload is ' + progress + '% done');
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log('Upload is paused');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log('Upload is running');
						this.setState({ loading: true });
						break;
					case firebase.storage.TaskState.SUCCESS:
						console.log('Upload is success');
						break;
				}
			},
			(error) => {
				switch (error.code) {
					case 'storage/unauthorized':
						// User doesn't have permission to access the object
						break;

					case 'storage/canceled':
						// User canceled the upload
						break;
					case 'storage/unknown':
						// Unknown error occurred, inspect error.serverResponse
						break;
				}
			},
			async () => {
				const url = await uploadTask.snapshot.ref.getDownloadURL();
				console.log('url: ', url);
				if (url) this.saveDataHandler(fileName, url);
			}
		);
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
					'¡Manual enviado con exito!',
					[ { text: 'Ok', onPress: () => this.getManuals() } ],
					{
						cancelable: false
					}
				);
			})
			.catch((error) => {
				this.setState({ loading: false });
				Alert.alert('Transparencia', '¡Manual fallido al enviar!', [ { text: 'Ok' } ], {
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
				isAdmin={this.state.isAdmin}
				data={m.manualData}
				describe={this.props}
				index={index + 1}
				changeDisplay={this.changeDisplay}
				showLikeIcons={this.state.showLikeIcons}
			/>
		));

		const title = (
			<ScrollView style={{ flex: 1 }}>
				<CustomCardItemTitle
					title="MANUALES"
					description="Visualice los manuales de transparencia"
					info="Delice hacia abajo, para los manuales más antiguas."
					image={require('../../assets/images/Buzon/buzon.png')}
				/>
			</ScrollView>
		);

		const body = (
			<Card style={{ flex: 2, flexDirection: 'column', justifyContent: 'flex-start' }}>
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
					title="NUEVO MANUAL"
					image={require('../../assets/images/Preferences/add-orange.png')}
				/>
			</View>
		);
		const elpdf = (
			<View
				style={{
					flex: 1,
					justifyContent: 'flex-start',
					alignItems: 'center',
					overflow: 'hidden',
					flexGrow: 2
				}}
			>
				{this.state.resPdf && (
					<Pdf
						source={{ uri: this.state.resPdf.uri }}
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
			</Card>
		);
		const addManual = (
			<View style={{ flex: 1, flexDirection: 'column' }}>
				{addManualTitle}
				{addManualBody}
				{this.state.loading && spinner}
			</View>
		);

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View>
						<HeaderToolbar
							open={this.props}
							title="Manuales"
							color="#00a19a"
							titleOfAdd="Nuevo manual"
							showContentRight={true}
							isAdmin={true}
							get={this.getManuals}
							add={() => this.setState({ show: true })}
							goBack={() => this.setState({ show: false })}
							save={this.savePdfHandler}
							isAdd={this.state.show}
							changeDisplay={this.changeDisplay}
							showLikeIcons={this.state.showLikeIcons}
						/>
					</View>
					<StatusBar color="#FEA621" />
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
		overflow: 'scroll'
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
	}
});
