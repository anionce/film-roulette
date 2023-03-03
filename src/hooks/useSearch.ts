import { useState } from 'react';

export const useSearch = (items: any) => {
	const [searchText, setSearchText] = useState<string>('');

	const onInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
		setSearchText(event.currentTarget.value);
	};

	const searchedItems: any = items.filter((item: any) => item.toLowerCase().includes(searchText.toLowerCase()));

	const emptySearch: Boolean = searchText.length === 0;

	return { onInputChange, searchedItems, searchText, emptySearch, setSearchText };
};
