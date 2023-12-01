import PropTypes from 'prop-types'
import React, { Fragment, useState, useEffect } from 'react'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import { IconMenu, IconMinus, IconPlus } from 'vtex.store-icons'
import { useRuntime } from 'vtex.render-runtime'
import { compose, path } from 'ramda'
import classNames from 'classnames'
import { Container } from 'vtex.store-components'

import DepartmentItem from './components/DepartmentItem'
import SideBar from './components/SideBar'
import CategoryListVertical from './components/CategoryListVertical'
import { categoryPropType } from './propTypes'
import getCategories from './queries/categoriesQuery.gql'

import styles from './categoryMenu.css'
import categoryMenuPosition, {
  getMenuPositionNames,
  getMenuPositionValues,
} from './utils/categoryMenuPosition'

const DEFAULT_SUBCATEGORIES_LEVELS = 1

/**
 * Component that represents the menu containing the categories of the store
 */
const CategoryMenu = ({
  children,
  clickTrigger = false,
  subCategoriesLevels = 4,
  mobileModeOpened = false,
  mobileMode = false,
  SubMenuCloseIcon = IconMinus,
  SubMenuOpenIcon = IconPlus,
  showAllDepartments = true,
  showSubcategories = true,
  menuPosition = categoryMenuPosition.DISPLAY_CENTER.value,
  departments = [],
  intl,
  data: { categories = [] },
}) => {
  const runtime = useRuntime()
  const [sideBarVisible, setSidebarVisible] = useState(false)


  const handleSidebarToggle = () => {
    setSidebarVisible(prevVisible => !prevVisible)
  }

  const customItems = children.filter(child => child.props.id.startsWith("category-menu-custom-item"))
  const customContents = children.filter(child => child.props.id.startsWith("category-menu-custom-content"))

  const departmentsIds = departments.map(dept => dept.id)
  const departmentsSelected = categories.filter(category =>
    departmentsIds.includes(category.id)
  )

  const visibleDepartments =
    (departmentsSelected.length && departmentsSelected) || categories

  const lastCustomItems = customItems.filter(item =>
    item.props.blockProps.position === "last" || item.props.blockProps.position == undefined
  )

  if (mobileMode) {
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
          departments={visibleDepartments}
          onClose={handleSidebarToggle}
          showSubcategories={showSubcategories}
        />
        <div className="flex pa4 pointer" onClick={handleSidebarToggle}>
          <IconMenu size={20} />
        </div>
      </div>
    )
  }

  if (mobileModeOpened) {
    return (
      <div className={`${styles.sidebarContainer}  w-100  ${styles.mobile}`}>
        <CategoryListVertical
          subCategoriesLevels={subCategoriesLevels}
          visible={sideBarVisible}
          SubMenuCloseIcon={SubMenuCloseIcon}
          SubMenuOpenIcon={SubMenuOpenIcon}
          title={intl.formatMessage({
            id: 'store/category-menu.departments.title',
          })}
          departments={visibleDepartments}
          onClose={handleSidebarToggle}
          showSubcategories={showSubcategories}
          customItems={customItems}
          lastCustomItems={lastCustomItems}
        />
      </div>
    )
  }

  const pathName = path(['route', 'params', 'department'], runtime)

  const department = pathName ? pathName : ''

  const desktopClasses = classNames(
    `${styles.container} w-100 bg-base dn flex-m`,
    {
      'justify-start': menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      'justify-end': menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      'justify-center':
        menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    }
  )



  return (
    <nav className={desktopClasses}>
      <Container
        className={`${styles['section--department']} justify-center flex`}
      >
        <ul
          className={`${styles.departmentList} pa0 list ma0 flex flex-wrap flex-row t-action overflow-hidden h3`}
        >

          {showAllDepartments && (
            <DepartmentItem
              noRedirect
              clickTrigger={clickTrigger}
              menuPosition={menuPosition}
              subcategoryLevels={
                DEFAULT_SUBCATEGORIES_LEVELS + showSubcategories
              }
              category={{
                children: categories,
                name: intl.formatMessage({
                  id: 'store/category-menu.departments.title',
                }),
              }}
              allDepartmentsList
            />

          )}
          {visibleDepartments.map((category, index) => {
            category.imgUrl = departments.find(department => department.id === category.id)?.imgUrl
            category.AditionalContent = departments.find(department => department.id === category.id)?.AditionalContent

            const currentCustomItem = customItems.find(item => item.props.blockProps.position === index)
            const currentCustomContent = customContents.find(item => item.props.blockProps.id === category.id)


            return (
              <Fragment key={category.id}>
                {currentCustomItem}
                <DepartmentItem
                  noRedirect={clickTrigger}
                  clickTrigger={clickTrigger}
                  menuPosition={menuPosition}
                  category={category}
                  CustomContent={currentCustomContent}
                  subcategoryLevels={DEFAULT_SUBCATEGORIES_LEVELS + showSubcategories}
                  isCategorySelected={department === category.slug}
                />
              </Fragment>
            )
          })}
          {lastCustomItems}
        </ul>
      </Container>
    </nav>
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
      imgUrl: PropTypes.string,
      AditionalContent: PropTypes.node
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
