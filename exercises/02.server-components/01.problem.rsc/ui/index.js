import { Suspense, createElement as h, startTransition, use } from 'react'
import { createRoot } from 'react-dom/client'
// 💣 App is now an RSC! We don't want to import it here. We'll get it's
// rendered result as data in a fetch request instead. Delete this import:
// import { App } from './app.js'
// 💰 you're going to want this:
import { createFromFetch } from 'react-server-dom-esm/client'
import { shipFallbackSrc } from './img-utils.js'

const getGlobalLocation = () =>
	window.location.pathname + window.location.search

const initialLocation = getGlobalLocation()
// 🐨 rename initialDataPromise to something more accurate
// (💰 like initialContentFetchPromise)
// 🐨 also replace /api with /rsc
const initialContentFetchPromise = fetch(`/rsc${initialLocation}`)


const initialContentPromise = createFromFetch(initialContentFetchPromise)

function Root() {
	// 💣 we no longer request data or render the App component, delete these lines:
	// return h(App, { shipId, search, ship, shipResults })
	// 🐨 create a variable called content set to use(initialContentPromise)
	const content = use(initialContentPromise)

	// 💯 as a bonus, go ahead and console.log the content variable and check it out in the dev tools!
	// 🐨 return the content
	console.log(content)
	return content
}

startTransition(() => {
	createRoot(document.getElementById('root')).render(
		h(
			'div',
			{ className: 'app-wrapper' },
			h(
				Suspense,
				{
					fallback: h('img', {
						style: { maxWidth: 400 },
						src: shipFallbackSrc,
					}),
				},
				h(Root),
			),
		),
	)
})
