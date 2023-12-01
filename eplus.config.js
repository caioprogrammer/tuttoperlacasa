const GulpfileIo = require('@pluslab/gulpfile-io/dist/index')

/** @type { GulpfileIo.EplusConfig } */
const config = {
	institutionals: {
		insertLast: [
			{
				id: 'contact',
				title: 'Contato'
			}
		]
	},
	fantasticon: {
		center: true
	},
	type: 'fast',
	open: false,
	colors: {},
	dependencies: {
		breadcrumb: '',
		'buy-together': '',
		'category-menu-io': '',
		'condition-layout': '',
		cookie: '',
		'hover-container': '',
		'image-flip-list': '',
		'list-grid': '',
		'condition-login': '',
		minicart: '',
		'search-result': '',
		'seller-page': '',
		'shipping-simulator': '',
		'specification-table': '',
		'wishlist-selection': '',
		'store-components': '',
		'awesome-newsletter': ''
	}
}

module.exports = config
