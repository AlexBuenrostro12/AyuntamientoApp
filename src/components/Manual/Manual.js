import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import axios from '../../../axios-ayuntamiento';
import ListData from '../ListData/ListData';

export default class Manual extends Component {
	state = {
		nombre: null,
		url: null,
		fecha: null,
		itemKey: null,
		showItemCard: false,
		data: [],
	};

	clickedListHandler = (identifier, key) => {
		console.log('Actividad.js:clickList: ', identifier, key);
		for (let dataName in this.props.data) {
			if (this.props.data[dataName] === identifier) {
				this.setState({ nombre: this.props.data[dataName] });
				this.setState({ url: this.props.data['url'] });
				this.setState({ fecha: this.props.data['date'] });
				this.setState({ itemKey: key });
			}
		}
		this.setState({ showItemCard: true }, () => this.goToDescribeData());
	};

	goToDescribeData = () => {
		if (this.state.showItemCard) {
			const obj = {
				nombre: this.state.nombre,
				url: this.state.url,
				fecha: this.state.fecha,
				isAdmin: true,
				type: 'Manuales',
				barProps: { title: 'Manuales', status: '#00847b', bar: '#00a19a' }
			};
			const { navigate } = this.props.describe.navigation;
			navigate('Describe', { data: obj });
		}
	};

	componentDidMount() {
		const data = [];
		const obj = {};
		for (let dataName in this.props.data) {
			if (dataName === 'name') {
				obj.title = this.props.data[dataName];
			}
			if (dataName === 'date') {	
				obj.fecha = this.props.data[dataName];;
			}
		}
		const oddORnot = (this.props.index % 2);
		let odd = null;
		if(oddORnot === 1)
			odd = false;
		else
			odd = true;
		obj.odd = odd;
		data.push(obj);
		this.setState({ data: data });
	};

	render() {
		const listData = <ListData 
							data={this.state.data} 
							id={this.props.id} 
							clicked={this.clickedListHandler}
							showLikeIcons={this.props.showLikeIcons} />;

		return <View>{listData}</View>;
	}
}

const styles = StyleSheet.create({
	listSuggestions: {
		marginLeft: 2,
		marginRight: 2,
		marginTop: 5,
		marginBottom: 5
	},
	button: {
		flex: 1,
		flexGrow: 1,
		marginTop: 5,
		marginBottom: 5
	},
	btnsAdm: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	btnsContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	btnsAdmImg: {
		height: 30,
		width: 30,
		resizeMode: 'contain',
		marginLeft: 2
	},
	image: {
		resizeMode: 'contain',
		height: 160,
		width: 200,
		alignSelf: 'center'
	}
});
