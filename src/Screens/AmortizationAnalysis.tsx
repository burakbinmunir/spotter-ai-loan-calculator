import React, { useCallback, useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	ImageProps,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { AMORTIZATION_FALLBACKS, AppColors, FontSize, MetricsSizes } from '../Helpers/Variables';
import { BlurView } from '@react-native-community/blur';
import LoanParametersModal, {
	FormData,
} from '../Components/LoanParametersModal';
import { Images } from '../Assets/Images';

interface KeyValueItemProps {
	keyItem: string;
	value: string;
	imgSrc: ImageSourcePropType;
	imgStyle?: ImageProps;
}

const KeyValueItem = ({ imgSrc, value, imgStyle }: KeyValueItemProps) => {
	return (
		<View
			style={{
				alignItems: 'center',
			}}
		>
			<Image source={imgSrc} style={imgStyle} />
			<Text style={styles.summaryValue}>{value}</Text>
		</View>
	);
};

const AmortizationAnalysis = () => {
	const [schedule, setSchedule] = useState<any[]>([]);
	const [showInputModal, setShowInputModal] = useState(false);
	const [loanParams, setLoanParams] = useState<FormData>({
		loanAmount: '175000',
		interestRate: '11.9',
		term: '60',
		downPayment: '0',
		balloonPayment: '0',
	});

	const parseFloatSafe = (val: string, fallback = 0) =>
		isNaN(parseFloat(val)) ? fallback : parseFloat(val);

	const generateSchedule = useCallback(() => {
		const loanAmount = parseFloatSafe(loanParams.loanAmount || AMORTIZATION_FALLBACKS.loanAmount);
		const annualRate = parseFloatSafe(loanParams.interestRate || AMORTIZATION_FALLBACKS.interestRate);
		const term = parseFloatSafe(loanParams.term || AMORTIZATION_FALLBACKS.loanTerm);
		const downPayment = parseFloatSafe(loanParams.downPayment || AMORTIZATION_FALLBACKS.downPayment);
		const balloonPayment = parseFloatSafe(loanParams.balloonPayment || AMORTIZATION_FALLBACKS.balloonPayment);

		const principal = loanAmount - downPayment;
		const monthlyRate = annualRate / 100 / 12;
		const amortizingAmount = principal;

		const monthlyPayment =
			monthlyRate === 0
				? amortizingAmount / term
				: (amortizingAmount * monthlyRate) /
				  (1 - Math.pow(1 + monthlyRate, -term));

		let balance = amortizingAmount;
		const scheduleArray = [];

		// Initial month
		scheduleArray.push({
			month: '0',
			payment: '-',
			interest: '-',
			principal: '-',
			balance: `$${(balance + balloonPayment).toFixed(2)}`,
		});

		for (let i = 1; i <= term; i++) {
			const fullBalance = balance + balloonPayment;
			let interest = fullBalance * monthlyRate;
			let principalPaid = monthlyPayment - interest;

			if (i === term) {
				principalPaid = balance;
				interest = fullBalance * monthlyRate; // still charge interest on full balance
			}

			balance -= principalPaid;

			scheduleArray.push({
				month: i.toString(),
				payment: `$${(principalPaid + interest).toFixed(2)}`,
				interest: `$${interest.toFixed(2)}`,
				principal: `$${principalPaid.toFixed(2)}`,
				balance: `$${(balance + balloonPayment).toFixed(2)}`,
			});
		}

		// Balloon payment if applicable
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
	},[loanParams]);

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
						<Text
							style={{
								fontWeight: '500',
								color: AppColors.white,
								fontSize: FontSize.large,
							}}
						>
							{`${item.payment}`}
						</Text>
						<Text style={styles.subTextStyle}>
							{`Interest Rate ${item.interest}`}
						</Text>
					</View>
					<View>
						<Text
							style={styles.subTextStyle}

						>
							{`Principal: ${item.principal}`}
						</Text>
						<Text
							style={[
								styles.subTextStyle,
							]}
						>
							{`Balance: ${item.balance}`}
						</Text>
					</View>
				</View>
			</View>
		);
	};

	const { loanAmount , interestRate, term, downPayment, balloonPayment } =
		loanParams;

	const infoItems = [
		{
			keyItem: 'Down Payment',
			value: `$${parseFloatSafe(downPayment).toLocaleString()}`,
			imgSrc: Images.IC_DOLLAR,
			imgHeight: 15,
			imgWidth: 15,
		},{
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

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={[styles.summaryCard]}>
					<BlurView
						style={StyleSheet.absoluteFill}
						blurAmount={11}
						blurType="light"
						overlayColor={AppColors.placeholderTextColor}
						reducedTransparencyFallbackColor="white"
					/>

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
					console.log('data', data);
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
	editIcon:{
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
	summaryValue: {
		fontSize: FontSize.small,
		textAlign: 'center',
		color: AppColors.white,
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
});

export default AmortizationAnalysis;
