import { ChangeEvent, useState } from 'react';

export const useFilter = (items: any, item: any) => {
	const [type, setType] = useState<string | undefined>(item?.type);

	const onTypeChanged = (event: ChangeEvent<HTMLSelectElement>): void => setType(event.target.value);

	const itemsArray: any = items?.filter((item: any) => item.type === type);

	const filteredItems: any = itemsArray?.length ? itemsArray : items;

	const emptyFilter: Boolean = type === 'All';

	return { type, emptyFilter, filteredItems, onTypeChanged, setType };
};
