import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AmortizationAnalysis from '../Screens/AmortizationAnalysis.tsx';
import AffordabilityAnalysis from '../Screens/AffordabilityAnalysis.tsx';
import InterestRateAnalysis from '../Screens/InterestRateAnalysis.tsx';
import { AppColors, MetricsSizes, TAB_IMAGES } from '../Helpers/Variables.ts';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const ApplicationNavigator = () => {
	const insets = useSafeAreaInsets();

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: true,
				headerBackground: () => (
					<View
						style={{
							flex: 1,
							backgroundColor: AppColors.emraldGreen,
						}}
					/>
				),
				header: props => (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingTop: insets.top,
							height: 50 + insets.top,
							backgroundColor: AppColors.emraldGreen,
							paddingHorizontal: 16,
						}}
					>
						<Image
							source={TAB_IMAGES[props.route.name]}
							style={styles.tabIconStyle}
						/>
						<Text style={{ color: AppColors.white, fontSize: 20 }}>
							{props?.options.title}
						</Text>
					</View>
				),
				headerTintColor: AppColors.white,
				tabBarActiveTintColor: AppColors.aquaColor,
				tabBarInactiveTintColor: '#8E8E93',
				tabBarStyle: {
					backgroundColor: AppColors.emraldGreen,
				},
			}}
		>
			<Tab.Screen
				name="AmortizationAnalysis"
				component={AmortizationAnalysis}
				options={{
					title: 'Amortization Calculator',
					tabBarIcon: ({ focused }) => (
						<Image
							style={{
								height: 20,
								width: 20,
								tintColor: focused
									? AppColors.aquaColor
									: '#8E8E93',
							}}
							source={TAB_IMAGES.AmortizationAnalysis}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="AffordabilityAnalysis"
				component={AffordabilityAnalysis}
				options={{
					title: 'Affordability Calculator',
					tabBarIcon: ({ focused }) => (
						<Image
							style={{
								height: 20,
								width: 20,
								tintColor: focused
									? AppColors.aquaColor
									: '#8E8E93',
							}}
							source={TAB_IMAGES.AffordabilityAnalysis}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="InterestRateAnalysis"
				component={InterestRateAnalysis}
				options={{
					title: 'Interest Rate Calculator',
					tabBarIcon: ({ focused }) => (
						<Image
							style={{
								height: 20,
								width: 20,
								tintColor: focused
									? AppColors.aquaColor
									: '#8E8E93',
							}}
							source={TAB_IMAGES.InterestRateAnalysis}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default ApplicationNavigator;

const styles = StyleSheet.create({
	tabIconStyle: {
		height: 20,
		width: 20,
		tintColor: AppColors.white,
		marginRight: MetricsSizes.small,
	},
});
