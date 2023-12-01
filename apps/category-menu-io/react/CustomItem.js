import React, { Fragment, useRef, useState } from 'react';
import { Container } from 'vtex.store-components'
import { Link } from 'vtex.render-runtime'

import classNames from 'classnames'

import styles from './categoryMenu.css';

function CustomItem({ children, title, link, target, position = "last" }) {
  const [isHover, setHover] = useState(false)

  const activeClass = isHover ? 'open' : 'closed'

  const itemRef = useRef(null)

  const escapedTitle = title.replace(/\s+/g, '-');

  const containerStyle = {
    top: itemRef.current && itemRef.current.offsetTop + itemRef.current.clientHeight,
    display: isHover ? 'flex' : 'flex',
    visible: isHover ? styles.visible : styles.nonVisible,
    pointerEvents: isHover ? 'all' : 'none',
  }

  const categoryClasses = classNames(
    styles.departmentLink,
    `${styles.departmentLink}--${escapedTitle}`,
    'w-100 pv5 no-underline mh6 t-small outline-0 db tc link truncate bb bw1 c-muted-1',
    {
      'b--transparent': !isHover,
      'b--action-primary pointer': isHover
    }
  )

  const handleCloseMenu = () => {
    setHover(false)
  }

  return (
    <Fragment>
      <li
        className={`${styles.itemContainer}
                    ${styles['itemContainer--department']}
                    ${styles['itemContainer']}--custom
                    ${styles['itemContainer--department']}--${escapedTitle}
                    ${styles[`itemContainer--department--${isHover ? 'open' : 'closed'}`]}
                    flex items-center db list`}
        ref={itemRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={handleCloseMenu}
      >
        {!link ? (
          <span className={categoryClasses}>{title}</span>
        ) : (
          <Link
            onClick={handleCloseMenu}
            to={link}
            className={categoryClasses}
            target={target}
          >
            {title}
          </Link>
        )}
        {children.length > 0 && (
          <div
            className={`${styles.itemContainer} ${styles[`itemContainer--${activeClass}`]} absolute w-100 left-0`}
            style={{...containerStyle, display: 'none'}}
          >
            <div className={styles.subItemsContainerWrapper}>
              <Container
                className={styles.subItemsContainer}
              >
                {children}
              </Container>
            </div>
          </div>
        )}
      </li>
    </Fragment>
  );
}

CustomItem.schema = {
  title: "Item customizado",
  description: "Item customizado",
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Titulo',
      default: true,
    },
    position: {
      title: 'Posição do menu',
      anyOf: [
        {
          title: 'Posição absoluta',
          type: 'number',
        },
        {
          title: "Posição relativa",
          type: 'string',
          enum: ['last'],
          enumNames: ['Último']
        }
      ]
    },
    link: {
      title: "Link do menu",
      type: "string",
    },
    target: {
      title: "Target",
      type: "string",
      default: "_blank"
    }
  }
}

export default CustomItem;
