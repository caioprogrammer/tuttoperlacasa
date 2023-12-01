import PropTypes from 'prop-types'
import React, {  useState } from 'react'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import { IconMenu, IconMinus, IconPlus } from 'vtex.store-icons'
import { compose } from 'ramda'

import SideBar from './components/SideBar'
import { categoryPropType } from './propTypes'
import getCategories from './queries/categoriesQuery.gql'

import styles from './categoryMenu.css'
import categoryMenuPosition, {
  getMenuPositionNames,
  getMenuPositionValues,
} from './utils/categoryMenuPosition'

/**
 * Component that represents the menu containing the categories of the store
 */
const CategoryMenu = ({
  children,
  subCategoriesLevels = 4,
  SubMenuCloseIcon = IconMinus,
  SubMenuOpenIcon = IconPlus,
  showSubcategories = true,
  MenuTrigger,
  showMenuLabel = false,
  departments = [],
  intl,
  data: { categories = [] },
}) => {
  const [sideBarVisible, setSidebarVisible] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarVisible(prevVisible => !prevVisible)
  }

  const customItems =  children.filter(child => child.props.id.startsWith("category-menu-custom-item"))

  const departmentsIds = departments.map(dept => dept.id)
  const departmentsSelected = categories.filter(category =>
    departmentsIds.includes(category.id)
  )

  const visibleDepartments =
    (departmentsSelected.length && departmentsSelected) || categories


  const lastCustomItems = customItems.filter(item =>
    item.props.blockProps.position === "last" || item.props.blockProps.position == undefined
  )

  return (
    <div className={`${styles.sidebarContainer} ${styles.mobile} ${sideBarVisible ? styles.sidebarContainerVisible : ''}`}>
      <SideBar
        subCategoriesLevels={subCategoriesLevels}
        visible={sideBarVisible}
        SubMenuCloseIcon={SubMenuCloseIcon}
        SubMenuOpenIcon={SubMenuOpenIcon}
        title={intl.formatMessage({
          id: 'store/category-menu.departments.title',
        })}
        lastCustomItems={lastCustomItems}
        customItems={customItems}
        departments={visibleDepartments}
        onClose={handleSidebarToggle}
        showSubcategories={showSubcategories}
      />
      <div className={`flex pa4 pointer ${styles.sidebarTrigger}`}  onClick={handleSidebarToggle}>
        {MenuTrigger ?
          <MenuTrigger/> : (
          <div className="flex flex-column items-center">
            <IconMenu size={20} />
            {
              showMenuLabel &&  <div className={styles.sidebarTriggerLabel}>Menu</div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

CategoryMenu.propTypes = {
  /** Categories query data */
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(categoryPropType),
  }),
  subCategoriesLevels: PropTypes.number,
  clickTrigger: PropTypes.bool,
  mobileModeOpened: PropTypes.bool,
  SubMenuCloseIcon: PropTypes.element,
  SubMenuOpenIcon: PropTypes.element,
  /** Set mobile mode */
  mobileMode: PropTypes.bool,
  /** Whether to show the departments category or not */
  showAllDepartments: PropTypes.bool,
  /** Whether to show subcategories or not */
  showSubcategories: PropTypes.bool,
  /** Defines the position of the category menu */
  menuPosition: PropTypes.oneOf(getMenuPositionValues()),
  /** Intl */
  intl: intlShape,
  /** Departments to be shown in the desktop mode. */
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ),
}

CategoryMenu.schema = {
  title: 'admin/editor.category-menu.title',
  description: 'admin/editor.category-menu.description',
  type: 'object',
  properties: {
    showAllDepartments: {
      type: 'boolean',
      title: 'admin/editor.category-menu.show-departments-category.title',
      default: true,
    },
    menuPosition: {
      title: 'admin/editor.category-menu.disposition-type.title',
      type: 'string',
      enum: getMenuPositionValues(),
      enumNames: getMenuPositionNames(),
      default: categoryMenuPosition.DISPLAY_CENTER.value,
      isLayout: true,
    },
    showSubcategories: {
      type: 'boolean',
      title: 'admin/editor.category-menu.show-subcategories.title',
      default: true,
    },
    subCategoriesLevels: {
      type: 'number',
      title: '',
      default: 4,
    },
    departments: {
      title: 'store/category-menu.departments.title',
      type: 'array',
      minItems: 0,
      items: {
        title: 'admin/editor.category-menu.departments.items.title',
        type: 'object',
        properties: {
          id: {
            title: 'admin/editor.category-menu.departments.items.id',
            type: 'number',
          },
          imgUrl: {
            title: 'admin/editor.category-menu.departments.items.img',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
        },
      },
    },
  },
}

export default compose(
  graphql(getCategories),
  injectIntl
)(CategoryMenu)
