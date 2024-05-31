document.addEventListener('DOMContentLoaded', () => {
	const formAllChores = document.forms.formAllTasks;
	formAllChores.addEventListener('submit', (event) => {
		event.preventDefault();
		getAllTasks();
	});
	const singleChore = document.forms.selectSingleChore;
	singleChore.addEventListener('submit', (event) => {
		event.preventDefault();
		let id = document.getElementById('singleChore').value;
		getSpecificTask(id);
	});
	const editForm = document.forms.editForm;
	editForm.addEventListener('submit', (event) => {
		event.preventDefault();
		let newText = document.getElementById('editChore').value;
		editChore(newText);
	});
	const formNewChore = document.forms.AddNewChore;
	formNewChore.addEventListener('submit', (event) => {
		event.preventDefault();

		addNewChore(chore);
	});
	const formDeleteChore = document.forms.formDeleteChore;
	formDeleteChore.addEventListener('submit', (event) => {
		event.preventDefault();
		const id = document.getElementById('deleteChore').value;
		deleteChore(id);
	});
});

async function getAllTasks() {
	try {
		const response = await fetch('http://localhost:80/tasks', {
			method: 'GET',
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		addDataToTable(data);
	} catch (error) {
		console.error(error);
	}
}
async function getSpecificTask(id) {
	try {
		const response = await fetch(`http://localhost:80/task/${id}`, {
			method: 'GET',
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const specificChore = await response.json();
		if (specificChore) {
			addDataToTable(specificChore);
		} else {
			alert('No chore with this ID');
		}
	} catch (error) {
		console.error(error);
	}
}
async function addNewChore(chore) {
	try {
		const responseData = await fetch('http://localhost:80/tasks', {
			method: 'GET',
		});
		if (!responseData.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await responseData.json();
		const lastID = data[data.length - 1].id;
		let id = lastID + 1;
		const response = await fetch('http://localhost:80/tasks', {
			method: 'POST',
			headers: new Headers({
				'content-type': 'application/json',
			}),
			body: JSON.stringify({
				id: id,
				completed: false,
				title: chore,
			}),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
}
function addDataToTable(data) {
	let tableBody = document.querySelector('#allChores tbody');
	tableBody.innerHTML = ''; // Clear existing table rows
	if (Array.isArray(data)) {
		data.forEach((element) => {
			let row = tableBody.insertRow();
			let idCell = row.insertCell(0);
			let taskCell = row.insertCell(1);
			let completedCell = row.insertCell(2);

			idCell.textContent = element.id;
			taskCell.textContent = element.title;
			completedCell.textContent = element.completed;
		});
	} else {
		let row = tableBody.insertRow();
		let idCell = row.insertCell(0);
		let taskCell = row.insertCell(1);
		let completedCell = row.insertCell(2);

		idCell.textContent = data.id;
		taskCell.textContent = data.title;
		completedCell.textContent = data.completed;
	}
}
function setEditPartsVisible() {
	let allEditParts = document.getElementsByClassName('edit');
	for (let i = 0; i < allEditParts.length; i++) {
		allEditParts[i].classList.toggle('hidden');
	}
}
function editChore(newTitle) {
	let id = document.getElementById('singleChore').value;
	changeTask(newTitle, id);
}

async function getSpecificTaskForEdit(id) {
	try {
		const response = await fetch(`http://localhost:80/task/${id}`, {
			method: 'GET',
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}
async function changeTask(newTitle, id) {
	const response = await fetch('http://localhost:80/tasks', {
		method: 'PUT',
		headers: new Headers({
			'content-type': 'application/json',
		}),
		body: JSON.stringify({
			id: id,
			completed: false,
			title: newTitle,
		}),
	});
	getSpecificTask(id);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	let allEditParts = document.getElementsByClassName('edit');
	for (let i = 0; i < allEditParts.length; i++) {
		allEditParts[i].classList.toggle('hidden');
	}
}
async function deleteChore(id) {
	const response = await fetch(`http://localhost:80/task/${id}`, {
		method: 'DELETE',
		headers: new Headers({
			'content-type': 'application/json',
		}),
		body: JSON.stringify({
			id: id,
		}),
	});
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	alert(`Chore with the ID ${id} was deleted`);
}
