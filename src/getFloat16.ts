export const getFloat16 = (exponentWidth: number, significandPrecision: number) => {
	const exponentMask = (2 ** exponentWidth - 1) << significandPrecision;
	const fractionMask = 2 ** significandPrecision - 1;

	const exponentBias = 2 ** (exponentWidth - 1) - 1;
	const exponentMin = 1 - exponentBias;

	return (arrayBuffer: ArrayBuffer, le: boolean) => {
		const buf = new Uint8Array(arrayBuffer);
		const uint16 = le ? buf[0] | buf[1] << 8 : buf[0] << 8 | buf[1];

		const e = (uint16 & exponentMask) >> significandPrecision;
		const f = uint16 & fractionMask;
		const sign = uint16 >> 15  ? -1 : 1;

		if (e === 0) {
			return sign * (2 ** exponentMin) * (f / (2 ** significandPrecision));
		} else if (e === (2 ** exponentWidth - 1)) {
			return f ? NaN : sign * Infinity;
		}

		return sign * (2 ** (e - exponentBias)) * (1 + (f / (2 ** significandPrecision)));
	};
};
