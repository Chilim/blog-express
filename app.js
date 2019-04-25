import Express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import Post from './entities/Post';


const app = new Express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));

const posts = [
  new Post('hello', 'how are you?'),
  new Post('nodejs', 'story about nodejs'),
];

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/posts', (req, res) => {
  res.render('posts/index', { posts });
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = posts.filter(post => post.id === +id)[0];
  res.render('posts/show', { post, id });
});

app.get('/posts/new', (req, res) => {
  res.render('posts/new');
});


export default app;

