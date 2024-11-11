import styles from './FoldersList.module.css'
import { Folder } from '../folder/Folder'
import { Title } from '../title/Title'
import { TopBar } from '../top-bar/TopBar'
import { AddNewButton } from '../add-new-button/AddNewButton'
import { useLoaderData } from 'react-router-dom'
import { Form, redirect, NavLink } from 'react-router-dom'

const Folders = ({ children }) => <div className={styles['folders-column']}>{children}</div>

const UserCreatedFolders = ({ children }) => (
	<div role='list' className={styles['folders-list']}>
		{children}
	</div>
)

export const createFolder = async args => {
	const data = await args.request.formData()
	const folderName = await data.get('folder-name')
	return fetch('https://note-app-x9sh.onrender.com/folders', {
		method: 'POST',
		body: JSON.stringify({
			name: folderName,
		}),
		headers: {
			'Content-type': 'application/json',
		},
	})
		.then(res => res.json())
		.then(newFolder => {
			return redirect(`/notes/${newFolder.id}`)
		})
}

export function FoldersList() {
	const folders = useLoaderData()

	return (
		<Folders>
			<TopBar>
				<Form method='POST' action='/'>
					<input className={styles['new-folder-input']} type='text' placeholder='Nazwa folderu' name='folder-name' />
					<AddNewButton type='submit'>+</AddNewButton>
				</Form>
			</TopBar>
			<Title>Foldery</Title>
			<UserCreatedFolders>
				{folders.map(folder => (
					<NavLink to={`/notes/${folder.id}`} key={folder.id}>
						{({ isActive }) => {
							return <Folder active={isActive}>{folder.name}</Folder>
						}}
					</NavLink>
				))}
			</UserCreatedFolders>
			<NavLink to='archive'>
				<Folder icon='archive'>Archiwum</Folder>
			</NavLink>
		</Folders>
	)
}

export default FoldersList
