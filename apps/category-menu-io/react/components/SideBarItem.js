import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { useRuntime } from 'vtex.render-runtime'
import { IconMinus, IconPlus } from 'vtex.store-icons'

import styles from '../categoryMenu.css'
import captalizeFirstLetter from '../utils/capitalizeFirstLetter'

const SideBarItem = props => {
  const {
    SubMenuCloseIcon,
    SubMenuOpenIcon,
    treeLevel = 1,
    subCategoriesLevels,
    item: { children },
    showSubcategories,
    onClose,
    linkValues,
    item,
  } = props
  const runtime = useRuntime()
  const [open, setOpen] = useState(false)

  const subCategoriesVisible =
    showSubcategories &&
    children &&
    children.length > 0 &&
    treeLevel < subCategoriesLevels

  const navigateToPage = () => {
    const [department, category, subcategory] = linkValues
    const params = { department }

    if (category) params.category = category.replace(/--/g, '-')
    if (subcategory) params.subcategory = subcategory.replace(/--/g, '-')

    const page = category
      ? subcategory
        ? 'store.search#subcategory'
        : 'store.search#category'
      : 'store.search#department'

    runtime.navigate({
      page,
      params,
      fallbackToWindowLocation: false,
    })
    onClose()
  }

  const handleItemClick = () => {
    if (subCategoriesVisible) {
      setOpen(prevOpen => !prevOpen)
    } else {
      navigateToPage()
    }
  }

  const sideBarContainerClasses = classNames(
    styles.sidebarItemContainer,
    styles[`sidebarItemContainer--${treeLevel}`],
    styles[`sidebarItemContainer--${open ? 'opened' : 'closed'}`],
    'flex justify-between items-center pa5 pointer list ma0'
  )
  const sideBarItemTitleClasses = classNames(
    styles.sidebarItemTitle,
    styles[`sidebarItemTitle--${treeLevel}`], {
    't-body lh-solid': treeLevel === 1,
  })

  const sideBarSpanClasses = classNames(
    treeLevel === 1 ? 'c-on-base' : 'c-muted-3',
    styles.sidebarItemIcon
  )

  const sideBarItemClasses = classNames(`${styles.sidebarItem} list pa0 ma0`, {
    'c-muted-2 t-body pl4': treeLevel > 1,
    'c-on-base': treeLevel === 1,
  })

  return (
    <ul className={sideBarItemClasses}>
      <li className={sideBarContainerClasses} onClick={handleItemClick}>
        <div className={`${styles.sidebarItemWrapper} ${styles[`sidebarItemWrapper--${treeLevel}`]}`}>
          <span className={sideBarItemTitleClasses}>{captalizeFirstLetter(item.name)}</span>
          {subCategoriesVisible && (
            <span className={sideBarSpanClasses}>
              {open ? (
                <SubMenuCloseIcon size={16} />
              ) : (
                <SubMenuOpenIcon size={16} />
              )}
            </span>
          )}
        </div>
      </li>
      {subCategoriesVisible && open && (
        <>
          <li
            className={`pa5 pointer t-body c-muted-2 ma0 list ${styles.sidebarItemSeeAll}`}
            onClick={navigateToPage}
          >
            <FormattedMessage id="store/category-menu.all-category.title">
              {txt => <span className={`pl4 ${styles.sidebarItemSeeAllText}`}>{txt}</span>}
            </FormattedMessage>
          </li>
          {children.map(child => (
            <li key={child.id} className={`list ma0 pa0 ${styles.sidebarListItem} ${styles[`sidebarListItem--${treeLevel}`]}`}>
              <SideBarItem
                SubMenuCloseIcon={SubMenuCloseIcon}
                SubMenuOpenIcon={SubMenuOpenIcon}
                subCategoriesLevels={subCategoriesLevels}
                showSubcategories={showSubcategories}
                item={child}
                linkValues={[...linkValues, child.slug]}
                onClose={onClose}
                treeLevel={treeLevel + 1}
                runtime={runtime}
              />
            </li>
          ))}
        </>
      )}
    </ul>
  )
}

SideBarItem.propTypes = {
  /** Sidebar's item. */
  item: PropTypes.object.isRequired,
  /** Link values to create the redirect. */
  linkValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Closes sidebar. */
  onClose: PropTypes.func.isRequired,
  /** Runtime context. */
  runtime: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  /** Tree level. */
  treeLevel: PropTypes.number,
  /** Whether to show subcategories or not */
  showSubcategories: PropTypes.bool,
}

export default SideBarItem
