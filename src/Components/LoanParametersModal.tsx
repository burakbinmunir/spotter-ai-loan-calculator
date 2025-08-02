// components/LoanParametersModal.tsx

import React, { useEffect } from 'react';
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import CustomTextInput from './CustomTextInput';
import { AMORTIZATION_FALLBACKS, AppColors } from '../Helpers/Variables';

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
		setError,
		clearErrors,
		watch,
	} = useForm<FormData>({
		defaultValues,
	});

	const loanAmount = watch('loanAmount');
	const term = watch('term');
	const interestRate = watch('interestRate');
	const downPayment = watch('downPayment');
	const balloonPayment = watch('balloonPayment');

	useEffect(() => {
		const parsedLoan = parseFloat(
			loanAmount || AMORTIZATION_FALLBACKS.loanAmount,
		);
		const parsedInterest = parseFloat(
			interestRate || AMORTIZATION_FALLBACKS.interestRate,
		);
		const parsedTerm = parseInt(
			term || AMORTIZATION_FALLBACKS.loanTerm,
			10,
		);
		const parsedDown = parseFloat(
			downPayment || AMORTIZATION_FALLBACKS.downPayment,
		);
		const parsedBalloon = parseFloat(
			balloonPayment || AMORTIZATION_FALLBACKS.balloonPayment,
		);

		// Loan Amount
		if (isNaN(parsedLoan) || parsedLoan < 0.01) {
			setError('loanAmount', {
				type: 'manual',
				message: 'Loan amount must be at least 0.01',
			});
		} else {
			clearErrors('loanAmount');
		}

		// Interest Rate
		if (isNaN(parsedInterest) || parsedInterest < 0) {
			setError('interestRate', {
				type: 'manual',
				message: 'Value must be at least 0.',
			});
		} else {
			clearErrors('interestRate');
		}

		// Term
		if (isNaN(parsedTerm) || parsedTerm < 1) {
			setError('term', {
				type: 'manual',
				message: 'Value must be at least 1.',
			});
		} else if (parsedTerm > 1200) {
			setError('term', {
				type: 'manual',
				message: 'Value cannot exceed 1200.',
			});
		} else {
			clearErrors('term');
		}

		// Down Payment
		if (isNaN(parsedDown) || parsedDown < 0) {
			setError('downPayment', {
				type: 'manual',
				message: 'Value must be at least 0.',
			});
		} else if (parsedDown > parsedLoan) {
			setError('downPayment', {
				type: 'manual',
				message: 'Down payment cannot exceed purchase price.',
			});
		} else {
			clearErrors('downPayment');
		}

		// Balloon Payment
		if (isNaN(parsedBalloon) || parsedBalloon < 0) {
			setError('balloonPayment', {
				type: 'manual',
				message: 'Value must be at least 0.',
			});
		} else if (parsedBalloon > parsedLoan) {
			setError('balloonPayment', {
				type: 'manual',
				message: 'Balloon cannot exceed loan amount.',
			});
		} else {
			clearErrors('balloonPayment');
		}
	}, [loanAmount, interestRate, term, downPayment, balloonPayment]);

	return (
		<Modal visible={visible} transparent animationType="slide">
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<View style={styles.header}>
						<Text style={styles.title}>Loan Parameters</Text>
						<TouchableOpacity onPress={onClose}>
							<Text style={styles.closeButton}>✕</Text>
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.scroll}>
						<View style={styles.inputGrid}>
							{/** Loan Amount */}
							<Controller
								control={control}
								name="loanAmount"
								rules={{ required: 'Required' }}
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Loan Amount"
										placeholder="$175,000"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										error={errors.loanAmount?.message}
									/>
								)}
							/>

							{/** Interest Rate */}
							<Controller
								control={control}
								name="interestRate"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Interest Rate (%)"
										placeholder="11.9"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										error={errors.interestRate?.message}
									/>
								)}
							/>

							{/** Term */}
							<Controller
								control={control}
								name="term"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Term (months)"
										placeholder="60"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										error={errors.term?.message}
									/>
								)}
							/>

							{/** Down Payment */}
							<Controller
								control={control}
								name="downPayment"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Down Payment"
										placeholder="$0"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										error={errors.downPayment?.message}
									/>
								)}
							/>

							{/** Balloon Payment */}
							<Controller
								control={control}
								name="balloonPayment"
								render={({ field: { onChange, value } }) => (
									<CustomTextInput
										label="Balloon Payment"
										placeholder="$0"
										keyboardType="numeric"
										value={value}
										onChangeText={onChange}
										error={errors.balloonPayment?.message}
									/>
								)}
							/>
						</View>
					</ScrollView>

					<View style={styles.footer}>
						<TouchableOpacity
							style={styles.saveButton}
							onPress={handleSubmit(onSave)}
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
		backgroundColor: AppColors.royalBlue,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		maxHeight: '80%',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
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
	inputGrid: {
		gap: 16,
	},
	footer: {
		marginTop: 20,
	},
	saveButton: {
		backgroundColor: AppColors.aquaColor,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	saveButtonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 16,
	},
});

export default LoanParametersModal;
