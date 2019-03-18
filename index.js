// implement your API here

const express = require('express');
const db = require('./data/db');

const server = express();

server.use(express.json());

// POST /api/users	Creates a user using the information sent inside the request body.

server.post('/api/users', (req, res) => {
	const user = req.body;
	db
		.insert(user)
		.then((user) => {
			if (user.name && user.bio) {
				res.status(201).json(user);
				console.log('Created User => ', user);
			} else {
				res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
				return;
			}
		})
		.catch((error) => {
			res.status(500).json({ error: 'There was an error while saving the user to the database' });
		});
});

//   GET /api/users	Returns an array of all the user objects contained in the database.

server.get('/api/users', (req, res) => {
	console.log('Users ' + db.find());
	db
		.find()
		.then((user) => {
			console.log('Users => ', user);
			res.json(user);
		})
		.catch((err) => {
			res.status(500).json({ error: 'The users information could not be retrieved.' });
		});
});

//   GET /api/users/:id	Returns the user object with the specified id.

server.get('/api/users/:id', (req, res) => {
	const id = req.params.id;
	db
		.findById(id)
		.then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			res.status(500).json({ error: 'The user information could not be retrieved.' });
		});
});

//   DELETE / api / users /: id	Removes the user with the specified id and returns the deleted user.

server.delete('/api/users/:id', (req, res) => {
	const id = req.params.id;
	db
		.remove(id)
		.then((user) => {
			if (user) {
				console.log('deleting user with id:', id);
				res.json(id);
			} else {
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			}
		})
		.catch((error) => {
			res.status(500).json({ message: "The server can't delete the api." });
		});
});

//   PUT / api / users /: id	Updates the user with the specified id using data from the request body.
//   Returns the modified document, NOT the original.
server.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const updateUser = req.body;
	db
		.update(id, updateUser)
		.then((updated) => {
			if (!id) {
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			}
			if (updateUser.name && updateUser.bio) {
				console.log('updating', updateUser);
				res.status(200).json(updateUser);
			} else {
				res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
				return;
			}
		})
		.catch((error) => {
			res.status(500).json({ error: 'The user information could not be modified.' });
		});
});

server.listen(5000, () => console.log(`Listening on port 5000`));
