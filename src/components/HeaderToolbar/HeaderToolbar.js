import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import IconMenu from '../../UI/IconMenu/IconMenu';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import CustomInput from '../CustomInput/CustomInput';

const { height, width } = Dimensions.get('window');

export default class HeaderToolbar extends React.Component {

	render() {
		//Main menu
		const preferenceMenu = (
			<TouchableOpacity style={{ marginLeft: 15 }}>
				<Menu>
					<MenuTrigger>
						<Image style={styles.settings} source={require('../../assets/images/settings/settings.png')} />
					</MenuTrigger>
					<MenuOptions>
						{/* actualizar */}
						{this.props.get && (
							<MenuOption onSelect={() => this.props.get()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/refresh.png')}
									/>
									<Text style={styles.menuOptionText}>Actualizar</Text>
								</View>
							</MenuOption>
						)}
						{/* agregar */}
						{this.props.isAdmin && (
							<MenuOption onSelect={() => this.props.add()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/add.png')}
									/>
									<Text style={styles.menuOptionText}>{this.props.titleOfAdd}</Text>
								</View>
							</MenuOption>
						)}
						{/* Act or Desc notifications */}
						{this.props.notifications && (
							<MenuOption onSelect={() => this.props.notifications()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/notify.png')}
									/>
									<Text style={styles.menuOptionText}>
										{this.props.actOrDesc ? 'Notificationes act.' : 'Notificaciones desc.'}
									</Text>
								</View>
							</MenuOption>
						)}
						{/* ver como lista o iconos*/}
						{this.props.changeDisplay && (
							<MenuOption onSelect={() => this.props.changeDisplay()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={
											this.props.showLikeIcons ? (
												require('../../assets/images/Preferences/list.png')
											) : (
												require('../../assets/images/Preferences/icons.png')
											)
										}
									/>
									<Text style={styles.menuOptionText}>
										{this.props.showLikeIcons ? 'Ver como lista' : 'Ver como iconos'}
									</Text>
								</View>
							</MenuOption>
						)}
						{/*Cambiar banner*/}
						{this.props.isAdmin && this.props.changeBanner && (
							<MenuOption onSelect={() => this.props.changeBanner()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/user-admin.png')}
									/>
									<Text style={styles.menuOptionText}>Administrador</Text>
								</View>
							</MenuOption>
						)}
					</MenuOptions>
				</Menu>
			</TouchableOpacity>
        );
        //Add note
        const preferenceMenuAdd = (
			<TouchableOpacity style={{ marginLeft: 15 }}>
				<Menu>
					<MenuTrigger>
						<Image style={styles.settings} source={require('../../assets/images/settings/settings.png')} />
					</MenuTrigger>
					<MenuOptions>
						{/* Cancelar */}
						{this.props.isAdmin && (
							<MenuOption onSelect={() => this.props.goBack()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/back.png')}
									/>
									<Text style={styles.menuOptionText}>Cancelar</Text>
								</View>
							</MenuOption>
						)}
						{/* Publicar */}
						{this.props.isAdmin && this.props.save && (
							<MenuOption onSelect={() => this.props.save()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/add.png')}
									/>
									<Text style={styles.menuOptionText}>Publicar</Text>
								</View>
							</MenuOption>
						)}
					</MenuOptions>
				</Menu>
			</TouchableOpacity>
		);
		//Describe data preferences menu
		const preferenceMenuDescribeData = (
			<TouchableOpacity style={{ marginLeft: 15 }}>
				<Menu>
					<MenuTrigger>
						<Image style={styles.settings} source={require('../../assets/images/settings/settings.png')} />
					</MenuTrigger>
					<MenuOptions>
						{/* Send by email */}
						{this.props.sendEmail && (
							<MenuOption onSelect={() => this.props.sendEmail(false, this.props.title)}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/email.png')}
									/>
									<Text style={styles.menuOptionText}>Enviar por correo</Text>
								</View>
							</MenuOption>
						)}
						{/* Comment to adminstrator */}
						{this.props.sendEmail && (
							<MenuOption onSelect={() => this.props.sendEmail(true, 'notAvailable')}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Preferences/alert.png')}
									/>
									<Text style={styles.menuOptionText}>Comenatar al admin.</Text>
								</View>
							</MenuOption>
						)}
						{/* Delete manual */}
						{this.props.isAdmin && this.props.deleteManual && (
							<MenuOption onSelect={() => this.props.deleteManual()}>
								<View style={styles.menuOption}>
									<Image
										style={styles.menuOptionImage}
										source={require('../../assets/images/Delete/delete-grey.png')}
									/>
									<Text style={styles.menuOptionText}>Eliminar manual.</Text>
								</View>
							</MenuOption>
						)}
						{/* Here could be other options */}
					</MenuOptions>
				</Menu>
			</TouchableOpacity>
		);

		const search = (
			<TouchableOpacity onPress={() => this.props.startSearch()}>
				<Image style={styles.settings} source={require('../../assets/images/Search/search.png')} />
			</TouchableOpacity>
		);
		const goBack = (
			<TouchableOpacity onPress={() => this.props.describeGoBack()}>
				<Image style={styles.settings} source={require('../../assets/images/Preferences/back-white.png')} />
			</TouchableOpacity>
		);
		const calendar = (
			!this.props.showCalendar ? 
				<TouchableOpacity style={{ marginRight: 20 }} onPress={() => this.props.calendar('refresh')}>
					<Image style={styles.settings} source={require('../../assets/images/Preferences/calendar.png')} />
				</TouchableOpacity>
			: 
				<TouchableOpacity style={{ marginRight: 20 }} onPress={() => this.props.calendar('refresh')}>
					<Image style={styles.settings} source={require('../../assets/images/Preferences/back-white.png')} />
				</TouchableOpacity>
		);

		const contentBar = (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between'
				}}
			>
				<View style={styles.contentLeft}>
					{this.props.open && <View style={{ justifyContent: 'center' }}>
						<IconMenu open={this.props.open} />
					</View>}
					<View style={styles.view}>
						<Text style={styles.text}>{this.props.title}</Text>
					</View>
				</View>
				{this.props.showContentRight && <View style={styles.contentRight}>
					{/* check if can show the calendar */}
					{!this.props.describeGoBack && !this.props.isAdd && this.props.calendar && calendar}
					{/* check if can show the search bar */}
					{!this.props.describeGoBack && !this.props.isAdd && !this.props.showCalendar && this.props.search && search}
					{/* check if it's not describeScreen and then check if show menu or menuAdd */}
					{!this.props.describeGoBack && ((!this.props.isAdd && !this.props.isChangeBanner && !this.props.isAddTypeEvent) ? preferenceMenu : preferenceMenuAdd)}
					{/* check if show goBack icon of describeData */}
					{this.props.describeGoBack && goBack}
					{/* check if show menu of describeData */}
					{this.props.describeGoBack && preferenceMenuDescribeData}
				</View>}
			</View>
		);
		const searBar = (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
                    alignItems: 'center',
					backgroundColor: 'white',
					alignSelf: 'center',
					marginBottom: 4,
					marginTop: 4,
					marginRight: 4,
					borderRadius: 2,
					width: width * .93,
				}}
			>
				<TouchableOpacity onPress={() => this.props.startSearch()}>
					<Image style={styles.settings} source={require('../../assets/images/Preferences/back.png')} />
				</TouchableOpacity>
				<View style={{ alignSelf: 'center' }}>
					<CustomInput 
						itemType="InlineLabel"
                        value={this.props.value}
                        holder="Buscar"
						changed={this.props.changed} />
				</View>
			</View>
		);
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignContent: 'center',
					height: height / 11,
					width: width,
					backgroundColor: this.props.color ? this.props.color : '#78888D',
					paddingLeft: 5
				}}
			>
				{!this.props.isSearch ? contentBar : <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>{searBar}</KeyboardAvoidingView>}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: height / 11,
		width: width,
		backgroundColor: '#878787',
		paddingLeft: 5
	},
	contentLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	contentRight: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	view: {
		justifyContent: 'center',
		marginLeft: 15
	},
	text: {
		fontSize: 22,
		alignItems: 'center',
		justifyContent: 'center',
		color: 'white'
	},
	image: {
		height: height / 11,
		width: width / 3,
		resizeMode: 'contain',
		paddingRight: 1
	},
	settings: {
		height: height / 30,
		width: height / 30,
        resizeMode: 'contain',
        alignSelf: 'center',
        
	},
	menuOption: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	menuOptionImage: {
		height: width / 18,
		width: width / 18,
		resizeMode: 'contain',
		marginRight: 5
	},
	menuOptionText: {
		fontSize: 15
	}
});
