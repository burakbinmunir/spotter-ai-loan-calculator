export class GenericHelper {
	static formatCurrency = (val, decimalPoint = 2) => {
		return val
			? `$${val.toLocaleString(undefined, {
					minimumFractionDigits: decimalPoint,
					maximumFractionDigits: decimalPoint,
			  })}`
			: '-';
	};
}
