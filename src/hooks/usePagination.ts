import { useState } from 'react';

export const usePagination = (totalItems: any) => {
	const [pagesPerPage] = useState<number>(5);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const indexOfLastPost: number = currentPage * pagesPerPage;
	const indexOfFirstPost: number = indexOfLastPost - pagesPerPage;

	const currentItems: any = totalItems?.slice(indexOfFirstPost, indexOfLastPost);

	const paginate = (pageNumber: number): void => {
		setCurrentPage(pageNumber);
	};

	return { currentItems, paginate, currentPage, pagesPerPage };
};
