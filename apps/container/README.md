📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Container

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

Under the app's name, you should explain the topic, giving a **brief description** of its **functionality** in a store when installed.

Next, **add media** (either an image of a GIF) with the rendered components, so that users can better understand how the app works in practice.

![Media Placeholder](https://user-images.githubusercontent.com/52087100/71204177-42ca4f80-227e-11ea-89e6-e92e65370c69.png)

## Configuration

In this section, you first must **add the primary instructions** that will allow users to use the app's blocks in their store, such as:

1. Adding the app as a theme dependency in the `manifest.json` file;

```json
  "dependencies": {
    "{vendor}.container": "0.x"
  }
```

2. Declaring the app's main block in a given theme template or inside another block from the theme.

| Block name              | Description |
| ----------------------- | ----------- |
| `container`             | XXXXX       |
| `container.list-render` | XXXXX       |

### `container` asd `container.list-render` props

| Prop name            | Type      | Description | Default value |
| -------------------- | --------- | ----------- | ------------- |
| `htmlId`             | `string`  | XXXXXXXX    | `undefined`   |
| `renderIfNoChildren` | `boolean` | XXXXXXXX    | `true`        |
| `stopPropagation`    | `boolean` | XXXXXXXX    | `false`       |
| `blockClass`         | `array`   | XXXXXXXX    | `''`          |
| `wrapper`            | `boolean` | XXXXXXXX    | `false`       |
| `containerElement`   | `string`  | XXXXXXXX    | `div`         |

### `container.list-render` props

| Prop name     | Type     | Description                                                          | Default value |
| ------------- | -------- | -------------------------------------------------------------------- | ------------- |
| `itemElement` | `string` | HTML element used to render the items of the list (ex: div, li, etc) | `Fragment`    |

Prop types are:

- `string`
- `enum`
- `number`
- `boolean`
- `object`
- `array`

When documenting a prop whose type is `object` or `array` another prop table will be needed. You can create it following the example below:

- `propName` object:

| Prop name | Type     | Description | Default value |
| --------- | -------- | ----------- | ------------- |
| `XXXXX`   | `XXXXXX` | XXXXXXXX    | `XXXXXX`      |

Remember to also use this Configuration section to **showcase any necessary disclaimer** related to the app and its blocks, such as the different behavior it may display during its configuration.

## Modus Operandi _(not mandatory)_

There are scenarios in which an app can behave differently in a store, according to how it was added to the catalog, for example. It's crucial to go through these **behavioral changes** in this section, allowing users to fully understand the **practical application** of the app in their store.

If you feel compelled to give further details about the app, such as it's **relationship with the VTEX admin**, don't hesitate to use this section.

## Customization

The first thing that should be present in this section is the sentence below, showing users the recipe pertaining to CSS customization in apps:

`In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).`

Thereafter, you should add a single column table with the available CSS handles for the app, like the one below. Note that the Handles must be ordered alphabetically.

| CSS Handles |
| ----------- |
| `container` |
| `listItem`  |
| `wrapper`   |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->

---

Check out some documentation models that are already live:

- [Breadcrumb](https://github.com/vtex-apps/breadcrumb)
- [Image](https://vtex.io/docs/components/general/vtex.store-components/image)
- [Condition Layout](https://vtex.io/docs/components/all/vtex.condition-layout@1.1.6/)
- [Add To Cart Button](https://vtex.io/docs/components/content-blocks/vtex.add-to-cart-button@0.9.0/)
- [Store Form](https://vtex.io/docs/components/all/vtex.store-form@0.3.4/)
