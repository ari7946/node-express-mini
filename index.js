const express = require('express');
const db = require('./data/db');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  console.log('req,res', req, res)
  res.send('Hello World');
});

server.get('/api/users', (req, res) => {
  db
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    })
})

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db
  .findById(id)
  .then(users => {
    console.log('users', users);
    if (users.length == 1) {
      return res.status(200).json(users[0]);
    } else {
      return res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user information could not be retrieved." });
  });
});

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    return res.status(400).json({
      errorMessage: "Please provide name and bio for the user."
    }) 
  }
  db
    .insert({ name, bio })
    .then((newUserId)=> {
      console.log('newUser', newUserId);
      res.status(201).json({
        message: `${name} with id of ${newUserId.id} was added`
      })
    })
    .catch(error => {
      res.json(error);
    })
})

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db
    .remove(id)
    .then(response => {
      console.log('delete response', response)
      if (response === 0) {
        return res.status(404).json(
          { message: "The user with the specified ID does not exist." }
        )
      } else if (response === 1) {
        return res.status(200).json({
          success: "The user was removed from the database"
        })
      }
    })
    .catch(error => {
      console.log('error', error)
      res.status(500).json({
        error: error,
        message: "The user could not be removed"
      })
    })
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(200).json({
      message: 'Both name and bio are needed'
    })
    return;
  }
  db
    .update(id, { name, bio })
    .then(response => {
      if (response == 0) {
        res.status(400).json({
          message: 'Unable to update'
        })
        return;
      }
      db
        .findById(id)
        .then(user => {
          if (user.length === 0) {
            res.status(200).json({
              message: "successfully updated user"
            })
            return;
          }
          res.json(user);
        })
        .catch(error => {
          res.status()
        });
    })
    .catch(error => {
      res.status(500).json({
        error: error,
        message: "something went terribly wrong and the world might end"
      })
      return;
    });
});

server.listen(8000, () => console.log('API running...'));

