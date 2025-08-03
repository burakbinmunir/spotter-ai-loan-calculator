/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {
	StatusBar,
	StyleSheet,
	useColorScheme,
	Platform,
} from 'react-native';
import ApplicationNavigator from './src/Navigators/ApplicationNavigator.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<SafeAreaProvider>
			<StatusBar
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor="transparent"
				translucent={Platform.OS === 'android'}
			/>
			<NavigationContainer>
				<ApplicationNavigator />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
