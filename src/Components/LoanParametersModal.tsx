// components/LoanParametersModal.tsx

import React from 'react';
import {
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import CustomTextInput from './CustomTextInput';
import {
	AMORTIZATION_FALLBACKS,
	AppColors,
	MetricsSizes,
} from '../Helpers/Variables';
import { Images } from '../Assets/Images';

interface Props {
	visible: boolean;
	onClose: () => void;
	onSave: (data: FormData) => void;
	defaultValues: FormData;
}

export interface FormData {
	loanAmount: string;
	interestRate: string;
	term: string;
	downPayment: string;
	balloonPayment: string;
	extraMonthlyPayment?: string;
	oneTimePaymentAmount?: string;
	oneTimePaymentMonth?: string;
}

const LoanParametersModal: React.FC<Props> = ({
	visible,
	onClose,
	onSave,
	defaultValues,
}) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues,
	});

	const onSubmit = (data: FormData) => {
		const modifiedData = {
			...data,
			interestRate:
				parseFloat(data.interestRate) ||
				AMORTIZATION_FALLBACKS.interestRate,
			loanAmount:
				parseFloat(data.loanAmount) ||
				AMORTIZATION_FALLBACKS.loanAmount,
			term: parseFloat(data.term) || AMORTIZATION_FALLBACKS.loanTerm,
			downPayment:
				parseFloat(data.downPayment) ||
				AMORTIZATION_FALLBACKS.downPayment,
			balloonPayment:
				parseFloat(data.balloonPayment) ||
				AMORTIZATION_FALLBACKS.balloonPayment,
			extraMonthlyPayment:
				parseFloat(data.extraMonthlyPayment ?? '') ||
				AMORTIZATION_FALLBACKS.extraMonthlyPayment,
			oneTimePaymentAmount:
				parseFloat(data.oneTimePaymentAmount ?? '') ||
				AMORTIZATION_FALLBACKS.oneTimePaymentAmount,
			oneTimePaymentMonth:
				parseFloat(data.oneTimePaymentMonth ?? '') ||
				AMORTIZATION_FALLBACKS.oneTimePaymentMonth,
			customField: 'addedManually',
		};

		onSave(modifiedData);
	};

	return (
		<Modal visible={visible} transparent animatiType="slide">
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<View style={styles.header}>
						<View style={styles.titleContainer}>
							<Image
								source={Images.IC_SETTINGS}
								style={styles.settingsImg}
							/>
							<Text style={styles.title}>Loan Parameters</Text>
						</View>
						<TouchableOpacity onPress={onClose}>
							<Text style={styles.closeButton}>✕</Text>
						</TouchableOpacity>
					</View>

					<ScrollView
						style={styles.scroll}
						showsVerticalScrollIndicator={false}
					>
						<View>
							{/** Loan Amount */}
							<Controller
								control={control}
								name="loanAmount"
								rules={{
									validate: value => {
										const parsedLoan = parseFloat(
											value ||
												AMORTIZATION_FALLBACKS.loanAmount,
										);
										if (
											isNaN(parsedLoan) ||
											parsedLoan < 0.01
										) {
											return 'Loan amount must be at least 0.01'; // Use semicolon or just return
										}
										return true;
									},
								}}
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Loan Amount"
										placeholder="$175,000"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										imgSrc={Images.IC_DOLLAR}
										imgStyles={styles.iconStyles}
										error={errors.loanAmount?.message}
									/>
								)}
							/>

							{/** Interest Rate */}
							<Controller
								control={control}
								name="interestRate"
								rules={{
									validate: value => {
										const parsedInterest = parseFloat(
											value ||
												AMORTIZATION_FALLBACKS.interestRate,
										);
										if (
											isNaN(parsedInterest) ||
											parsedInterest < 0
										) {
											return 'Value must be at least 0.';
										}
										return true;
									},
								}}
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Interest Rate (%)"
										placeholder="11.9"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										imgSrc={Images.IC_ARROW_ABOVE}
										imgStyles={styles.arrowIconStyle}
										error={errors.interestRate?.message}
									/>
								)}
							/>

							{/** Term */}
							<Controller
								control={control}
								name="term"
								rules={{
									validate: value => {
										const parsedTerm = parseFloat(
											value ||
												AMORTIZATION_FALLBACKS.loanTerm,
										);
										if (
											isNaN(parsedTerm) ||
											parsedTerm < 1
										) {
											return 'Value must be at least 1.';
										} else if (parsedTerm > 1200) {
											return 'Value cannot exceed 1200.';
										}
										return true;
									},
								}}
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Term (months)"
										placeholder="60"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										imgSrc={Images.IC_CONCENTRIC_CIRCLE}
										imgStyles={styles.arrowIconStyle}
										error={errors.term?.message}
									/>
								)}
							/>

							{/** Down Payment */}
							<Controller
								control={control}
								name="downPayment"
								rules={{
									validate: (value, formValues) => {
										const parsedDown = parseFloat(
											value ||
												AMORTIZATION_FALLBACKS.downPayment,
										);
										const parsedLoan = parseFloat(
											formValues.loanAmount ||
												AMORTIZATION_FALLBACKS.loanAmount,
										);

										if (
											isNaN(parsedDown) ||
											parsedDown < 0
										) {
											return 'Value must be at least 0.';
										} else if (parsedDown > parsedLoan) {
											return 'Down payment cannot exceed purchase price.';
										}

										return true;
									},
								}}
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Down Payment"
										placeholder="$0"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										imgSrc={Images.IC_DOLLAR}
										imgStyles={styles.iconStyles}
										error={errors.downPayment?.message}
									/>
								)}
							/>

							{/** Balloon Payment */}
							<Controller
								control={control}
								name="balloonPayment"
								rules={{
									validate: (value, formValues) => {
										const parsedBalloon = parseFloat(
											value ||
												AMORTIZATION_FALLBACKS.balloonPayment,
										);
										const parsedLoan = parseFloat(
											formValues.loanAmount ||
												AMORTIZATION_FALLBACKS.loanAmount,
										);
										if (
											isNaN(parsedBalloon) ||
											parsedBalloon < 0
										) {
											return 'Value must be at least 0.';
										} else if (parsedBalloon > parsedLoan) {
											return 'Balloon cannot exceed loan amount.';
										}
										return true;
									},
								}}
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Balloon Payment"
										placeholder="$0"
										keyboardType="numeric"
										imgSrc={Images.IC_DOLLAR}
										imgStyles={styles.iconStyles}
										value={value}
										onChangeText={onChange}
										error={errors.balloonPayment?.message}
									/>
								)}
							/>
							<Controller
								control={control}
								name="extraMonthlyPayment"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Extra Monthly Payment"
										placeholder="$0"
										keyboardType="numeric"
										value={value ?? ''}
										onChangeText={onChange}
										imgSrc={Images.IC_DOLLAR}
										imgStyles={styles.iconStyles}
									/>
								)}
							/>

							{/* One-Time Payment */}
							<Controller
								control={control}
								name="oneTimePaymentAmount"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="One-Time Payment Amount"
										placeholder="$0"
										keyboardType="numeric"
										value={value ?? ''}
										onChangeText={onChange}
										imgSrc={Images.IC_DOLLAR}
										imgStyles={styles.iconStyles}
									/>
								)}
							/>

							<Controller
								control={control}
								name="oneTimePaymentMonth"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="One-Time Payment Month"
										placeholder="e.g., 1"
										keyboardType="numeric"
										value={value ?? ''}
										onChangeText={onChange}
										imgSrc={Images.IC_CONCENTRIC_CIRCLE}
										imgStyles={styles.iconStyles}
									/>
								)}
							/>
						</View>
					</ScrollView>

					<View style={styles.footer}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={onClose}
						>
							<Text style={styles.saveButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.saveButton}
							onPress={handleSubmit(onSubmit)}
						>
							<Text style={styles.saveButtonText}>
								Save Changes
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.4)',
	},
	modal: {
		backgroundColor: AppColors.modalBackgroundColor,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		maxHeight: '80%',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: MetricsSizes.small,
	},
	title: {
		color: 'white',
		fontSize: 20,
		fontWeight: '600',
	},
	closeButton: {
		fontSize: 20,
		color: '#fff',
	},
	scroll: {
		maxHeight: 400,
	},
	footer: {
		flexDirection: 'row',
		marginTop: 20,
	},

	saveButton: {
		flex: 1, // make each button take equal space
		backgroundColor: AppColors.aquaColor,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
		marginHorizontal: 5,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cancelButton: {
		flex: 1,
		borderWidth: 1,
		borderColor: AppColors.aquaColor,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
		marginHorizontal: 5,
	},
	settingsImg: {
		tintColor: AppColors.white,
		width: 17,
		height: 17,
		marginRight: 5,
	},
	saveButtonText: {
		color: AppColors.white,
		fontWeight: '600',
		fontSize: 16,
	},
	iconStyles: {
		height: 20,
		width: 20,
		tintColor: AppColors.white,
		marginRight: MetricsSizes.small,
	},
	arrowIconStyle: {
		height: 15,
		width: 15,
		marginRight: MetricsSizes.small,
		tintColor: AppColors.white,
	},
});

export default LoanParametersModal;
