import React from 'react'
import { categoryPropType } from '../propTypes'
import classNames from 'classnames'
import { Container } from 'vtex.store-components'

import PropTypes from 'prop-types'
import categoryMenuPosition, { getMenuPositionValues } from '../utils/categoryMenuPosition'


import styles from '../categoryMenu.css'
import DepartmentItem from './DepartmentItem'
import CategoryItem from './CategoryItem'



/**
 * Component responsible dor rendering an array of categories and its respective subcategories
 */

const ItemContainer = (props) => {
  const {
    visible,
    containerStyle,
    categories,
    parentSlug,
    menuPosition,
    onCloseMenu,
    imgUrl,
    CustomContent
  } = props


  const firstLevelLinkClasses = classNames(
    styles.firstLevelLink,
    'c-on-base',
    {
      pr4: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      pl4: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      ph4: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    }
  )

  const activeClass = visible ? 'open' : 'closed'

  return (
    <div
      className={`${styles.itemContainer} ${styles[`itemContainer--${activeClass}`]
        }
        } absolute w-100 left-0`}
      style={{ ...containerStyle, display: 'none' }}
    >
      <div className={styles.subItemsContainerWrapper}>
        <Container
          className={styles.subItemsContainer}
        >
          <ul className={styles.itemList}>
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                category={category}
                parentSlug={parentSlug}
                onCloseMenu={onCloseMenu}
                menuPosition={menuPosition}
              />
            ))}
          </ul>
          {CustomContent ? CustomContent : ''}
          {imgUrl ? (
            <img className={styles.departmentImage} src={imgUrl} alt={`Imagem representando o departamento`} />
          ) : ''}
        </Container>
      </div>
    </div>
  )
}

ItemContainer.propTypes = {
  /** Category to be displayed */
  categories: PropTypes.arrayOf(categoryPropType),
  /** Department slug */
  parentSlug: PropTypes.string,
  /** Close menu callback */
  onCloseMenu: PropTypes.func.isRequired,
  /** Whether to show second level links or not */
  showSecondLevel: PropTypes.bool,
  /** Defines the position of the category menu */
  menuPosition: PropTypes.oneOf(getMenuPositionValues()),
  /** Custom styles to item container */
  containerStyle: PropTypes.object,
}

export default ItemContainer
