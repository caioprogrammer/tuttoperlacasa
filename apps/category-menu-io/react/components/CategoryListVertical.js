import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SideBarItem from './SideBarItem'
import styles from '../categoryMenu.css'

const OPEN_SIDEBAR_CLASS = styles.sidebarOpen

const CategoryListVertical = ({
  SubMenuCloseIcon,
  SubMenuOpenIcon,
  visible,
  onClose = () => { },
  showSubcategories,
  departments = [],
  subCategoriesLevels,
  lastCustomItems,
  customItems,
}) => {
  useEffect(() => {
    if (visible) {
      document.body.classList.add(OPEN_SIDEBAR_CLASS)

      return () => document.body.classList.remove(OPEN_SIDEBAR_CLASS)
    } else {
      document.body.classList.remove(OPEN_SIDEBAR_CLASS)
    }
  }, [visible])

  const scrimClasses = classNames(
    styles.sidebarScrim,

    'fixed dim bg-base--inverted top-0 z-1 vw-100 vh-100 o-40',

    {
      dn: !visible,
    }
  )

  return (
    <Fragment>
      <ul className={`${styles.sidebarContent} w-100 pb7 list ma0 pa0`}>
        {departments.map((department, index) => {
          const currentCustomItem = customItems?.find(item => item.props.blockProps.position === index)

          return(
          <Fragment key={department.id}>
            {currentCustomItem}
            <li  className={`list ma0 pa0 ${styles.sidebarListItem}`}>
              <SideBarItem
                SubMenuCloseIcon={SubMenuCloseIcon}
                SubMenuOpenIcon={SubMenuOpenIcon}
                subCategoriesLevels={subCategoriesLevels}
                item={department}
                linkValues={[department.slug]}
                onClose={onClose}
                showSubcategories={showSubcategories}
              />
            </li>
          </Fragment>
          )
        })}
        {lastCustomItems}
      </ul>
    </Fragment>
  )
}

CategoryListVertical.propTypes = {
  /** Sidebar's departments. */

  departments: PropTypes.arrayOf(PropTypes.object),

  /** Closes sidebar. */

  onClose: PropTypes.func,

  /** Sidebar's visibility. */

  visible: PropTypes.bool,

  /** Whether to show subcategories or not */

  showSubcategories: PropTypes.bool,

    customItems: PropTypes.arrayOf(PropTypes.element),
  lastCustomItems: PropTypes.arrayOf(PropTypes.element)
}

export default CategoryListVertical
