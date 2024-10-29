import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './App'
import { NotesList } from './components/notes-list/NotesList'
import { Note } from './components/note/Note'
import { createFolder } from './components/folders-list/FoldersList'
import { createNote } from './components/notes-list/NotesList'
import { updateNote } from './components/note/Note'
import { deleteNote } from './components/note/Note'
import { NotFound } from './components/not-found/NotFound'
import { restoreFromArchive } from './components/note/Note'
import { deleteFromArchive } from './components/note/Note'

const router = createBrowserRouter([
	{
		element: <App />,
		path: '/',
		errorElement: <NotFound />,
		action: createFolder,
		shouldRevalidate: ({ formAction }) => {
			if (formAction === '/') {
				return true
			} else {
				return false
			}
		},
		loader: () => {
			return fetch('http://localhost:3000/folders')
		},

		children: [
			{
				path: 'archive',
				element: <NotesList />,
				loader: () => {
					return fetch('http://localhost:3000/archive')
				},
				children: [
					{
						path: ':noteId',
						element: <Note />,
						action: updateNote,
						errorElement: <NotFound />,
						loader: async ({ params }) => {
							const res = await fetch(`http://localhost:3000/archive/${params.noteId}`)

							if (res.status === 404) {
								throw new Error()
							}

							return res.json()
						},
						shouldRevalidate: ({ formAction }) => {
							if (formAction) {
								return false
							} else {
								return true
							}
						},
						children: [
							{
								path: 'restore',
								action: restoreFromArchive,
							},
							{
								path: 'delete',
								action: deleteFromArchive,
							}
						],
					},
				],
			},
			{
				path: '/notes/:folderId',
				element: <NotesList />,
				action: createNote,
				loader: ({ params }) => {
					return fetch(`http://localhost:3000/notes?folderId=${params.folderId}`)
				},
				children: [
					{
						path: 'note/:noteId',
						element: <Note />,
						action: updateNote,
						shouldRevalidate: ({ formAction }) => {
							if (formAction) {
								return false
							} else {
								return true
							}
						},
						errorElement: <NotFound />,
						loader: async ({ params }) => {
							const res = await fetch(`http://localhost:3000/notes/${params.noteId}`)

							if (res.status === 404) {
								throw new Error()
							} else {
								return res
							}
						},
						children: [
							{
								path: 'delete',
								action: deleteNote,
							},
						],
					},
				],
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
