import React, { useCallback, useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { addMonths, format } from 'date-fns';
import {
	AMORTIZATION_FALLBACKS,
	AppColors,
	FontSize,
	MetricsSizes,
} from '../Helpers/Variables';
import { GenericHelper } from '../Helpers/GenericHelper.ts';
import LoanParametersModal, {
	FormData,
} from '../Components/LoanParametersModal';
import { Images } from '../Assets/Images';
import ResultCard from '../Components/ResultCard.tsx';
import KeyValueItem from '../Components/KeyVaueItem.tsx';

const AmortizationAnalysis = () => {
	const [schedule, setSchedule] = useState<any[]>([]);
	const [showInputModal, setShowInputModal] = useState(false);
	const [earlyPayOfMonth, setEarlyPayoffMonth] = useState();
	const [interestSaved, setInterestSaved] = useState();
	const [totalInterestOriginal, setTotalInterestOriginal] = useState('');
	const [totalPaymentsOriginal, setTotalPaymentsOriginal] = useState('');

	const [showExtraPaymentOptions, setShowExtraPaymentOptions] =
		useState(false);
	const [showLoanSummary, setShowLoanSummary] = useState(false);

	const [loanParams, setLoanParams] = useState<FormData>({
		loanAmount: AMORTIZATION_FALLBACKS.loanAmount,
		interestRate: AMORTIZATION_FALLBACKS.interestRate,
		term: AMORTIZATION_FALLBACKS.loanTerm,
		downPayment: AMORTIZATION_FALLBACKS.downPayment,
		balloonPayment: AMORTIZATION_FALLBACKS.balloonPayment,
		extraMonthlyPayment: AMORTIZATION_FALLBACKS.extraMonthlyPayment,
		oneTimePaymentAmount: AMORTIZATION_FALLBACKS.oneTimePaymentAmount,
		oneTimePaymentMonth: AMORTIZATION_FALLBACKS.oneTimePaymentMonth,
	});

	const parseFloatSafe = (val: string, fallback: string) =>
		isNaN(parseFloat(val)) ? fallback : parseFloat(val);

	const generateSchedule = useCallback(() => {
		const loanAmount = parseFloatSafe(
			loanParams.loanAmount,
			AMORTIZATION_FALLBACKS.loanAmount,
		);
		const annualRate = parseFloatSafe(
			loanParams.interestRate,
			AMORTIZATION_FALLBACKS.interestRate,
		);
		const term = parseFloatSafe(
			loanParams.term,
			AMORTIZATION_FALLBACKS.loanTerm,
		);
		const downPayment = parseFloatSafe(
			loanParams.downPayment,
			AMORTIZATION_FALLBACKS.downPayment,
		);
		const balloonPayment = parseFloatSafe(
			loanParams.balloonPayment,
			AMORTIZATION_FALLBACKS.balloonPayment,
		);
		const extraMonthlyPayment = parseFloatSafe(
			loanParams.extraMonthlyPayment,
			AMORTIZATION_FALLBACKS.extraMonthlyPayment,
		);
		const oneTimePaymentAmount = parseFloatSafe(
			loanParams.oneTimePaymentAmount,
			AMORTIZATION_FALLBACKS.oneTimePaymentAmount,
		);
		const oneTimePaymentMonth = parseInt(
			loanParams.oneTimePaymentMonth ??
				AMORTIZATION_FALLBACKS.oneTimePaymentMonth,
		);

		const principal = loanAmount - downPayment;
		const monthlyRate = annualRate / 100 / 12;
		const amortizingAmount = principal;

		const pvBalloon = balloonPayment / Math.pow(1 + monthlyRate, term);
		const monthlyPayment =
			monthlyRate === 0
				? (amortizingAmount - balloonPayment) / term
				: ((amortizingAmount - pvBalloon) * monthlyRate) /
				  (1 - Math.pow(1 + monthlyRate, -term));

		let balance = amortizingAmount;
		const scheduleArray = [];

		scheduleArray.push({
			month: '0',
			payment: null,
			interest: null,
			principal: null,
			balance: balance + balloonPayment,
		});

		let totalInterest = 0;
		let payoffMonth = 0;

		for (let i = 1; i <= term; i++) {
			let interest = balance * monthlyRate;
			let principalPaid = monthlyPayment - interest;

			// Apply extra and one-time payments
			principalPaid += extraMonthlyPayment;
			if (i === oneTimePaymentMonth) {
				principalPaid += oneTimePaymentAmount;
			}

			// Avoid overpaying
			if (principalPaid > balance) {
				principalPaid = balance;
				interest = balance * monthlyRate;
			}

			const payment = principalPaid + interest;
			totalInterest += interest;

			balance -= principalPaid;

			scheduleArray.push({
				month: i.toString(),
				payment: payment,
				interest: interest,
				principal: principalPaid,
				balance: Math.max(0, balance),
			});

			if (balance <= 0) {
				payoffMonth = i;
				break;
			}
		}

		// Handle balloon payment
		if (balance > 0 && balloonPayment > 0) {
			scheduleArray.push({
				month: 'Balloon',
				payment: balloonPayment,
				interest: 0,
				principal: balloonPayment,
				balance: 0,
			});
			payoffMonth = term;
		}

		setSchedule(scheduleArray);
		setEarlyPayoffMonth(payoffMonth);

		// ========== Original Total Interest Calculation ==========
		let balanceOriginal = amortizingAmount;
		let totalInterestOriginal = 0;

		for (let i = 1; i <= term; i++) {
			const interestOriginal = balanceOriginal * monthlyRate;
			let principalOriginal = monthlyPayment - interestOriginal;

			if (i === term) {
				principalOriginal = balanceOriginal;
			}

			balanceOriginal -= principalOriginal;
			totalInterestOriginal += interestOriginal;

			if (balanceOriginal <= 0) break;
		}

		const interestSaved = totalInterestOriginal - totalInterest;
		const totalPaymentsOriginal = monthlyPayment * term;

		setInterestSaved(interestSaved ? interestSaved : '0.00');
		setTotalInterestOriginal(totalInterestOriginal);
		setTotalPaymentsOriginal(totalPaymentsOriginal);
	}, [loanParams]);

	useEffect(() => {
		generateSchedule();
	}, [generateSchedule]);

	const renderScheduleCard = (item: any) => {
		const isBalloon = item.month === 'Balloon';

		return (
			<View style={styles.itemCard}>
				<View style={styles.monthContainer}>
					{!!isBalloon ? (
						<Image
							source={Images.IC_BALLOON_PAYMENT}
							style={styles.icon}
						/>
					) : (
						<Text style={{ color: AppColors.white }}>
							{item.month}
						</Text>
					)}
				</View>
				<View style={styles.rowContainer}>
					<View>
						<Text style={styles.balanceText}>
							{isBalloon
								? '$0.00'
								: `${GenericHelper.formatCurrency(
										item?.balance,
								  )}`}
						</Text>
						<Text style={styles.subTextStyle}>
							{`Payment: ${GenericHelper.formatCurrency(
								item?.payment,
							)}`}
						</Text>
					</View>
					<View>
						<Text style={styles.subTextStyle}>
							{`Interest Rate: ${GenericHelper.formatCurrency(
								item?.interest,
							)}`}
						</Text>
						<Text style={[styles.subTextStyle]}>
							{`Principal: ${GenericHelper.formatCurrency(
								item?.principal,
							)}`}
						</Text>
					</View>
				</View>
			</View>
		);
	};

	const { loanAmount, interestRate, term, downPayment, balloonPayment } =
		loanParams;

	const infoItems = [
		{
			keyItem: 'Down Payment',
			value: `$${parseFloatSafe(downPayment).toLocaleString()}`,
			imgSrc: Images.IC_DOLLAR,
			imgHeight: 15,
			imgWidth: 15,
		},
		{
			keyItem: 'Term',
			value: `${term} months`,
			imgSrc: Images.IC_CONCENTRIC_CIRCLE,
			imgHeight: 15,
			imgWidth: 15,
		},
		{
			keyItem: 'Interest Rate',
			value: `${interestRate}%`,
			imgSrc: Images.IC_ARROW_ABOVE,
			imgHeight: 15,
			imgWidth: 15,
		},

		{
			keyItem: 'Balloon Payment',
			value: `$${parseFloatSafe(balloonPayment).toLocaleString()}`,
			imgSrc: Images.IC_DOLLAR,
			imgHeight: 15,
			imgWidth: 15,
		},
	];

	const getPayoffDateLabel = (monthsToAdd: number) => {
		if (!monthsToAdd || monthsToAdd <= 0) return 'N/A';
		const now = new Date();
		const payoffDate = addMonths(now, monthsToAdd);
		const dateLabel = format(payoffDate, 'dd MMM, yyyy');

		const years = Math.floor(monthsToAdd / 12);
		const months = monthsToAdd % 12;

		let durationLabel = '';
		if (years > 0) durationLabel += `${years} year${years > 1 ? 's' : ''}`;
		if (months > 0) {
			if (durationLabel) durationLabel += ' ';
			durationLabel += `${months} month${months > 1 ? 's' : ''}`;
		}

		return `${dateLabel} (${durationLabel})`;
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View
					style={[
						styles.summaryCard,
						{ backgroundColor: AppColors.placeholderTextColor },
					]}
				>
					<View style={styles.headerRow}>
						<View style={styles.headerLeft}>
							<Image
								source={Images.IC_SETTINGS}
								style={styles.icon}
							/>
							<Text style={styles.headerText}>
								Loan Parameters
							</Text>
						</View>

						<TouchableOpacity
							onPress={() => setShowInputModal(true)}
						>
							<View style={styles.editContainer}>
								<Image
									source={Images.IC_EDIT}
									style={styles.editIcon}
								/>
							</View>
						</TouchableOpacity>
					</View>

					<Text style={styles.loanAmountText}>Loan Amount</Text>
					<Text style={styles.loanAmountValue}>
						${parseFloatSafe(loanAmount).toLocaleString()}
					</Text>
					<View style={styles.keyValueContainer}>
						{infoItems.map((item, index) => (
							<KeyValueItem
								key={index}
								keyItem={item.keyItem}
								value={item.value}
								imgSrc={item.imgSrc}
								imgStyle={{
									height: item.imgHeight,
									width: item.imgWidth,
									tintColor: AppColors.white,
								}}
							/>
						))}
					</View>
					<View style={{ marginTop: 16 }}>
						<TouchableOpacity
							onPress={() =>
								setShowExtraPaymentOptions(prev => !prev)
							}
							style={styles.accordianContainer}
						>
							<View style={styles.accordianSubContainer}>
								<Image
									source={Images.IC_ARROW_ABOVE}
									style={styles.accordianImgStyle}
								/>
								<Text style={styles.loanSummaryText}>
									Extra Payment Options
								</Text>
							</View>
							<Image
								source={Images.IC_ARROW}
								style={[
									styles.accordianArrowStyle,
									{
										transform: [
											{
												rotate: showExtraPaymentOptions
													? '180deg'
													: '0deg',
											},
										],
									},
								]}
							/>
						</TouchableOpacity>

						{showExtraPaymentOptions && (
							<View style={{ paddingVertical: 12 }}>
								{!!earlyPayOfMonth && (
									<ResultCard
										title={'New Payoff Date'}
										value={getPayoffDateLabel(
											earlyPayOfMonth,
										)}
										imgSrc={Images.IC_CONCENTRIC_CIRCLE}
										valueStyle={styles.extraPaymentValue}
										titleStyle={styles.extraPaymentTitle}
										contentContainerStyle={
											styles.extraPaymentContainer
										}
									/>
								)}

								{!!interestSaved && (
									<ResultCard
										title={'Interest Saved'}
										value={GenericHelper.formatCurrency(
											interestSaved,
										)}
										imgSrc={Images.IC_ARROW_ABOVE}
										valueStyle={styles.extraPaymentValue}
										titleStyle={styles.extraPaymentTitle}
										contentContainerStyle={
											styles.extraPaymentContainer
										}
									/>
								)}
							</View>
						)}
					</View>
					<View style={{ marginTop: 16 }}>
						<TouchableOpacity
							onPress={() => setShowLoanSummary(prev => !prev)}
							style={styles.accordianContainer}
						>
							<View style={styles.accordianSubContainer}>
								<Image
									source={Images.IC_PIE_CHART}
									style={styles.accordianImgStyle}
								/>
								<Text style={styles.loanSummaryText}>
									Loan Summary
								</Text>
							</View>
							<Image
								source={Images.IC_ARROW}
								style={[
									styles.accordianArrowStyle,
									{
										transform: [
											{
												rotate: showLoanSummary
													? '180deg'
													: '0deg',
											},
										],
									},
								]}
							/>
						</TouchableOpacity>

						{showLoanSummary && (
							<View style={{ paddingVertical: 12 }}>
								{!!totalPaymentsOriginal && (
									<ResultCard
										title={'Original Total Payments'}
										value={GenericHelper.formatCurrency(
											totalPaymentsOriginal,
										)}
										valueStyle={styles.loanSummaryValue}
										contentContainerStyle={
											styles.loanSummaryContainer
										}
									/>
								)}

								{!!totalInterestOriginal && (
									<ResultCard
										title={'Original Total Interest'}
										value={GenericHelper.formatCurrency(
											totalInterestOriginal,
										)}
										valueStyle={styles.loanSummaryValue}
										contentContainerStyle={
											styles.loanSummaryContainer
										}
									/>
								)}
							</View>
						)}
					</View>
				</View>

				<View style={styles.scheduleSection}>
					<Text style={styles.sectionTitle}>Payment Schedule</Text>
					<FlatList
						data={schedule}
						keyExtractor={(item, index) => `${item.month}-${index}`}
						renderItem={({ item, index }) =>
							renderScheduleCard(item)
						}
						contentContainerStyle={styles.scheduleContainer}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</View>

			<LoanParametersModal
				visible={showInputModal}
				onClose={() => setShowInputModal(false)}
				defaultValues={loanParams}
				onSave={(data: FormData) => {
					setLoanParams(data);
					setShowInputModal(false);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	headerRow: {
		flexDirection: 'row',
		marginBottom: MetricsSizes.small,
		justifyContent: 'space-between',
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	editIcon: {
		height: 15,
		width: 15,
		tintColor: AppColors.white,
	},
	icon: {
		height: 15,
		width: 15,
		tintColor: AppColors.white,
	},
	headerText: {
		fontSize: 16,
		color: AppColors.white,
		marginHorizontal: MetricsSizes.small,
	},
	container: {
		flex: 1,
		backgroundColor: AppColors.royalBlue,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	summaryCard: {
		padding: 12,
		paddingVertical: MetricsSizes.medium,
		borderRadius: 20,
		backgroundColor: AppColors.emraldGreen,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.1,
		shadowRadius: 16,
		elevation: 5,
		borderColor: 'rgba(255,255,255,0.2)',
		borderWidth: 1,
	},
	scheduleSection: {
		flex: 1,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: AppColors.white,
		marginVertical: 10,
	},
	scheduleContainer: {
		gap: 12,
	},
	monthContainer: {
		borderWidth: 1,
		borderRadius: 9999,
		width: 26,
		height: 26,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: AppColors.white,
	},
	rowContainer: {
		flex: 1,
		justifyContent: 'space-between',
		marginLeft: MetricsSizes.regular,
	},
	subTextStyle: {
		marginTop: MetricsSizes.tiny,
		fontSize: FontSize.small,
		color: AppColors.greyishWhite,
	},
	itemCard: {
		backgroundColor: AppColors.emraldGreen,
		padding: MetricsSizes.regular,
		borderRadius: 9,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		flexDirection: 'row',
		alignItems: 'center',
		elevation: 1,
	},
	loanAmountText: {
		textAlign: 'center',
		fontSize: FontSize.small,
		color: AppColors.white,
	},
	loanAmountValue: {
		textAlign: 'center',
		fontSize: FontSize.extraLarge + FontSize.extraSmall,
		fontWeight: 'semibold',
		color: AppColors.white,
	},
	keyValueContainer: {
		marginVertical: MetricsSizes.small,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: MetricsSizes.regular,
	},
	editContainer: {
		// borderWidth: 1,
		// borderRadius: 30,
		// borderColor: AppColors.white,
		// padding: MetricsSizes.small - 1,
		alignSelf: 'flex-end',
	},
	loanSummaryValue: {
		color: AppColors.aquaColor,
		fontSize: FontSize.extraLarge,
		textAlign: 'center',
	},
	loanSummaryContainer: {
		borderWidth: 1,
		borderColor: AppColors.aquaColor,
		backgroundColor: AppColors.fadedLightAquaColor,
	},
	accordianArrowStyle: {
		height: 15,
		width: 15,
		tintColor: AppColors.aquaColor,
	},
	loanSummaryText: {
		fontSize: FontSize.regular,
		fontWeight: '600',
		color: AppColors.white,
	},
	accordianImgStyle: {
		tintColor: AppColors.aquaColor,
		height: 15,
		width: 15,
		marginRight: MetricsSizes.small,
	},
	accordianSubContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	accordianContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: AppColors.royalBlue,
		padding: 12,
		borderRadius: 10,
	},
	extraPaymentValue: {
		fontSize: FontSize.large,
	},
	extraPaymentTitle: {
		fontSize: FontSize.small,
		fontWeight: 'normal',
	},
	extraPaymentContainer: {
		alignItems: 'flex-start',
		backgroundColor: AppColors.aquaColor,
	},
	balanceText: {
		fontWeight: '500',
		color: AppColors.white,
		fontSize: FontSize.large,
	},
});

export default AmortizationAnalysis;
