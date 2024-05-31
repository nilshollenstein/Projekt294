document.addEventListener('DOMContentLoaded', () => {
	let loginForm = document.forms.loginForm;
	let logoutForm = document.forms.Logout;
	let statusForm = document.forms.checkStatus;
	loginForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const userMail = document.getElementById('userMail').value;
		const password = document.getElementById('password').value;

		logUserIn(userMail, password);
	});
	logoutForm.addEventListener('submit', (event) => {
		event.preventDefault();

		logout();
	});
});
async function logUserIn(userMail, password) {
	const response = await fetch(`http://127.0.0.1:80/auth/cookie/login`, {
		method: 'POST',
		credentials: 'include',
		headers: new Headers({
			'content-type': 'application/json',
		}),
		body: JSON.stringify({
			email: userMail,
			password: password,
		}),
	});

	let statusP = document.getElementById('statusLogin');
	const responseStatus = await fetch(
		`http://127.0.0.1:80/auth/cookie/status`,
		{
			method: 'GET',
			credentials: 'include',
		}
	);
	let statusData = await responseStatus.json();
	let loginStatus;

	if (statusData.email == userMail) {
		loginStatus = true;
	} else {
		loginStatus = false;
	}
	if (loginStatus) {
		statusP.innerText = 'Login succesful';
	} else {
		statusP.innerText = 'Login failed';
	}
	console.log(response);
	console.log(responseStatus);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
}
async function logout() {
	const response = await fetch(`http://127.0.0.1:80/auth/cookie/logout`, {
		method: 'POST',
		credentials: 'include',
	});
}
