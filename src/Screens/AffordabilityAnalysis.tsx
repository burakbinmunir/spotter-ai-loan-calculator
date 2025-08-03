import React, { useEffect, useState } from 'react';
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	AFFORDABILITY_FALLBACKS,
	AppColors,
	MetricsSizes,
} from '../Helpers/Variables.ts';
import CustomTextInput from '../Components/CustomTextInput.tsx';
import { Controller, useForm } from 'react-hook-form';
import ResultCard from '../Components/ResultCard.tsx';
import { GenericHelper } from '../Helpers/GenericHelper.ts';
import { Images } from '../Assets/Images/index.ts';

const AffordabilityAnalysis = () => {
	const [maxLoanAmount, setMaxLoanAmount] = useState<number>();
	const [purchasePrice, setPurchasePrice] = useState<number>();
	const {
		control,
		formState: { errors },
		setError,
		clearErrors,
		watch,
	} = useForm({
		defaultValues: {
			desiredPayment: '2500',
			interestRate: '11.9',
			loanTerm: '60',
			downPayment: '0',
		},
	});
	const desiredPayment = watch('desiredPayment');
	const interestRate = watch('interestRate');
	const loanTerm = watch('loanTerm');
	const downPayment = watch('downPayment');

	useEffect(() => {
		const P = parseFloat(
			desiredPayment || AFFORDABILITY_FALLBACKS.desiredPayment,
		);
		const r =
			parseFloat(interestRate || AFFORDABILITY_FALLBACKS.interestRate) /
			100 /
			12;
		const n = parseFloat(loanTerm || AFFORDABILITY_FALLBACKS.loanTerm);
		const down = parseFloat(
			downPayment || AFFORDABILITY_FALLBACKS.downPayment,
		);

		const loanAmount = (P * (1 - Math.pow(1 + r, -n))) / r;
		const total = loanAmount + down;

		setMaxLoanAmount(loanAmount);
		setPurchasePrice(total);
	}, [desiredPayment, interestRate, loanTerm, downPayment]);

	useEffect(() => {
		const P = parseFloat(
			desiredPayment || AFFORDABILITY_FALLBACKS.desiredPayment,
		);
		const r =
			parseFloat(interestRate || AFFORDABILITY_FALLBACKS.interestRate) /
			100 /
			12;
		const n = parseFloat(loanTerm || AFFORDABILITY_FALLBACKS.loanTerm);
		const down = parseFloat(
			downPayment || AFFORDABILITY_FALLBACKS.downPayment,
		);
		const decimalRegex = /^\d*\.?\d*$/;

		// Validation: Desired Payment
		if (!decimalRegex.test(desiredPayment)) {
			setError('desiredPayment', {
				type: 'manual',
				message: 'Enter a valid number',
			});
		} else if (isNaN(P) || P < 0.01) {
			setError('desiredPayment', {
				type: 'manual',
				message: 'Value must be at least 0.01',
			});
		} else {
			clearErrors('desiredPayment');
		}

		// Validation: Interest Rate
		if (!decimalRegex.test(interestRate)) {
			setError('interestRate', {
				type: 'manual',
				message: 'Enter a valid number',
			});
		} else if (isNaN(r) || r <= 0) {
			setError('interestRate', {
				type: 'manual',
				message: 'Value must be at least 0.01',
			});
		} else {
			clearErrors('interestRate');
		}

		// Validation: Loan Term
		if (!decimalRegex.test(loanTerm)) {
			setError('loanTerm', {
				type: 'manual',
				message: 'Enter a valid number',
			});
		} else if (!decimalRegex.test(loanTerm)) {
			setError('loanTerm', {
				type: 'manual',
				message: 'Enter a valid number',
			});
		} else if (isNaN(n) || n < 1) {
			setError('loanTerm', {
				type: 'manual',
				message: 'Value must be at least 1',
			});
		} else if (n > 1200) {
			setError('loanTerm', {
				type: 'manual',
				message: 'Value cannot exceed 1200',
			});
		} else {
			clearErrors('loanTerm');
		}

		// Validation: Down Payment
		if (!decimalRegex.test(downPayment)) {
			setError('downPayment', {
				type: 'manual',
				message: 'Enter a valid number',
			});
		} else if (isNaN(down) || down < 0) {
			setError('downPayment', {
				type: 'manual',
				message: 'Value must be at least 0',
			});
		} else {
			clearErrors('downPayment');
		}
	}, [
		desiredPayment,
		interestRate,
		loanTerm,
		downPayment,
		setError,
		clearErrors,
	]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.select({ ios: 'padding' })}
			>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{maxLoanAmount !== '' && (
						<View
							style={[
								styles.blurContainer,
								{
									backgroundColor:
										AppColors.placeholderTextColor,
								},
							]}
						>
							<View style={styles.resultsGrid}>
								<ResultCard
									titleIcon={Images.IC_DOLLAR}
									titleIconStyle={styles.maxLoanIconStyle}
									valueStyle={{
										textAlign: 'center',
									}}
									title="Maximum Loan Amount"
									value={
										Object.keys(errors)?.length > 0
											? '$0.00'
											: GenericHelper.formatCurrency(
													maxLoanAmount,
											  )
									}
								/>
								<ResultCard
									title="Total Purchase Price"
									titleIcon={Images.IC_STAR}
									valueStyle={{
										textAlign: 'center',
									}}
									titleIconStyle={styles.starIconStyle}
									value={
										Object.keys(errors)?.length > 0
											? '$0.00'
											: GenericHelper.formatCurrency(
													purchasePrice,
											  )
									}
									contentContainerStyle={{
										backgroundColor: AppColors.aquaColor,
									}}
								/>
							</View>
						</View>
					)}
					<View
						style={[
							styles.loanBlurContainer,
							{ backgroundColor: AppColors.placeholderTextColor },
						]}
					>
						<View>
							<View style={styles.header}>
								<Image
									source={Images.IC_SETTINGS}
									style={styles.settingImg}
								/>
								<Text style={styles.sectionTitle}>
									Loan Parameters
								</Text>
							</View>

							<Controller
								control={control}
								name="desiredPayment"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Desired Payment"
										placeholder="2500"
										value={value || ''}
										onChangeText={onChange}
										keyboardType={'numeric'}
										error={errors?.desiredPayment?.message}
									/>
								)}
							/>

							<Controller
								control={control}
								name="interestRate"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Interest Rate"
										placeholder="11.9"
										value={value || ''}
										onChangeText={onChange}
										keyboardType={'numeric'}
										error={errors?.interestRate?.message}
									/>
								)}
							/>

							<Controller
								control={control}
								name="loanTerm"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Loan Term (months)"
										placeholder="60"
										value={value || ''}
										onChangeText={onChange}
										keyboardType={'numeric'}
										error={errors?.loanTerm?.message}
									/>
								)}
							/>

							<Controller
								control={control}
								name="downPayment"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Down Payment"
										placeholder="0"
										value={value || ''}
										onChangeText={onChange}
										keyboardType={'numeric'}
										error={errors?.downPayment?.message}
									/>
								)}
							/>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: AppColors.royalBlue,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 24,
		paddingBottom: 40,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#1A1A1A',
		marginBottom: 8,
		textAlign: 'center',
	},
	resultsGrid: {
		gap: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: AppColors.white,
	},
	blurContainer: {
		borderRadius: 16,
		overflow: 'hidden',
	},
	loanBlurContainer: {
		padding: 16,
		marginVertical: 20,
		borderRadius: 16,
		overflow: 'hidden',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	settingImg: {
		height: 18,
		width: 18,
		tintColor: AppColors.white,
		marginRight: MetricsSizes.small,
	},
	maxLoanIconStyle: {
		tintColor: AppColors.aquaColor,
		height: 15,
		width: 15,
		marginRight: MetricsSizes.small,
	},
	starIconStyle: {
		height: 15,
		width: 15,
		marginRight: MetricsSizes.small,
	},
});

export default AffordabilityAnalysis;
