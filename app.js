import Express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import Post from './entities/Post';
import methodOverride from 'method-override';
import NotFoundError from './errors/NotFoundError';

import encrypt from './encrypt';
import User from './entities/User';
import Guest from './entities/Guest';

const app = new Express();
app.set('view engine', 'pug');
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
}));

const users = [new User('admin', encrypt('qwerty'))];
let posts = [
  new Post('hello', 'how are you?'),
  new Post('nodejs', 'story about nodejs'),
];

app.use((req, res, next) => {
  if (req.session && req.session.nickname) {
    const { nickname } = req.session;
    res.locals.currentUser = users.find(user => user.nickname === nickname);
  } else {
    res.locals.currentUser = new Guest();
  }
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

// Authentication

app.get('/users/new', (req, res) => {
  res.render('users/new', { errors: {}, form: {}});
});

app.post('/users/', (req, res) => {
  const { nickname, password } = req.body;
  console.log(nickname, password);
});

// Posts

app.get('/posts', (req, res) => {
  res.render('posts/index', { posts });
});

app.get('/posts/new', (req, res) => {
  res.render('posts/new', { form: {}, errors: {} });
});

app.get('/posts/:id', (req, res, next) => {
  const post = posts.find(post => post.id === +req.params.id);
  if (post) {
    res.render('posts/show', { post });
  } else {
    next(new NotFoundError());
  }
  
});

app.post('/posts', (req, res) => {
  const { title, body } = req.body;

  const errors = {};
  if (!title) {
    errors.title = "Title can't be blank";
  }

  if (!body) {
    errors.body = "Body can't be blank";
  }

  if (Object.keys(errors).length === 0) {
    const post = new Post(title, body);
    posts.push(post);
    res.redirect(`/posts/${post.id}`);
    return;
  }
  res.status(422);
  res.render('posts/new', { form: req.body, errors });
});

app.get('/posts/:id/edit', (req, res) => {
  const { id } = req.params;
  const post = posts.find(post => post.id === +id);
  res.render('posts/edit', { post, form: post, errors: {} });
});

app.patch('/posts/:id', (req, res) => {
  const { title, body } = req.body; 
  const { id } = req.params;
  const post = posts.find(post => post.id === +id);
  const errors = {};
  if (!title) {
    errors.title = "Can't be blank";
  }

  if (!body) {
    errors.body = "Can't be blank";
  }

  if (Object.keys(errors).length === 0) {
    post.title = title;
    post.body = body;
    res.redirect(`/posts/${post.id}/`);
    return;
  }
  
  res.status(422);
  res.render('posts/edit', { post, form: req.body, errors });
})

app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const deletedPost = posts.find(post => post.id === +id);
  posts = posts.filter(post => post.id !== deletedPost.id);
  res.redirect(`/posts/`);
});

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status);
  switch (err.status) {
    case 404:
      res.render(err.status.toString());
      break;
    default:
      throw new Error('Unexpected error');
  }
});

export default app;

