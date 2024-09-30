import { Suspense, createElement as h, startTransition, use, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as RSC from 'react-server-dom-esm/client'
import { ErrorBoundary } from './error-boundary.js'
import { shipFallbackSrc } from './img-utils.js'
import {
	RouterContext,
	getGlobalLocation,
	// 💰 you'll need this
	useLinkHandler,
} from './router.js'

function fetchContent(location) {
	return fetch(`/rsc${location}`)
}

function createFromFetch(fetchPromise) {
	return RSC.createFromFetch(fetchPromise, {
		moduleBaseURL: `${window.location.origin}/ui`,
	})
}

const initialLocation = getGlobalLocation()
const initialContentPromise = createFromFetch(fetchContent(initialLocation))

function Root() {
	let [location, setLocation] = useState(initialLocation)
	let [contentPromise, setContentPromise] = useState(initialContentPromise)
	
	// 🐨 this function should accept the nextLocation and an optional options argument
	// that has a replace option which defaults to false (this will be used to
	// determine whether we should call replaceState or pushState)
	function navigate(nextLocation, { action = 'push'} = {}) {
		setLocation(nextLocation)
		let nextContentFetchPromise = fetchContent(nextLocation)
		  .then((response) => {
			if (action === 'replace') {
				window.history.replaceState({}, '', nextLocation)
			} else {
				window.history.pushState({}, '', nextLocation)
			}

			return response
		  })

		let nextContentPromise = createFromFetch(nextContentFetchPromise)
		startTransition(() => {
			setContentPromise(nextContentPromise)
		})
	}

	// 🐨 call useLinkHandler with navigate so all links will navigate when clicked
	useLinkHandler(navigate)

	return h(
		RouterContext,
		{
			value: {
				navigate,
				location,
			},
		},
		use(contentPromise),
	)
}

startTransition(() => {
	createRoot(document.getElementById('root')).render(
		h(
			'div',
			{ className: 'app-wrapper' },
			h(
				ErrorBoundary,
				{
					fallback: h(
						'div',
						{ className: 'app-error' },
						h('p', null, 'Something went wrong!'),
					),
				},
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
		),
	)
})
