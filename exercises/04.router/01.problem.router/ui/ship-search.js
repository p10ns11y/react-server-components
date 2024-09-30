'use client'

import { Fragment, Suspense, createElement as h } from 'react'

import { useRouter, mergeLocationState } from './router.js'
import { ErrorBoundary } from './error-boundary.js'

export function ShipSearch({ search, results, fallback }) {
	let { navigate, location } = useRouter()
	return h(
		Fragment,
		null,
		h(
			'form',
			{
				onSubmit: (event) => {
					event.preventDefault()
				}
			},
			h('input', {
				placeholder: 'Filter ships...',
				type: 'search',
				defaultValue: search,
				name: 'search',
				autoFocus: true,
				onChange: (event) => {
					let newSearchTerm = event.target.value
					let newLocation = mergeLocationState(location, { search: newSearchTerm })
					navigate(newLocation, { action: 'replace'})
				}
			}),
		),
		h(
			ErrorBoundary,
			{ fallback: ShipResultsErrorFallback },
			h('ul', null, h(Suspense, { fallback }, results)),
		),
	)
}

export function SelectShipLink({ shipId, highlight, children }) {
	let { location } = useRouter()

	// 🦉 the useLinkHandler you'll add in ui/index.js will set up an event handler
	// to listen to clicks to anchor elements and navigate properly.

	let href = mergeLocationState(location, { shipId })
	
	return h('a', {
		children,
		href,
		style: { fontWeight: highlight ? 'bold' : 'normal' },
	})
}

export function ShipResultsErrorFallback() {
	return h(
		'div',
		{ style: { padding: 6, color: '#CD0DD5' } },
		'There was an error retrieving results',
	)
}
