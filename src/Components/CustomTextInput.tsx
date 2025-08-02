import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps as RNTextInputProps } from 'react-native';
import { AppColors, MetricsSizes } from '../Helpers/Variables.ts';


interface CustomTextInputProps extends RNTextInputProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder: string;
	label: string;
	iconName?: string; // Optional icon (e.g., 'person', 'mail')
	error?: string;
}

const CustomTextInput = ({
							 label = '',
							 value = '',
							 onChangeText = () => {},
							 placeholder = '',
							 iconName,
							 keyboardType,
							error,
							 ...rest
						 }: CustomTextInputProps) => {
	return (
		<View style={styles.card}>
			<View style={styles.labelContainer}>
				{/*{iconName && <Ionicons name={iconName} size={16} color="#555" style={styles.icon} />}*/}
				<Text style={styles.labelStyles}>{label}</Text>
			</View>
			<TextInput
				placeholder={placeholder}
				style={styles.input}
				keyboardType={keyboardType}
				value={value}
				onChangeText={onChangeText}
				placeholderTextColor="#999"
				{...rest}
			/>
			{error && (
				<Text style={styles.errorText}>{error}</Text>
			)}

		</View>
	);
};

export default CustomTextInput;

const styles = StyleSheet.create({
	card: {
		backgroundColor: AppColors.royalBlue,
		// borderRadius: 16,
		// padding: 16,
		// marginVertical: 10,
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 6 },
		// shadowOpacity: 0.1,
		// shadowRadius: 10,
		// elevation: 6,
		// borderWidth: 1,
		// borderColor: 'rgba(255,255,255,0.2)',
		borderWidth: 1,
		borderColor: AppColors.white,
		margin: MetricsSizes.small,
		borderRadius: MetricsSizes.medium,
		padding: MetricsSizes.medium,
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
		color: AppColors.greyishWhite
	},
	input: {
		fontSize: 16,
		color: AppColors.white,
		// borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingVertical: 6,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 4,
	},

	inputError: {
		borderColor: 'red',
		borderWidth: 1,
	},
});
