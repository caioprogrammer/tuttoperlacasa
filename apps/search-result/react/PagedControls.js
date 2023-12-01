import React, { useEffect, useState } from 'react';
import { path } from 'ramda'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { usePages } from './hooks/usePages'
import { useCssHandles } from 'vtex.css-handles'
import { IconCaret } from 'vtex.store-icons'
import { useRuntime } from 'vtex.render-runtime'

const CSS_HANDLES = [
  "pagedControlsContainer",
  "pagedControlsContainerLoading",
  "previousPage",
  "previousPageDisabled",
  "previousPageText",
  "previousPageIconContainer",
  "nextPage",
  "nextPageDisabled",
  "nextPageText",
  "nextPageIconContainer",
  "firstPage",
  "firstPageElipsis",
  "lastPage",
  "lastPageElipsis",
  "pageButton",
  "pageButtonCurrent"
]

function PagedControls({
    maxPageButtons=5,
    showFirstPage=true,
    showLastPage=true,
    scrollToTop= "smooth", 
    previousPageText="Anterior",
    nextPageText="Próximo", 
    PreviousPageIcon, 
    NextPageIcon
  }) {
  const { searchQuery, maxItemsPerPage, page } = useSearchPage()
  const products = path(['data', 'productSearch', 'products'], searchQuery)
  const [pagesToRender, setPagesToRender] = useState([])
  const [pagesQuantity, setPagesQuantity] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(0);
  const [nextPage, setNextPage] = useState();
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )
  const {query} = useRuntime();

  useEffect(() => {
    if(query.page){
      setCurrentPage(parseInt(query.page))
      setNextPage(parseInt(query.page) + 2)
      setPreviousPage(parseInt(query.page) - 1)
    }
  }, [query])

  const fetchMore = path(['fetchMore'], searchQuery)
  const queryData = {
    query: path(['variables', 'query'], searchQuery),
    map: path(['variables', 'map'], searchQuery),
    orderBy: path(['variables', 'orderBy'], searchQuery),
    priceRange: path(['variables', 'priceRange'], searchQuery),
  }

  const { handleFetchPage,  loading } = usePages({
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products,
    queryData,
  })

  const handles = useCssHandles(CSS_HANDLES)
  
  useEffect(() => {
    if(!recordsFiltered) return
    setPagesQuantity(Math.ceil(recordsFiltered / maxItemsPerPage))
  }, [recordsFiltered])


  useEffect(() => {
    if(!pagesQuantity) return

    setPagesToRender(getRangeToRender(currentPage, maxPageButtons, pagesQuantity))
    if(scrollToTop !== 'none') {
      window.scrollTo({ top: 0, left: 0, behavior: scrollToTop }) 
    } 
  }, [pagesQuantity, currentPage])

  function getRangeToRender(currentPage, maxQuantity, quantity) {
    if(quantity < maxQuantity) return getArrayFilled(1, quantity)
    
    const maxPageButtonsHalf = Math.floor(maxQuantity / 2)
    
    let fromPage = currentPage - maxPageButtonsHalf
    let toPage =  maxQuantity % 2 === 0 ? currentPage + maxPageButtonsHalf - 1 : currentPage + maxPageButtonsHalf  

    if(toPage <= maxQuantity) {
      fromPage = 1
      toPage = fromPage + maxQuantity - 1
      
      return getArrayFilled(fromPage, toPage)
    }
    
    if(toPage > quantity) {
      toPage = quantity
      fromPage = toPage - maxQuantity + 1

      return getArrayFilled(fromPage, toPage)
    }

    return getArrayFilled(fromPage, toPage)
  }

  function getArrayFilled(start, end) {
    return Array(end - start + 1).fill().map((_, i) => start + i)
  }
  
  return (
    <div 
      className={`${handles.pagedControlsContainer} 
      ${loading ? handles.pagedControlsContainerLoading : ''}`}
    >
      <button 
        className={`${handles.previousPage} ${previousPage === 0 ? handles.previousPageDisabled : ''}`}
        onClick={() => handleFetchPage(currentPage -1)} 
        disabled={previousPage === 0}
      >
        <span className={handles.previousPageIconContainer}>
          {PreviousPageIcon ?  <PreviousPageIcon /> : <IconCaret orientation="left"/>}
        </span>
        <span className={handles.previousPageText}>
          {previousPageText}
        </span>
      </button>

        {pagesToRender[0] > 1 && showFirstPage ?
          <button 
            className={handles.firstPage}
            onClick={() => handleFetchPage(1)}
          >
            1
            <span className={handles.firstPageElipsis}>...</span>
          </button>
          : ""
        }
        {pagesToRender?.map(page => (
          <button 
            className={`${handles.pageButton} ${handles.pageButton}--${page} ${currentPage === page ? `${handles.pageButton}--current` : ''}`} 
            key={page} 
            onClick={() => handleFetchPage(page)}
          >
            {page}
          </button>
        ))}
        {pagesToRender[pagesToRender.length - 1] < pagesQuantity && showLastPage && 
          <button 
            className={handles.lastPage}
            onClick={() => handleFetchPage(pagesQuantity)}
          >
            <span className={handles.lastPageElipsis}>...</span>
            {pagesQuantity}
          </button>
        }

      <button 
      className={`${handles.nextPage} ${nextPage > pagesQuantity ? handles.nextPageDisabled : ''}`}
        onClick={() => handleFetchPage(currentPage + 1)} 
        disabled={nextPage > pagesQuantity}
      >
        <span className={handles.nextPageText}>
          {nextPageText}
        </span>
        <span className={handles.nextPageIconContainer}>
          {NextPageIcon ?  <NextPageIcon /> : <IconCaret orientation="right"/> } 
        </span>
      </button>
    </div>
  );
}

export default PagedControls;