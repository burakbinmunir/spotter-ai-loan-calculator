import React, { useEffect, useState } from 'react';
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet, Text,
	View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import {
	AppColors,
	INTEREST_RATE_FALLBACKS,
	MetricsSizes,
} from '../Helpers/Variables.ts';
import ResultCard from '../Components/ResultCard.tsx';
import CustomTextInput from '../Components/CustomTextInput.tsx';
import { Images } from '../Assets/Images';

const InterestRateAnalysis = () => {
	const {
		control,
		watch,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm({
		defaultValues: {
			loanAmount: INTEREST_RATE_FALLBACKS.loanAmount,
			monthlyPayment: INTEREST_RATE_FALLBACKS.monthlyPayment,
			loanTerm: INTEREST_RATE_FALLBACKS.loanTerm,
			balloonPayment: INTEREST_RATE_FALLBACKS.balloonPayment,
		},
	});

	const loanAmount = watch('loanAmount');
	const monthlyPayment = watch('monthlyPayment');
	const loanTerm = watch('loanTerm');
	const balloonPayment = watch('balloonPayment');

	const [annualRate, setAnnualRate] = useState('0.00');

	useEffect(() => {
		const parsedLoanAmount = parseFloat(
			loanAmount || INTEREST_RATE_FALLBACKS.loanAmount,
		);
		const parsedMonthlyPayment = parseFloat(
			monthlyPayment || INTEREST_RATE_FALLBACKS.monthlyPayment,
		);
		const parsedLoanTerm = parseInt(
			loanTerm || INTEREST_RATE_FALLBACKS.loanTerm,
			10,
		);
		const parsedBalloon = parseFloat(
			balloonPayment || INTEREST_RATE_FALLBACKS.balloonPayment,
		);

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
			setAnnualRate(result !== null ? result.toFixed(2) : '0.00');
		} else {
			setAnnualRate('0.00');
		}
	}, [loanAmount, monthlyPayment, loanTerm, balloonPayment]);

	useEffect(() => {
		const parsedLoanAmount =
			loanAmount === ''
				? parseFloat(INTEREST_RATE_FALLBACKS.loanAmount)
				: parseFloat(loanAmount);
		const parsedMonthly =
			monthlyPayment === ''
				? parseFloat(INTEREST_RATE_FALLBACKS.monthlyPayment)
				: parseFloat(monthlyPayment);
		const parsedTerm =
			loanTerm === ''
				? parseFloat(INTEREST_RATE_FALLBACKS.loanTerm)
				: parseInt(loanTerm, 10);
		const parsedBalloon =
			balloonPayment === ''
				? parseFloat(INTEREST_RATE_FALLBACKS.balloonPayment)
				: parseFloat(balloonPayment);

		const totalPaid = parsedMonthly * parsedTerm + parsedBalloon;
		console.log('totalPaid', totalPaid);
		console.log('parsedLoanAmount', parsedLoanAmount);
		// Loan amount must be at least 0.01
		if (parsedLoanAmount < 0.01) {
			setError('loanAmount', {
				type: 'manual',
				message: 'Loan amount must be at least 0.01',
			});
		} else {
			clearErrors('loanAmount');
		}

		if (totalPaid < parsedLoanAmount) {
			setError('monthlyPayment', {
				type: 'manual',
				message: 'Total payments less than principal.',
			});
		} else if (parsedMonthly === -1) {
			setError('monthlyPayment', {
				type: 'manual',
				message: 'Value must be at least 0.',
			});
		} else if (parsedMonthly === 0) {
			setError('monthlyPayment', {
				type: 'manual',
				message: 'Total payments less than principal',
			});
		} else {
			clearErrors('monthlyPayment');
		}

		if (parsedTerm < 1) {
			setError('loanTerm', {
				type: 'manual',
				message: 'Value must be at least 1.',
			});
		} else if (parsedTerm > 1200) {
			setError('loanTerm', {
				type: 'manual',
				message: 'Value cannot exceed 1200.',
			});
		} else {
			clearErrors('loanTerm');
		}

		if (parsedBalloon > parsedLoanAmount) {
			setError('balloonPayment', {
				type: 'manual',
				message: 'Balloon payment too high for loan terms',
			});
		} else if (parsedBalloon < 0) {
			setError('balloonPayment', {
				type: 'manual',
				message: 'Balloon payment cannot be negative',
			});
		} else {
			clearErrors('balloonPayment');
		}
	}, [
		loanAmount,
		monthlyPayment,
		loanTerm,
		balloonPayment,
		setError,
		clearErrors,
	]);

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
	}): number | null => {
		const maxIterations = 100;
		const precision = 1e-9;
		let lower = 0.0000001;
		let upper = 1.0;

		const f = (r: number): number => {
			const factor = 1 - Math.pow(1 + r, -loanTerm);
			const discounted = factor / r;
			const balloonDiscount = balloonPayment / Math.pow(1 + r, loanTerm);
			return monthlyPayment * discounted + balloonDiscount - loanAmount;
		};

		// Dynamically adjust upper bound to ensure root is bracketed
		let attempts = 0;
		while (f(lower) * f(upper) > 0 && attempts < 20) {
			upper *= 2;
			attempts++;
		}

		if (f(lower) * f(upper) > 0) return null; // still not bracketed

		for (let i = 0; i < maxIterations; i++) {
			const mid = (lower + upper) / 2;
			const fMid = f(mid);

			if (Math.abs(fMid) < precision) {
				const annualRate = mid * 12; // Nominal APR (simple)

				return annualRate * 100;
			}

			if (f(lower) * fMid < 0) {
				upper = mid;
			} else {
				lower = mid;
			}
		}

		return null;
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.select({ ios: 'padding' })}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={[styles.loanBlurContainer, { backgroundColor: AppColors.placeholderTextColor }]}>

					<ResultCard
						title="Annual Interest Rate"
						titleIcon={Images.IC_ARROW_ABOVE}
						valueStyle={{
							textAlign: 'center',
						}}
						titleIconStyle={{
							height: 15,
							width: 15,
							marginRight: MetricsSizes.small,
						}}
						value={
							Object.keys(errors).length > 0
								? 'Invalid Input'
								: Number(annualRate) >= 100
								? '100.00%'
								: Number(annualRate) < 0
								? 'Rate < 0%'
								: `${annualRate}%`
						}
						contentContainerStyle={styles.resultCardContainer}
					/>
				</View>
				<View style={[styles.inputSection, { backgroundColor: AppColors.placeholderTextColor }]}>
					<View>
						<View style={styles.header}>
							<Image source={Images.IC_SETTINGS} style={styles.settingImg} />
							<Text style={styles.sectionTitle}>
								Loan Parameters
							</Text>
						</View>
						<Controller
							control={control}
							name="loanAmount"
							render={({ field: { onChange, value } }) => (
								<CustomTextInput
									label="Loan Amount"
									placeholder={
										INTEREST_RATE_FALLBACKS.loanAmount
									}
									keyboardType="numeric"
									value={value}
									onChangeText={onChange}
									error={errors.loanAmount?.message}
								/>
							)}
						/>

						<Controller
							control={control}
							name="monthlyPayment"
							render={({ field: { onChange, value } }) => (
								<CustomTextInput
									label="Monthly Payment"
									placeholder={
										INTEREST_RATE_FALLBACKS.monthlyPayment
									}
									keyboardType="numeric"
									value={value}
									onChangeText={onChange}
									error={errors.monthlyPayment?.message}
								/>
							)}
						/>

						<Controller
							control={control}
							name="loanTerm"
							render={({ field: { onChange, value } }) => (
								<CustomTextInput
									label="Loan Term (months)"
									placeholder={
										INTEREST_RATE_FALLBACKS.loanTerm
									}
									keyboardType="numeric"
									value={value}
									onChangeText={onChange}
									error={errors.loanTerm?.message}
								/>
							)}
						/>

						<Controller
							control={control}
							name="balloonPayment"
							render={({ field: { onChange, value } }) => (
								<CustomTextInput
									label="Balloon Payment"
									placeholder={
										INTEREST_RATE_FALLBACKS.balloonPayment
									}
									keyboardType="numeric"
									value={value}
									onChangeText={onChange}
									error={errors.balloonPayment?.message}
								/>
							)}
						/>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: AppColors.royalBlue,
		flex: 1,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 4,
		color: '#fff',
		textAlign: 'center',
	},
	inputSection: {
		borderRadius: 16,
		padding: 16,
		paddingVertical: 14,
		overflow: 'hidden',
		marginVertical: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 6,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
	},
	loanBlurContainer: {
		padding: 6,
		borderRadius: 16,
		overflow: 'hidden',
	},
	scrollContent: {
		padding: 24,
		paddingBottom: 40,
	},
	resultCardContainer: {
		backgroundColor: AppColors.aquaColor,
		margin: MetricsSizes.medium,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	settingImg: {
		height: 18,
		width: 18,
		tintColor: AppColors.white,
		marginRight: MetricsSizes.small,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: AppColors.white,
	},
});

export default InterestRateAnalysis;
