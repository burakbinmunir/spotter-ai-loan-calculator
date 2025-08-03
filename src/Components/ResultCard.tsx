import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
	Image,
	ImageStyle, ImageURISource,
} from 'react-native';
import { AppColors, MetricsSizes } from '../Helpers/Variables.ts';

interface ResultCardProps {
	title: string;
	value: string;
	contentContainerStyle?: ViewStyle;
	valueStyle?: TextStyle;
	titleStyle?: TextStyle;
	imgStyle?: ImageStyle;
	imgSrc?: ImageURISource;
}

const ResultCard = ({
	title,
	value,
	contentContainerStyle,
	valueStyle,
	titleStyle,
	imgStyle,
	imgSrc,
}: ResultCardProps) => {
	return (
		<View style={[styles.card, contentContainerStyle]}>
			<View style={[styles.container, {}]}>
				{!!imgSrc && (
					<View style={styles.imgContainer}>
						<Image
							source={imgSrc}
							style={[styles.imgStyle, imgStyle]}
						/>
					</View>
				)}
				<View>
					<Text style={[styles.title, titleStyle]}>{title}</Text>
					<Text style={[styles.value, valueStyle]}>{value}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	imgContainer: {
		marginRight: MetricsSizes.regular,
		alignItems: 'center',
		justifyContent: 'center',
		padding: MetricsSizes.medium,
		paddingHorizontal: MetricsSizes.regular,
		borderRadius: MetricsSizes.regular,
		backgroundColor: AppColors.lightAquaColor,
	},
	imgStyle: {
		height: 25,
		width: 25,
		tintColor: AppColors.white,
	},
	container: {
		flexDirection: 'row',
	},
	card: {
		backgroundColor: AppColors.royalBlue, // aqua-green
		borderRadius: 15,
		padding: 12,
		margin: 10,
		alignItems: 'center',
	},
	title: {
		fontSize: 14,
		color: 'white',
		fontWeight: '600',
		marginBottom: 4,
	},
	value: {
		fontSize: 28,
		fontWeight: 'bold',
		color: 'white',
	},
});

export default ResultCard;
