'use strict'
require('events').defaultMaxListeners = 20

const gulp = require('gulp') //Gulp
const sass = require('gulp-sass')(require('sass')) //SASS
const autoprefixer = require('gulp-autoprefixer') //Aplica prefixo de navegadores antigos
const postcss = require('gulp-postcss') //PostCSS
const sortMediaQueries = require('postcss-sort-media-queries') //Unifica todas as @medias da mesma condição em apenas uma
const spawn = require('child_process').spawn
const jsdom = require('jsdom')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const gap = require('gulp-append-prepend')
const fantasticon = require('@pluslab/fantasticon')
const pretty = require('pretty')
const kill = require('tree-kill')
const JSON5 = require('json5')
const rename = require('gulp-rename') // Renomeia arquivos
const replace = require('replace-in-file')
const del = require('del')

const configPath = './eplus/config.json'

const stylesInput = './src/{sass,store}/**/*.scss'
const stylesOutput = './src/styles/css'

const iconsPath = './src/assets/icons'
const iconpackPath = './src/styles/iconpacks/iconpack.svg'

const paths = {
	icons: {
		src: './src/assets/icons',
		fontDest: './src/assets/fonts/fantasticon',
		scssTemplate: './src/sass/icons/icons-template.scss.hbs',
		scssDest: './src/sass/icons/_icons.scss'
	},
	institutionals: {
		input: './eplus/institutionals/**/*.md',
		insertLast: [
			{
				id: 'contact',
				title: 'Contato'
			},
			{
				id: 'international',
				title: 'Worldwide Shipping'
			}
		]
	},
	checkout: {
		styles: {
			src: './src/checkout-ui-custom/*.scss'
		},
		dest: './src/checkout-ui-custom/'
	},
	vtex: {
		manifest: './src/manifest.json'
	}
}

/** @returns {string} */
const removeConsoleColors = (text) =>
	text.replace(
		// eslint-disable-next-line no-control-regex
		/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
		''
	)
gulp.task('check-credentials', (done) => {
	const args = process.argv.filter((arg) => arg.startsWith('-'))
	if (args.includes('--force')) {
		console.log('Skipping credentials check...')
		done()
		return
	}

	const whoami = spawn('vtex', ['whoami'], {
		cwd: 'src',
		shell: true
	})

	whoami.stdout.on('data', (data) => {
		// const args = process.argv.filter((arg) => arg.startsWith('-'))
		// console.log(args)
		const output = removeConsoleColors(data.toString())
		if (output.includes('Not logged in')) {
			done(new Error(data.toString().split(': ')[1]))
			return
		}

		if (output.includes('Logged into')) {
			const account = output.split('Logged into')[1].split(' as ')[0].trim()
			const manifestObj = JSON.parse(
				fs.readFileSync(paths.vtex.manifest, 'utf-8')
			)

			if (manifestObj.vendor !== account) {
				done(
					`The current logged account is '${account}' but this store vendor is '${manifestObj.vendor}'. To skip this verification, use '--force' option.`
				)
				return
			}

			done()
			return
		}
		done('An error has ocurred.')
	})
})

let styleFiles
gulp.task('style-dev', (done) => {
	const processors = [sortMediaQueries, autoprefixer]
	const sassOptions = {
		includePaths: [path.resolve(__dirname, 'src', 'sass', 'base')],
		outputStyle: 'compressed'
	}

	glob(stylesInput, (err, files) => {
		if (err) done(err)
		if (!styleFiles) styleFiles = files
		const parsedFiles = files.reduce((acc, file) => {
			const basename = path.basename(file)
			if (file.includes('/base/') && !file.includes('/resets/')) return acc
			if (!acc[basename]) acc[basename] = [file]
			else acc[basename].push(file)
			return acc
		}, {})

		const set = new Set(files.map((file) => path.parse(file).base))
		const cachedSet = new Set(styleFiles.map((file) => path.parse(file).base))
		if (set.size < cachedSet.size) {
			const difference = Array.from(cachedSet).filter(
				(x) => !Array.from(set).includes(x)
			)
			difference.forEach((styleToRemove) => {
				try {
					fs.unlinkSync(
						path.resolve(
							__dirname,
							'src',
							'styles',
							'css',
							styleToRemove.replace('.scss', '.css')
						)
					)
				} catch {
					// Do nothing
				}
			})
		}
		if (set.size !== cachedSet.size) styleFiles = files

		const filesToProcess = Object.keys(parsedFiles)
		let filesProcessedCounter = 0
		filesToProcess.forEach((key) => {
			parsedFiles[key].forEach((item, i) => {
				// Puts resets on first
				if (item.includes('base/resets/')) {
					parsedFiles[key].splice(i, 1)
					parsedFiles[key].unshift(item)
				}
			})
			// console.log(key, parsedFiles[key])
			const source = gulp
				.src(parsedFiles[key].shift())
				.pipe(gap.prependText(`@import '_index';\n`))

			parsedFiles[key].forEach((item) => source.pipe(gap.appendFile(item)))
			source
				.pipe(
					sass(sassOptions).on('error', (err) => {
						console.log(err.formatted)
						done(err)
					})
				)
				.pipe(postcss(processors))
				.pipe(gulp.dest(stylesOutput))
				.on('finish', () => {
					filesProcessedCounter++
					filesProcessedCounter === filesToProcess.length && done()
				})
		})
	})
})

let restart
let linkPid
gulp.task('link', (gulpDone) => {
	const done = () => {
		gulpDone()
		if (!restart) exit()
		else restart = false
	}

	const link = spawn('vtex', ['link'], {
		cwd: 'src',
		stdio: 'inherit',
		shell: true
	}).on('close', done)
	linkPid = link.pid
})

gulp.task('link-build', (done) => {
	const link = spawn('vtex', ['link'], {
		cwd: 'src',
		shell: true
	})
	const timeoutFunc = () => {
		kill(link.pid)
		done(new Error('Timed out. Probably VTEX returned an error.'))
	}
	const timeoutMs = 40000
	let timeoutHandle = setTimeout(timeoutFunc, timeoutMs)

	link.stdout.on('data', (data) => {
		clearTimeout(timeoutHandle)
		timeoutHandle = setTimeout(timeoutFunc, timeoutMs)
		if (data.toString().includes('Store live at')) {
			console.log(data.toString().trim())
			done()
			kill(link.pid)
		}
	})
})

let colorsCache
let checkoutColorsCache
let vtexColorsCache
let firstTimeColors = true
gulp.task('colors', async (done) => {
	const sassVarsPath = path.resolve(
		__dirname,
		'src',
		'sass',
		'base',
		'_variables.scss'
	)
	const vtexStylePath = path.resolve(
		__dirname,
		'src',
		'styles',
		'configs',
		'style.json'
	)
	const checkout6Path = path.resolve(
		__dirname,
		'src',
		'checkout-ui-custom',
		'checkout6-custom.css'
	)
	const checkoutConfirmationPath = path.resolve(
		__dirname,
		'src',
		'checkout-ui-custom',
		'checkout-confirmation-custom.css'
	)
	const configObj = JSON.parse(
		fs.readFileSync(path.resolve(__dirname, 'eplus', 'config.json'), 'utf-8')
	)
	let sassVars = fs.readFileSync(sassVarsPath, 'utf-8')
	let vtexStyleObj = JSON.parse(fs.readFileSync(vtexStylePath, 'utf-8'))

	let checkoutConfirmation = fs.readFileSync(checkoutConfirmationPath, 'utf-8')
	let checkout6 = fs.readFileSync(checkout6Path, 'utf-8')

	// Sass
	Object.entries(configObj.colors).forEach(([key, value]) => {
		sassVars = sassVars.replace(
			new RegExp(`(${key})[:](.*?)[;]`),
			`$1: ${value};`
		)
	})

	// Checkout
	Object.entries(configObj.checkoutVars).forEach(([key, value]) => {
		checkoutConfirmation = checkoutConfirmation.replace(
			new RegExp(`(${key})[:](.*?)[;]`),
			`$1: ${value};`
		)
		checkout6 = checkout6.replace(
			new RegExp(`(${key})[:](.*?)[;]`),
			`$1: ${value};`
		)
	})

	// VTEX style.json
	Object.keys(vtexStyleObj.semanticColors).forEach((key) => {
		vtexStyleObj.semanticColors[key] = key.includes('hover')
			? configObj.vtexHoverColors
			: configObj.vtexColors
	})
	if (
		firstTimeColors ||
		JSON.stringify(colorsCache) !== JSON.stringify(configObj.colors)
	) {
		fs.writeFileSync(sassVarsPath, sassVars)
		colorsCache = configObj.colors
	}
	if (
		firstTimeColors ||
		JSON.stringify(vtexColorsCache) !==
			JSON.stringify({
				vtexHoverColors: configObj.vtexHoverColors,
				vtexColors: configObj.vtexColors
			})
	) {
		fs.writeFileSync(vtexStylePath, JSON.stringify(vtexStyleObj, null, 2))
		vtexColorsCache = {
			vtexHoverColors: configObj.vtexHoverColors,
			vtexColors: configObj.vtexColors
		}
	}
	if (
		firstTimeColors ||
		JSON.stringify(checkoutColorsCache) !==
			JSON.stringify(configObj.checkoutVars)
	) {
		fs.writeFileSync(checkout6Path, checkout6)
		fs.writeFileSync(checkoutConfirmationPath, checkoutConfirmation)
		checkoutColorsCache = configObj.checkoutVars
	}
	if (firstTimeColors) firstTimeColors = false
})

function capitalizeTheFirstLetterOfEachWord(words) {
	const separateWord = words.toLowerCase().split(' ')
	for (let i = 0; i < separateWord.length; i++) {
		separateWord[i] =
			separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
	}
	return separateWord.join(' ')
}
let institutionalsFistTime = true
gulp.task('institutionals', async (done) => {
	// const shouldCache = Object.entries(institutionalsCache).length === 0

	const controlsPath = path.resolve(
		__dirname,
		'src',
		'store',
		'blocks',
		'institutional',
		'controls.jsonc'
	)
	const controlsObj = JSON5.parse(fs.readFileSync(controlsPath, 'utf-8'))
	controlsObj['flex-layout.col#menu-institucional'].children = []
	controlsObj['disclosure-content#institucional'].children = []

	const files = glob.sync(paths.institutionals.input)
	let changes = false
	files.forEach((file) => {
		const mdContent = fs.readFileSync(file, 'utf-8')
		const nameArr = path.parse(file).name.split('-')
		!!Number(nameArr[0]) && nameArr.shift()
		const id = nameArr.join('-')
		const title = mdContent.split('\n')[0].replace('# ', '').trim() ?? id
		const parsedTitle = capitalizeTheFirstLetterOfEachWord(title)
		const text = mdContent
			.replace(new RegExp('\r\n', 'g'), '\\n')
			.replace(new RegExp('\n', 'g'), '\\n')
			.replace(new RegExp('"', 'g'), '\\"')
		const vars = {
			title: parsedTitle,
			id,
			text
		}
		const outputPath = path.resolve(
			__dirname,
			'src',
			'store',
			'blocks',
			'institutional',
			`${vars.id}.jsonc`
		)
		// shouldCache && (institutionalsCache[vars.id] = vars.text)

		const sassReplacePath = path.resolve(
			__dirname,
			'src',
			'store',
			'blocks',
			'institutional',
			'styles',
			'vtex.store-link.scss'
		)

		const replaceOptions = {
			files: sassReplacePath,
			from: /\.var--institucional-class,/g,
			to: `.var--institucional-class,\n:global(.vtex-flex-layout-0-x-flexRow--${id})\n.link--institucional-links.link--${id},`
		}

		if (
			!fs
				.readFileSync(sassReplacePath, 'utf-8')
				.includes(`:global(.vtex-flex-layout-0-x-flexRow--${id})`)
		) {
			try {
				replace.sync(replaceOptions)
			} catch (error) {
				console.error('Error occurred:', error)
			}
		}

		controlsObj[`link#inst-${id}`] = {
			props: {
				label: parsedTitle,
				href: `/institucional/${id}`,
				blockClass: ['institucional-links', id]
			}
		}
		controlsObj['flex-layout.col#menu-institucional'].children.push(
			`link#inst-${id}`
		)
		controlsObj['disclosure-content#institucional'].children.push(
			`link#inst-${id}`
		)

		if (
			fs.existsSync(outputPath) &&
			JSON5.parse(fs.readFileSync(outputPath, 'utf-8'))[
				`rich-text#${vars.id}-content`
			].props.text === mdContent
		)
			return
		changes = true

		const templatePath = path.resolve(
			__dirname,
			'eplus',
			'institutionals',
			'template.jsonc'
		)
		let templateContent = fs.readFileSync(templatePath, 'utf-8')
		Object.entries(vars).forEach(
			([key, value]) =>
				(templateContent = templateContent.replace(
					new RegExp(`var--${key}`, 'g'),
					value
				))
		)

		// institutionalsCache[vars.id] = vars.text
		fs.writeFileSync(outputPath, templateContent)
	})
	const routesPath = path.resolve(__dirname, 'src', 'store', 'routes.json')
	let routesObj
	try {
		routesObj = JSON5.parse(fs.readFileSync(routesPath, 'utf-8'))
	} catch {
		routesObj = {}
	}
	if (
		Object.values(routesObj).filter(
			(obj) =>
				obj.path.includes('institucional') || obj.path.includes('institutional')
		).length !==
		files.length + paths.institutionals.insertLast.length
	) {
		const newRoutes = files.reduce((acc, file) => {
			const nameArr = path.parse(file).name.split('-')
			!!Number(nameArr[0]) && nameArr.shift()
			const id = nameArr.join('-')
			const mdContent = fs.readFileSync(file, 'utf-8')
			const title = mdContent.split('\n')[0].replace('# ', '').trim() ?? id
			const parsedTitle = capitalizeTheFirstLetterOfEachWord(title)
			acc[`store.custom#${id}`] = {
				path: `/institucional/${id}`,
				title: `${parsedTitle} - Tutto Per La Casa`
			}
			return acc
		}, {})
		paths.institutionals.insertLast.forEach((page) => {
			newRoutes[`store.custom#${page.id}`] = {
				path: `/institucional/${page.id}`,
				title: `${page.title} - Tutto Per La Casa`
			}
		})

		// Parse non-institutional custom routes
		Object.entries(routesObj).forEach(([key, obj]) => {
			if (
				!obj.path.includes('institucional') &&
				!obj.path.includes('institutional')
			) {
				newRoutes[key] = obj
			}
		})

		fs.writeFile(routesPath, JSON.stringify(newRoutes, null, 2), {}, () => {
			if (linkPid) {
				restart = true
				kill(linkPid, gulp.series('link'))
			}
		})
	}
	paths.institutionals.insertLast.forEach((page) => {
		controlsObj[`link#inst-${page.id}`] = {
			props: {
				label: page.title,
				href: `/institucional/${page.id}`,
				blockClass: ['institucional-links', page.id]
			}
		}
		controlsObj['flex-layout.col#menu-institucional'].children.push(
			`link#inst-${page.id}`
		)
		controlsObj['disclosure-content#institucional'].children.push(
			`link#inst-${page.id}`
		)
	})
	;(institutionalsFistTime || changes) &&
		fs.writeFileSync(controlsPath, JSON.stringify(controlsObj, null, 2))
	institutionalsFistTime = false
})

const watchDev = (gulpDone) => {
	doneParser(gulpDone)
	gulp.watch(stylesInput, gulp.series('style-dev'))
	gulp.watch(iconsPath, gulp.parallel('icons-to-font', 'icons-to-pack'))
	gulp.watch(configPath, gulp.series('colors'))
	gulp.watch(paths.institutionals.input, gulp.series('institutionals'))
	gulp.watch(paths.checkout.styles.src, gulp.series('checkout-style'))
}

gulp.task('pack-to-icons', (done) => {
	const iconpackFile = fs.readFileSync(iconpackPath)
	const jsdomDoc = new jsdom.JSDOM(iconpackFile)
	const $groups =
		jsdomDoc.window.document.body.querySelectorAll('svg > defs > g')

	try {
		fs.mkdirSync('./src/assets/icons')
	} catch (err) {
		// already exists
	}

	$groups.forEach(($svg) => {
		if ($svg.children.length === 1) {
			const child = $svg.children.item(0)
			if (child.tagName.toLowerCase() === 'svg') {
				child.removeAttribute('width')
				child.removeAttribute('height')
			}
		}
		const output = pretty($svg.outerHTML)

		fs.writeFileSync(`./src/assets/icons/${$svg.id}.svg`, output)
	})

	done()
})

/** @param { HTMLElement } $element */
function checkIfSvgIsMulticolor($element) {
	const attribsToSearch = ['fill', 'stroke']
	const colors = new Set()
	checkElementChildren($element)

	/** @param { HTMLElement } $element */
	function checkElementChildren($element) {
		;[...$element.children].forEach(($child) => {
			attribsToSearch.forEach((attrib) => {
				const attr = $child.getAttribute(attrib)
				if (attr && attr !== 'none') {
					if (attr.toLowerCase() !== 'currentcolor') {
						colors.add(attr)
					}
				}
			})
			if ($child.children.length > 0) {
				checkElementChildren($child)
			}
		})
	}

	return Array.from(colors).length > 1
}

/** @param { HTMLElement } $element */
function fillAndStrokeToCurrentColor($element) {
	const attribsToSearch = ['fill', 'stroke']

	;[...$element.children].forEach(($child) => {
		attribsToSearch.forEach((attrib) => {
			const attr = $child.getAttribute(attrib)
			if (attr && attr !== 'none') {
				$child.setAttribute(attrib, 'currentColor')
			}
		})
		if ($child.children.length > 0) {
			fillAndStrokeToCurrentColor($child)
		}
	})
}

gulp.task('icons-to-pack', (done) => {
	const jsdomDoc =
		new jsdom.JSDOM(`<svg class='dn' height='0' version='1.1' width='0'
  xmlns='http://www.w3.org/2000/svg'>
  <defs></defs>
	</svg>`)
	const document = jsdomDoc.window.document
	const $parent = document.body.querySelector('svg')
	fs.readdirSync('./src/assets/icons').forEach((file) => {
		if (!file.endsWith('.svg')) return
		const svgFileContent = fs
			.readFileSync(`./src/assets/icons/${file}`, 'utf8')
			.replace(/(\r\n|\n|\r)/gm, '')
		const jsdomDocSvg = new jsdom.JSDOM(svgFileContent)

		const $svg = jsdomDocSvg.window.document.body.children.item(0)

		if (!checkIfSvgIsMulticolor($svg)) {
			fillAndStrokeToCurrentColor($svg)
		}

		$svg.id = path.parse(file).name
		$svg.removeAttribute('width')
		$svg.removeAttribute('height')

		if ($svg.tagName.toLowerCase() === 'g') {
			$parent.firstElementChild.appendChild($svg)
		} else {
			const $g = document.createElement('g')
			$g.innerHTML = $svg.outerHTML
			$g.id = path.parse(file).name
			$parent.firstElementChild.appendChild($g)
		}
	})
	const output = pretty($parent.outerHTML, { ocd: true })
	fs.writeFileSync('./src/styles/iconpacks/iconpack.svg', output)
	done()
})

function makeid(length) {
	let result = ''

	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	const charactersLength = characters.length

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result
}

gulp.task('icons-to-font', async function (done) {
	const { generateFonts, FontAssetType, OtherAssetType } = fantasticon

	const HASH = makeid(10)

	del('./src/assets/fonts/fantasticon/*')

	try {
		await generateFonts({
			name: `fantasticon_${HASH}`,
			inputDir: paths.icons.src,
			outputDir: paths.icons.fontDest,
			fontsUrl: 'assets/fonts/fantasticon',
			pathOptions: {
				scss: paths.icons.scssDest
			},
			normalize: true,
			center: true,
			fontTypes: [FontAssetType.WOFF2, FontAssetType.WOFF, FontAssetType.TTF],
			assetTypes: [OtherAssetType.SCSS],
			fontHeight: 300,
			descent: 45,
			templates: {
				scss: paths.icons.scssTemplate
			}
		})

		// Gerar arquivo
		const fileContent = `/**/
		/* Fantasticon */
		@font-face {
			font-family: 'fantasticon';
			src: local(''),
				url('assets/fonts/fantasticon/fantasticon_${HASH}.woff2') format('woff2'),
				url('assets/fonts/fantasticon/fantasticon_${HASH}.woff') format('woff'),
				url('assets/fonts/fantasticon/fantasticon_${HASH}.ttf') format('truetype');
		}`
		fs.writeFileSync('./src/styles/configs/fantasticon.scss', fileContent)

		compileFontFaces()
	} catch (error) {
		done(error)
	}
})

function compileFontFaces(done) {
	return gulp
		.src('./src/styles/configs/font-faces.scss', { base: './' })
		.pipe(sass())
		.pipe(gulp.dest('.'))
}

gulp.task('checkout-style', function (done) {
	const processors = [sortMediaQueries, autoprefixer]

	const sassOptions = {
		outputStyle: 'expanded'
	}

	return (
		gulp
			.src(paths.checkout.styles.src)
			// .pipe(sourcemaps.init())
			.pipe(sass(sassOptions).on('error', done))
			.pipe(
				rename((path) => ({
					...path,
					basename: `${path.basename}`
				}))
			)
			.pipe(postcss(processors))
			// .pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.checkout.dest))
	)
})

const tasksDone = []
const doneParser = (gulpDone) => {
	tasksDone.push(gulpDone)
	return (error) => {
		tasksDone.splice(index, tasksDone.indexOf(gulpDone))
		gulpDone(error)
	}
}
const exit = () => {
	tasksDone.forEach((done) => done())
	process.exit()
}

gulp.task(
	'dev',
	gulp.parallel(
		gulp.series(
			'check-credentials',
			'icons-to-font',
			'style-dev',
			'icons-to-pack',
			'institutionals',
			'checkout-style',
			'link'
		),
		watchDev
	)
)

gulp.task(
	'build',
	gulp.series(
		'check-credentials',
		'icons-to-font',
		'colors',
		'institutionals',
		'style-dev',
		'icons-to-pack',
		'link-build'
	)
)
