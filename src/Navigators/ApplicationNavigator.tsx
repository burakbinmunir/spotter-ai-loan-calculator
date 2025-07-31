import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AmortizationAnalysis from '../Screens/AmortizationAnalysis.tsx';
import AffordabilityAnalysis from '../Screens/AffordabilityAnalysis.tsx';
import InterestRateAnalysis from '../Screens/InterestRateAnalysis.tsx';

const Tab = createBottomTabNavigator();

const ApplicationNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: true,
				tabBarActiveTintColor: '#007AFF',
				tabBarInactiveTintColor: '#8E8E93',
				tabBarStyle: {
					backgroundColor: '#FFFFFF',
					borderTopWidth: 1,
					borderTopColor: '#E5E5EA',
				},
			}}
		>
			<Tab.Screen
				name="AmortizationAnalysis"
				component={AmortizationAnalysis}
				options={{
					title: 'Amortization Analysis',
				}}
			/>
			<Tab.Screen
				name="AffordabilityAnalysis"
				component={AffordabilityAnalysis}
				options={{
					title: 'Affordability Analysis',
				}}
			/>
			<Tab.Screen
				name="InterestRateAnalysis"
				component={InterestRateAnalysis}
				options={{
					title: 'Interest Rate Analysis',
				}}
			/>
		</Tab.Navigator>
	);
};

export default ApplicationNavigator;
