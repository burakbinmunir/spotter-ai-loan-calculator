import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AmortizationAnalysis from '../Screens/AmortizationAnalysis.tsx';
import AffordabilityAnalysis from '../Screens/AffordabilityAnalysis.tsx';
import InterestRateAnalysis from '../Screens/InterestRateAnalysis.tsx';
import { AppColors } from '../Helpers/Variables.ts';
import { Image, View } from 'react-native';
import { Images } from '../Assets/Images';

const Tab = createBottomTabNavigator();

const ApplicationNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: true,
				headerBackground: () => (
					<View style={{ flex: 1, backgroundColor: AppColors.emraldGreen }} />
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
						<Image style={{ height: 20, width: 20, tintColor: focused ? AppColors.aquaColor : '#8E8E93', }}
							   source={Images.IC_BAR_CHART}
						/>
					)
				}}
			/>
			<Tab.Screen
				name="AffordabilityAnalysis"
				component={AffordabilityAnalysis}
				options={{
					title: 'Affordability Analysis',
					tabBarIcon: ({ focused }) => (
						<Image style={{ height: 20, width: 20, tintColor: focused ? AppColors.aquaColor : '#8E8E93', }}
							   source={Images.IC_PIE_CHART}
						/>
					)
				}}
			/>
			<Tab.Screen
				name="InterestRateAnalysis"
				component={InterestRateAnalysis}
				options={{
					title: 'Interest Rate Analysis',
					tabBarIcon: ({ focused }) => (
						<Image style={{ height: 20, width: 20, tintColor: focused ? AppColors.aquaColor : '#8E8E93', }}
							   source={Images.IC_ARROW_ABOVE}
						/>
					)
				}}
			/>
		</Tab.Navigator>
	);
};

export default ApplicationNavigator;
