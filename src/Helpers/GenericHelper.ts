export class GenericHelper {
	static formatCurrency = val => {
		return val
			? `$${val.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
			  })}`
			: '-';
	};
}
