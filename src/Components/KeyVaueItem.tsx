import {
	Image,
	ImageProps,
	ImageSourcePropType,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import React from 'react';
import { AppColors, FontSize } from '../Helpers/Variables.ts';

interface KeyValueItemProps {
	keyItem: string;
	value: string;
	imgSrc: ImageSourcePropType;
	imgStyle?: ImageProps;
}

const KeyValueItem = ({ imgSrc, value, imgStyle }: KeyValueItemProps) => {
	return (
		<View style={styles.container}>
			<Image source={imgSrc} style={imgStyle} />
			<Text style={styles.summaryValue}>{value}</Text>
		</View>
	);
};

export default KeyValueItem;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	summaryValue: {
		fontSize: FontSize.small,
		textAlign: 'center',
		color: AppColors.white,
	},
});
