import React, { FC } from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { SearchBreadcrumb as SearchBreadcrumbStructuredData } from 'vtex.structured-data'

import BaseBreadcrumb, { NavigationItem } from '../BaseBreadcrumb'

interface Props {
  showOnMobile?: boolean,
  homeIconSize?: number,
  caretIconSize?: number,
  homeType?: "icon" | "text",
  homeLinkText?: string, 
}

const SearchBreadcrumb: FC<Props> = ({
  showOnMobile,
  homeIconSize,
  caretIconSize,
  homeType,
  homeLinkText
}) => {
  const { searchQuery } = useSearchPage()
  const breadcrumb: NavigationItem[] =
    searchQuery?.data?.productSearch?.breadcrumb ??
    searchQuery?.data?.facets?.breadcrumb ??
    []

  return (
    <>
      <SearchBreadcrumbStructuredData breadcrumb={breadcrumb} />
      <BaseBreadcrumb
        breadcrumb={breadcrumb}
        showOnMobile={showOnMobile}
        categories={[]} // unused prop, its OK
        homeIconSize={homeIconSize}
        caretIconSize={caretIconSize}
        homeType={homeType}
        homeLinkText={homeLinkText}
      />
    </>
  )
}

export default SearchBreadcrumb
