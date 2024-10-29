import styles from './NotesList.module.css'
import { Title } from '../title/Title'
import { AddNewButton } from '../add-new-button/AddNewButton'
import { TopBar } from '../top-bar/TopBar'
import { ShortNote } from '../short-note/ShortNote'
import { useLoaderData, NavLink, Outlet, Form, redirect, useResolvedPath } from 'react-router-dom'

const NotesContainer = ({ children }) => <div className={styles['notes-container']}>{children}</div>

const Notes = ({ children }) => (
	<div className={styles['notes-list']} role='list'>
		{children}
	</div>
)

export const createNote = ({ params }) => {
	return fetch('http://localhost:3000/notes', {
		method: 'POST',
		body: JSON.stringify({
			title: 'Nowa notatka',
			body: 'Wpisz treść notatki',
			folderId: params.folderId,
		}),
		headers: {
			'Content-type': 'application/json',
		},
	})
		.then(res => res.json())
		.then(newNote => {
			console.log(newNote)
			return redirect(`/notes/${newNote.folderId}/note/${newNote.id}`)
		})
}

export function NotesList() {
	const notes = useLoaderData()
	const location = useResolvedPath()

	return (
		<NotesContainer>
			<Notes>
				<TopBar>
					<Title>Notatki</Title>
					<Form method='POST'>
						<AddNewButton>+</AddNewButton>
					</Form>
				</TopBar>

				{notes.map(note => (
					<NavLink
						key={note.id}
						to={location.pathname.includes("archive") ? `/archive/${note.id}` : `/notes/${note.folderId}/note/${note.id}`
						}>
						{({ isActive }) => <ShortNote active={isActive} role='listitem' note={note}></ShortNote>}
					</NavLink>
				))}
			</Notes>
			<Outlet />
		</NotesContainer>
	)
}
