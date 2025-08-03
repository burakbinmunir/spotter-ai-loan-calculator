import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AmortizationAnalysis from '../Screens/AmortizationAnalysis.tsx';
import AffordabilityAnalysis from '../Screens/AffordabilityAnalysis.tsx';
import InterestRateAnalysis from '../Screens/InterestRateAnalysis.tsx';
import { AppColors, MetricsSizes, TAB_IMAGES } from '../Helpers/Variables.ts';
import { Image, StyleSheet, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

const ApplicationNavigator = () => {
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
							height: 50,
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: AppColors.emraldGreen,
							// justifyContent: 'flex-end',
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
					borderTopWidth: 1,
				},
			}}
		>
			<Tab.Screen
				name="AmortizationAnalysis"
				component={AmortizationAnalysis}
				options={{
					title: 'Amortization Analysis',
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
					title: 'Affordability Analysis',
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
					title: 'Interest Rate Analysis',
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
