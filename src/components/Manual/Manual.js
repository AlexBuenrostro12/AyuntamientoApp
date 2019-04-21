import React from 'react';
import { View, Dimensions } from 'react-native';
import PDF from 'react-native-pdf';

const manual = (props) => {
	const { token, url } = props;
	const source = { uri: url };

	const pdf = (
		<PDF
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
				width: Dimensions.get('window').width,
				flexGrow: 2
			}}
		/>
	);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				overflow: 'hidden',
				flexGrow: 2
			}}
		>
			{token && pdf}
		</View>
	);
};

export default manual;
