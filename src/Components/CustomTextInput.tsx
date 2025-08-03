import React, { useState } from 'react';
import {
	TextInput,
	StyleSheet,
	View,
	Text,
	TextInputProps as RNTextInputProps,
	Image,
	ImageStyle,
	ImageSourcePropType,
} from 'react-native';
import { AppColors, MetricsSizes } from '../Helpers/Variables.ts';

interface CustomTextInputProps extends RNTextInputProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder: string;
	label: string;
	iconName?: string; // Optional icon (e.g., 'person', 'mail')
	error?: string;
	imgSrc?: ImageSourcePropType;
	imgStyles?: ImageStyle;
}

const CustomTextInput = ({
	label = '',
	value = '',
	onChangeText = () => {},
	placeholder = '',
							 imgStyles,
	imgSrc,
	iconName,
	keyboardType,
	error,
	...rest
}: CustomTextInputProps) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View style={[styles.card]}>
			<View style={styles.labelContainer}>
				{!!imgSrc && <Image source={imgSrc} style={[styles.imgStyle,imgStyles]} />}
				<Text style={styles.labelStyles}>{label}</Text>
			</View>
			<TextInput
				placeholder={placeholder}
				style={[
					styles.input,
					isFocused && { borderColor: AppColors.aquaColor }, // change this color as needed
				]}
				keyboardType={keyboardType}
				value={value}
				onChangeText={onChangeText}
				placeholderTextColor="#999"
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				{...rest}
			/>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

export default CustomTextInput;

const styles = StyleSheet.create({
	card: {
		marginVertical: MetricsSizes.small,
		borderRadius: MetricsSizes.medium,
	},

	labelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},

	icon: {
		marginRight: 6,
	},

	labelStyles: {
		fontSize: 14,
		fontWeight: '600',
		color: AppColors.white,
	},
	input: {
		fontSize: 16,
		color: AppColors.white,
		borderRadius: MetricsSizes.medium,
		borderWidth: 1,
		borderColor: AppColors.royalBlue,
		backgroundColor: AppColors.royalBlue,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 4,
	},
	imgStyle: {
		height: 15,
		width: 15,
	},
	inputError: {
		borderColor: 'red',
		borderWidth: 1,
	},
});
