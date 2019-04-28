import Express from 'express';
import bodyParser from 'body-parser';
import Post from './entities/Post';
import methodOverride from 'method-override';

const app = new Express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

let posts = [
  new Post('hello', 'how are you?'),
  new Post('nodejs', 'story about nodejs'),
];

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/posts', (req, res) => {
  res.render('posts/index', { posts });
});

app.get('/posts/new', (req, res) => {
  res.render('posts/new', { form: {}, errors: {} });
});

app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find(post => post.id === +id);
  res.render('posts/show', { post });
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

export default app;

