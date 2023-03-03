import './ListPage.scss';
import React from 'react';

export const ListPage = () => {
	/* const { data: capsules, isFetching, isError } = useListQuery();

	const { onInputChange, searchedItems, searchText, emptySearch } = useSearch(data);
	const { filteredItems, emptyFilter, onTypeChanged } = useFilter(data);

	const searchedArray: any = !emptySearch ? searchedItems : data;
	const filteredArray: any = !emptyFilter ? filteredItems : data;
	const finalResult: any = searcResult(searchedArray, filteredArray); 

	let { currentItems, paginate, currentPage, pagesPerPage } = usePagination(finalResult);*/

	return (
		<>
			{/* <Input searchText={searchText} onInputChange={onInputChange} />
			{isFetching && <div className='loading'>Loading...</div>}
			{isError && <ErrorPage />}
			{currentItems && currentItems?.length === 0 && <NotFound />}
			<div className='list-container'>
				{currentItems?.map((item: Rocket) => (
					<Card key={item.id} item={item} />
				))}
				<Pagination
					count={finalResult?.length}
					paginate={paginate}
					pagesPerPage={pagesPerPage}
					currentPage={currentPage}
				/>
			</div> */}
		</>
	);
};
