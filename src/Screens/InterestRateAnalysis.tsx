import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const InterestRateAnalysis = () => {
	const [loanAmount, setLoanAmount] = useState('15000');
	const [monthlyPayment, setMonthlyPayment] = useState('2750');
	const [loanTerm, setLoanTerm] = useState('60');
	const [balloonPayment, setBalloonPayment] = useState('0');
	const [annualRate, setAnnualRate] = useState('0.00');

	useEffect(() => {
		const parsedLoanAmount = parseFloat(loanAmount);
		const parsedMonthlyPayment = parseFloat(monthlyPayment);
		const parsedLoanTerm = parseInt(loanTerm);
		const parsedBalloon = parseFloat(balloonPayment);

		if (
			!isNaN(parsedLoanAmount) &&
			!isNaN(parsedMonthlyPayment) &&
			!isNaN(parsedLoanTerm) &&
			parsedLoanAmount > 0 &&
			parsedMonthlyPayment > 0 &&
			parsedLoanTerm > 0
		) {
			const result = calculateAnnualInterestRate({
				loanAmount: parsedLoanAmount,
				monthlyPayment: parsedMonthlyPayment,
				loanTerm: parsedLoanTerm,
				balloonPayment: parsedBalloon,
			});
			setAnnualRate(result.toFixed(2));
		} else {
			setAnnualRate('0.00');
		}
	}, [loanAmount, monthlyPayment, loanTerm, balloonPayment]);

	const calculateAnnualInterestRate = ({
		loanAmount,
		monthlyPayment,
		loanTerm,
		balloonPayment,
	}: {
		loanAmount: number;
		monthlyPayment: number;
		loanTerm: number;
		balloonPayment: number;
	}): number => {
		// Use binary search with compound interest formula
		const tolerance = 1e-6;
		let low = 0.001; // 0.1% monthly rate
		let high = 2; // 200% monthly rate
		let guess = 0;

		const calculateTotalPayment = (monthlyRate: number) => {
			let totalPayment = 0;
			for (let i = 1; i <= loanTerm; i++) {
				totalPayment += monthlyPayment / Math.pow(1 + monthlyRate, i);
			}
			totalPayment +=
				balloonPayment / Math.pow(1 + monthlyRate, loanTerm);
			return totalPayment;
		};

		let iteration = 0;
		while (high - low > tolerance && iteration < 100) {
			guess = (low + high) / 2;
			const totalPayment = calculateTotalPayment(guess);

			if (totalPayment > loanAmount) {
				low = guess;
			} else {
				high = guess;
			}
			iteration++;
		}

		const annualRate = guess * 12 * 100;
		return Number.isNaN(annualRate) ? 0 : Math.min(annualRate, 1000);
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Interest Rate Analysis</Text>
			<Text style={styles.subtitle}>
				Calculated based on your loan parameters
			</Text>

			<TextInput
				style={styles.input}
				placeholder="Loan Amount"
				value={loanAmount}
				keyboardType="numeric"
				onChangeText={setLoanAmount}
			/>
			<TextInput
				style={styles.input}
				placeholder="Monthly Payment"
				value={monthlyPayment}
				keyboardType="numeric"
				onChangeText={setMonthlyPayment}
			/>
			<TextInput
				style={styles.input}
				placeholder="Loan Term (months)"
				value={loanTerm}
				keyboardType="numeric"
				onChangeText={setLoanTerm}
			/>
			<TextInput
				style={styles.input}
				placeholder="Balloon Payment"
				value={balloonPayment}
				keyboardType="numeric"
				onChangeText={setBalloonPayment}
			/>

			<View style={styles.resultBox}>
				<Text style={styles.resultLabel}>Annual Interest Rate</Text>
				<Text style={styles.resultValue}>{annualRate}%</Text>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 24,
		backgroundColor: '#F2F2F7',
		alignItems: 'center',
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 4,
		color: '#000',
	},
	subtitle: {
		fontSize: 14,
		color: '#555',
		marginBottom: 24,
	},
	input: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingHorizontal: 14,
		paddingVertical: 10,
		marginBottom: 14,
		fontSize: 16,
		borderColor: '#ddd',
		borderWidth: 1,
	},
	resultBox: {
		marginTop: 20,
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
		borderColor: '#ccc',
		borderWidth: 1,
	},
	resultLabel: {
		fontSize: 16,
		color: '#888',
	},
	resultValue: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#0A84FF',
		marginTop: 8,
	},
});

export default InterestRateAnalysis;
