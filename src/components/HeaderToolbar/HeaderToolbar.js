import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image, Alert, TouchableOpacity } from 'react-native';
import IconMenu from '../../UI/IconMenu/IconMenu';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

const { height, width } = Dimensions.get('window');

export default class HeaderToolbar extends React.Component {
	state = {};
	render() {
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
										source={require('../../assets/images/Preferences/refresh.jpeg')}
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
										source={require('../../assets/images/Preferences/add.jpeg')}
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
										source={require('../../assets/images/Preferences/notifications.jpeg')}
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
												require('../../assets/images/Preferences/list.jpeg')
											) : (
												require('../../assets/images/Preferences/icons.jpeg')
											)
										}
									/>
									<Text style={styles.menuOptionText}>
										{this.props.showLikeIcons ? 'Ver como lista' : 'Ver como iconos'}
									</Text>
								</View>
							</MenuOption>
						)}
					</MenuOptions>
				</Menu>
			</TouchableOpacity>
		);

		const search = (
			<TouchableOpacity>
				<Image style={styles.settings} source={require('../../assets/images/Search/search.png')} />
			</TouchableOpacity>
		);

		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					height: height / 11,
					width: width,
					backgroundColor: this.props.color ? this.props.color : '#78888D',
					paddingLeft: 5
				}}
			>
				<View style={styles.contentLeft}>
					<View style={{ justifyContent: 'center', marginRight: 15 }}>
						<IconMenu open={this.props.open} />
					</View>
					<View style={styles.view}>
						<Text style={styles.text}>{this.props.title}</Text>
					</View>
				</View>
				<View style={styles.contentRight}>
					{search}
					{preferenceMenu}
				</View>
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
		justifyContent: 'center'
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
		height: height / 28,
		width: height / 28,
		resizeMode: 'contain'
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
