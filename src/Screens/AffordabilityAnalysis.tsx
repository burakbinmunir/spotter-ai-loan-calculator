import React, { useEffect, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

const AffordabilityAnalysis = () => {
	const [desiredPayment, setDesiredPayment] = useState('2500');
	const [interestRate, setInterestRate] = useState('11.9');
	const [loanTerm, setLoanTerm] = useState('60');
	const [downPayment, setDownPayment] = useState('0');

	const [maxLoanAmount, setMaxLoanAmount] = useState('');
	const [purchasePrice, setPurchasePrice] = useState('');

	useEffect(() => {
		const P = parseFloat(desiredPayment);
		const r = parseFloat(interestRate) / 100 / 12;
		const n = parseFloat(loanTerm);
		const down = parseFloat(downPayment) || 0;

		if (!isNaN(P) && !isNaN(r) && r > 0 && !isNaN(n) && n > 0) {
			const loanAmount = (P * (1 - Math.pow(1 + r, -n))) / r;
			const total = loanAmount + down;

			setMaxLoanAmount(`$${loanAmount.toFixed(2)}`);
			setPurchasePrice(`$${total.toFixed(2)}`);
		} else {
			setMaxLoanAmount('');
			setPurchasePrice('');
		}
	}, [desiredPayment, interestRate, loanTerm, downPayment]);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.select({ ios: 'padding' })}
		>
			<Text style={styles.title}>Affordability Analysis</Text>

			{maxLoanAmount !== '' && (
				<View style={styles.resultBox}>
					<Text style={styles.resultTitle}>Maximum Loan Amount</Text>
					<Text style={styles.resultValue}>{maxLoanAmount}</Text>

					<Text style={styles.resultTitle}>Total Purchase Price</Text>
					<Text style={styles.resultValue}>{purchasePrice}</Text>
				</View>
			)}

			<TextInput
				placeholder="Desired Payment"
				style={styles.input}
				keyboardType="numeric"
				value={desiredPayment}
				onChangeText={setDesiredPayment}
			/>
			<TextInput
				placeholder="Interest Rate (%)"
				style={styles.input}
				keyboardType="numeric"
				value={interestRate}
				onChangeText={setInterestRate}
			/>
			<TextInput
				placeholder="Loan Term (months)"
				style={styles.input}
				keyboardType="numeric"
				value={loanTerm}
				onChangeText={setLoanTerm}
			/>
			<TextInput
				placeholder="Down Payment"
				style={styles.input}
				keyboardType="numeric"
				value={downPayment}
				onChangeText={setDownPayment}
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#F2F2F7',
		justifyContent: 'center',
	},
	title: {
		fontSize: 22,
		fontWeight: '600',
		marginBottom: 20,
		textAlign: 'center',
		color: '#000',
	},
	input: {
		backgroundColor: '#fff',
		padding: 12,
		marginBottom: 10,
		borderRadius: 8,
		fontSize: 16,
	},
	resultBox: {
		marginBottom: 30,
		padding: 16,
		backgroundColor: '#ffffff',
		borderRadius: 12,
		shadowColor: '#00000010',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	resultTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
		marginTop: 10,
	},
	resultValue: {
		fontSize: 20,
		fontWeight: '700',
		color: '#000',
	},
});

export default AffordabilityAnalysis;
