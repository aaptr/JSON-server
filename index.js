const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const postsFilePath = path.join(__dirname, 'posts.json');


const getPostsFromFile = () => {
  const data = fs.readFileSync(postsFilePath, 'utf-8');
  return JSON.parse(data);
};


app.get('/', (req, res) => {
  res.send('Welcome to the REST API!');
});


app.get('/posts', (req, res) => {
  try {
    const posts = getPostsFromFile();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error reading posts data' });
  }
});


app.get('/posts/:id', (req, res) => {
  try {
    const posts = getPostsFromFile();
    const postId = parseInt(req.params.id, 10); // Получаем id из параметров URL
    const post = posts.find(p => p.id === postId);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: `Post with id ${postId} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading posts data' });
  }
});


app.post('/posts', (req, res) => {
  try {
    const posts = getPostsFromFile();
    const newPost = req.body;

    newPost.id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    posts.push(newPost);


    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error writing post data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
