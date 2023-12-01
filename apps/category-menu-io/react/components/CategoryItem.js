import { Link } from 'vtex.render-runtime'
import classNames from 'classnames'

import captalizeFirstLetter from '../utils/capitalizeFirstLetter'

import styles from '../categoryMenu.css'
import { composeP } from 'ramda'

function CategoryItem({ category, parentSlug, onCloseMenu }) {
  const firstLevelLinkClasses = classNames(
    styles.firstLevelLink,
    'c-on-base'
  )

  const getLinkParams = (parentSlug, item) => {
    const params = { department: parentSlug || item.slug }

    if (parentSlug) params.category = item.slug.replace(/--/g, '-')

    return params
  }

  return (
    <li key={category.id} className={styles.itemListContainer}>
      <Link
        onClick={onCloseMenu}
        page={
          parentSlug
            ? 'store.search#category'
            : 'store.search#department'
        }
        className={`${firstLevelLinkClasses} ${styles.itemListLink}`}
        params={getLinkParams(parentSlug, category)}
      >
        {captalizeFirstLetter(category.name)}
      </Link>
      {category.hasChildren && (
        <div className={styles.subCategoryContainer}>
          <ul className={styles.subCategoryList}>
            {category.children.map(child => (
              <CategoryItem
                key={child.id}
                category={child}
                parentSlug={`${parentSlug}/${category.slug}`}
                onCloseMenu={onCloseMenu}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

export default CategoryItem
