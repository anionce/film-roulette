import React from 'react';
import './Pagination.scss';

type PaginationProps = {
	count: number | undefined;
	paginate: (arg: number) => void;
	pagesPerPage: number;
	currentPage: number;
};

export const Pagination = ({ count, paginate, pagesPerPage, currentPage }: PaginationProps) => {
	const hasItemsToShow: Boolean = Boolean(count);
	const pagesCount: number = Math.ceil((count || 25) / pagesPerPage);
	const onPageNumberClick = (i: number): void => {
		paginate(i);
	};

	return (
		<>
			{hasItemsToShow && (
				<div className='pagination'>
					{[...new Array(pagesCount)].map((_, i) => (
						<div
							title='pageNumber'
							key={i}
							className={i + 1 === currentPage ? 'active' : 'page'}
							onClick={() => onPageNumberClick(i + 1)}>
							{i + 1}
						</div>
					))}
				</div>
			)}
		</>
	);
};
