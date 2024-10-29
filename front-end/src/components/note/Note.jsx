import RemoveIcon from '../../assets/remove.svg'
import styles from './Note.module.css'
import { TopBar } from '../top-bar/TopBar'
import { useLoaderData, Form, useSubmit, redirect, useResolvedPath } from 'react-router-dom'
import { useCallback } from 'react'
import { debounce } from '../../utils/debounce'
import RestoreIcon from '../../assets/restore.svg'

const NoteEditor = ({ children }) => <div className={styles['note-editor']}>{children}</div>

export const updateNote = async ({ request, params }) => {
	const data = await request.formData()
	const title = await data.get('title')
	const body = await data.get('body')
	return fetch(`http://localhost:3000/notes/${params.noteId}`, {
		method: 'PATCH',
		body: JSON.stringify({
			title,
			body,
		}),
		headers: {
			'Content-type': 'application/json',
		},
	})
}

export const restoreFromArchive = async ({ request, params }) => {
	const formData = await request.formData()
	const title = formData.get('title')
	const body = formData.get('body')
	const folderId = formData.get('folderId')

	await fetch(`http://localhost:3000/archive/${params.noteId}`, {
		method: 'DELETE',
	})

	return fetch('http://localhost:3000/notes/', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			title,
			body,
			folderId,
		}),
	}).then(() => {
		return redirect(`/notes/${folderId}`)
	})
}

export const deleteFromArchive = ({ params }) => {
	return fetch(`http://localhost:3000/archive/${params.noteId}`, {
		method: 'DELETE',
	}).then(() => {
		return redirect('/archive')
	})
}

export const deleteNote = async ({ request, params }) => {
	const formData = await request.formData()
	const title = formData.get('title')
	const body = formData.get('body')
	const folderId = formData.get('folderId')

	await fetch(`http://localhost:3000/notes/${params.noteId}`, {
		method: 'DELETE',
	})

	return fetch('http://localhost:3000/archive', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			title,
			body,
			folderId,
		}),
	}).then(() => {
		return redirect(`/notes/${params.folderId}`)
	})
}

export function Note() {
	const note = useLoaderData()
	const submit = useSubmit()
	const path = useResolvedPath()

	const onChangeCallback = useCallback(
		debounce(e => {
			const form = e.target.closest('form')
			submit(form, { method: 'PATCH' })
		}, 300),
		[(debounce, submit)]
	)

	return (
		<div className={styles.container}>
			<TopBar>
				{path.pathname == `/archive/${note.id}` && (
					<Form
						onSubmit={e => {
							e.preventDefault()
							const formData = new FormData()
							formData.append('title', note.title)
							formData.append('body', note.body)
							formData.append('folderId', note.folderId)

							console.log(note.folderId)

							submit(formData, {
								method: 'POST',
								action: 'restore',
							})
						}}>
						<button className={styles.button}>
							<img src={RestoreIcon} className={styles.image} />
						</button>
					</Form>
				)}
				<Form
					method='DELETE'
					action='delete'
					onSubmit={e => {
						e.preventDefault()
						const formData = new FormData()
						formData.append('title', note.title)
						formData.append('body', note.body)
						formData.append('folderId', note.folderId)

						submit(formData, {
							method: 'DELETE',
							action: 'delete',
						})
					}}>
					<button className={styles.buttonDel}>
						<img className={styles.image} src={RemoveIcon} />
					</button>
				</Form>
			</TopBar>
			<Form method='PATCH' onChange={onChangeCallback}>
				<NoteEditor key={note.id}>
					<input type='text' defaultValue={note.title} name='title' />
					<textarea name='body' defaultValue={note.body} />
				</NoteEditor>
			</Form>
		</div>
	)
}
