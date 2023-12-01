import React, { useState, useRef, useEffect, Fragment } from 'react'
import { Link } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { categoryItemShape } from '../propTypes'

import ItemContainer from './ItemContainer'
import classNames from 'classnames'
import categoryMenuPosition, {
  getMenuPositionValues,
} from '../utils/categoryMenuPosition'
import captalizeFirstLetter from '../utils/capitalizeFirstLetter'

import styles from '../categoryMenu.css'

/**
 * Component that represents a single category displayed in the menu, also displays
 * the subcategories, if the provided category has them
 */
const DepartmentItem = ({
  allDepartmentList,
  clickTrigger,
  category,
  subcategoryLevels,
  menuPosition,
  category: { name, slug, imgUrl },
  CustomContent,
  noRedirect,
  isCategorySelected,
}) => {
  const [isHover, setHover] = useState(false)
  const itemRef = useRef(null)

  // console.log({CustomContent})

  const handleCloseMenu = () => {
    setHover(false)
  }

  const categoryClasses = classNames(
    styles.departmentLink,
    `${styles.departmentLink}--${name}`,
    `${styles.departmentLink}--${slug}`,
    'w-100 pv5 no-underline t-small outline-0 db tc link truncate bb bw1 c-muted-1',
    {
      'b--transparent': !isHover && !isCategorySelected,
      'b--action-primary pointer': isHover || isCategorySelected,
      mr8: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      ml8: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      mh6: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
      pointer: clickTrigger,
    }
  )

  const containerStyle = {
    top: itemRef.current && itemRef.current.offsetTop + itemRef.current.clientHeight,
    display: isHover ? 'flex' : 'flex',
    visible: isHover ? styles.visible : styles.nonVisible,
    pointerEvents: isHover ? 'all' : 'none',
  }

  return (
    <Fragment>
      <li
        className={`${styles.itemContainer}
                    ${styles['itemContainer--department']}
                    ${styles['itemContainer--department']}--${name}
                    ${styles[`itemContainer--department--${isHover ? 'open' : 'closed'}`]}
                    flex items-center db list`}
        ref={itemRef}
        onClick={clickTrigger ? () => setHover(true) : () => { }}
        onMouseEnter={clickTrigger ? () => { } : () => setHover(true)}
        onMouseLeave={clickTrigger ? () => { } : handleCloseMenu}
      >
        {noRedirect ? (
          <span className={categoryClasses}>{name}</span>
        ) : (
          <Link
            onClick={handleCloseMenu}
            page="store.search#department"
            params={{ department: slug }}
            className={categoryClasses}
          >
            {captalizeFirstLetter(name)}
          </Link>
        )}
        {subcategoryLevels > 0 && category.children.length > 0 && (
          <ItemContainer
            visible={isHover}
            menuPosition={menuPosition}
            containerStyle={containerStyle}
            categories={category.children}
            parentSlug={category.slug}
            imgUrl={imgUrl}
            CustomContent={CustomContent}
            onCloseMenu={handleCloseMenu}
            showSecondLevel={subcategoryLevels === 2}
          />
        )}
      </li>
    </Fragment>
  )
}

DepartmentItem.propTypes = {
  /** Category to be displayed */
  category: categoryItemShape.isRequired,
  /** Set use of Link component */
  noRedirect: PropTypes.bool,
  /** Number of subcategory levels */
  subcategoryLevels: PropTypes.oneOf([0, 1, 2]),
  /** Defines the position of the category menu */
  menuPosition: PropTypes.oneOf(getMenuPositionValues()),
  /** Menu category selection */
  isCategorySelected: PropTypes.bool,
  //** Trigger to open */
  clickTrigger: PropTypes.bool,

  CustomContent: PropTypes.element
}

export default DepartmentItem
