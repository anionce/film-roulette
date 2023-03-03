export const searcResult = (array1: any, array2: any): any => {
	const concatArray: any = array1 && array2 && array1?.concat(array2);

	let duplicated: any[] = [];

	concatArray?.forEach((el: any, index: number) => {
		concatArray.forEach((item: any, indice: number) => {
			if (el === item && index !== indice && !duplicated.includes(item)) {
				duplicated.push(item);
			}
		});
	});

	return duplicated;
};
