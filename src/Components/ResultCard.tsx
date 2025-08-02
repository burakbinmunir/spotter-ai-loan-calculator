import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AppColors } from '../Helpers/Variables.ts';

interface ResultCardProps {
	title: string;
	value: string;
	contentContainerStyle?: ViewStyle;
}

const ResultCard = ({ title, value, contentContainerStyle }: ResultCardProps) => {
	return (
		<View style={[styles.card, contentContainerStyle ]}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.value}>{value}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
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
