import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Column = {
	label: string;
	key: string;
};

type TableProps = {
	columns: Column[];
	data: any[];
};

const Table: React.FC<TableProps> = ({ columns, data }) => {
	const renderCell = (item: any, key: string) => {
		return item[key]; // just return the value directly
	};

	return (
		<View style={styles.container}>
			<View style={styles.tableHeader}>
				{columns.map(col => (
					<Text key={col.key} style={styles.cell}>
						{col.label}
					</Text>
				))}
			</View>

			<FlatList
				data={data}
				keyExtractor={(_, idx) => idx.toString()}
				renderItem={({ item }) => (
					<View style={styles.tableRow}>
						{columns.map(col => (
							<Text key={col.key} style={styles.cell}>
								{renderCell(item, col.key)}
							</Text>
						))}
					</View>
				)}
				style={styles.flatList}
				showsVerticalScrollIndicator={true}
				removeClippedSubviews={false}
				maxToRenderPerBatch={100}
				windowSize={100}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tableHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#D1D5DB',
		paddingVertical: 6,
		paddingHorizontal: 4,
		marginTop: 10,
	},
	tableRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 6,
		paddingHorizontal: 4,
		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
	cell: {
		flex: 1,
		fontSize: 12,
		textAlign: 'center',
	},
	flatList: {
		flex: 1,
		maxHeight: 400, // Set a reasonable max height
	},
});

export default Table;
