import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Table from '../Components/Table.tsx';

const DEFAULTS = {
	loanAmount: 175000,
	annualRate: 11.9,
	term: 60,
	downPayment: 0,
	balloonPayment: 0,
};

const AmortizationAnalysis = () => {
	const [loanAmount, setLoanAmount] = useState(DEFAULTS.loanAmount);
	const [annualRate, setAnnualRate] = useState(DEFAULTS.annualRate);
	const [term, setTerm] = useState(DEFAULTS.term);
	const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
	const [balloonPayment, setBalloonPayment] = useState(
		DEFAULTS.balloonPayment,
	);
	const [schedule, setSchedule] = useState([]);

	const parseOrDefault = (value: string, fallback: number) => {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? fallback : parsed;
	};

	useEffect(() => {
		generateSchedule();
	}, [loanAmount, annualRate, term, downPayment, balloonPayment]);

	const generateSchedule = () => {
		const principal = loanAmount - downPayment;
		const monthlyRate = annualRate / 100 / 12;

		// Calculate monthly payment for the amortizing portion (excluding balloon)
		const amortizingAmount = principal - balloonPayment;
		const monthlyPayment =
			(amortizingAmount * monthlyRate) /
			(1 - Math.pow(1 + monthlyRate, -term));

		let balance = principal;
		const scheduleArray = [];

		// Add initial row (month 0)
		scheduleArray.push({
			month: '0',
			payment: '-',
			interest: '-',
			principal: '-',
			balance: `$${balance.toFixed(2)}`,
		});

		for (let i = 1; i <= term; i++) {
			const interest = Math.round(balance * monthlyRate * 100) / 100;
			let principalPaid;
			let payment;

			// Regular months: standard amortization
			principalPaid = Math.round((monthlyPayment - interest) * 100) / 100;
			payment = Math.round(monthlyPayment * 100) / 100;
			balance = Math.round((balance - principalPaid) * 100) / 100;

			scheduleArray.push({
				month: i.toString(),
				payment: `$${payment.toFixed(2)}`,
				interest: `$${interest.toFixed(2)}`,
				principal: `$${principalPaid.toFixed(2)}`,
				balance: `$${balance.toFixed(2)}`,
			});
		}

		// Add balloon payment as separate row
		if (balloonPayment > 0) {
			scheduleArray.push({
				month: 'Balloon',
				payment: `$${balloonPayment.toFixed(2)}`,
				interest: '$0.00',
				principal: `$${balloonPayment.toFixed(2)}`,
				balance: '$0.00',
			});
		}

		setSchedule(scheduleArray);
	};

	return (
		<View style={[styles.wrapper]}>
			<Text style={styles.title}>Amortization Calculator</Text>

			<TextInput
				style={styles.input}
				keyboardType="numeric"
				placeholder="Loan Amount"
				onChangeText={val =>
					setLoanAmount(parseOrDefault(val, DEFAULTS.loanAmount))
				}
				defaultValue={DEFAULTS.loanAmount.toString()}
			/>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				placeholder="Annual Interest Rate (%)"
				onChangeText={val =>
					setAnnualRate(parseOrDefault(val, DEFAULTS.annualRate))
				}
				defaultValue={DEFAULTS.annualRate.toString()}
			/>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				placeholder="Term (months)"
				onChangeText={val =>
					setTerm(parseOrDefault(val, DEFAULTS.term))
				}
				defaultValue={DEFAULTS.term.toString()}
			/>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				placeholder="Down Payment"
				onChangeText={val =>
					setDownPayment(parseOrDefault(val, DEFAULTS.downPayment))
				}
				defaultValue={DEFAULTS.downPayment.toString()}
			/>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				placeholder="Balloon Payment"
				onChangeText={val =>
					setBalloonPayment(
						parseOrDefault(val, DEFAULTS.balloonPayment),
					)
				}
				defaultValue={DEFAULTS.balloonPayment.toString()}
			/>

			<Table
				columns={[
					{ label: 'Month', key: 'month' },
					{ label: 'Payment', key: 'payment' },
					{ label: 'Interest', key: 'interest' },
					{ label: 'Principal', key: 'principal' },
					{ label: 'Balance', key: 'balance' },
				]}
				data={schedule}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		padding: 16,
		backgroundColor: '#F2F2F7',
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	input: {
		backgroundColor: '#fff',
		padding: 12,
		marginBottom: 10,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#ccc',
	},
	tableHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#D1D5DB',
		paddingVertical: 6,
		paddingHorizontal: 4,
		marginTop: 10,
	},
	tableRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 6,
		paddingHorizontal: 4,
		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
	cell: {
		flex: 1,
		fontSize: 12,
		textAlign: 'center',
	},
});

export default AmortizationAnalysis;
