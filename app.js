import Express from 'express';
import bodyParser from 'body-parser';
import Post from './entities/Post';
import methodOverride from 'method-override';


const app = new Express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

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

app.get('/posts/new', (req, res) => {
  res.render('posts/new', { form: {}, errors: {} });
});

app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.filter(post => post.id === +id)[0];
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
  res.render('posts/edit', { id });
});

app.patch('/posts/:id', (req, res) => {
  const { title, body } = req.body; 
  const { id } = req.params;
  const post = posts.filter(post => post.id === +id)[0];
  console.log(post);
  post.title = title || post.title;
  post.body = body || post.body;
  res.redirect(`/posts/${id}`);
})

// app.delete('/posts/:id', (req, res) => {
//   const { title, body } = req.body; 
//   const { id } = req.params;
//   const post = posts.filter(post => post.id === +id)[0];
//   console.log(post);
//   post.title = title || post.title;
//   post.body = body || post.body;
//   res.redirect(`/posts/${id}`);
// })

// app.delet('/posts/:id', (req, res) => {
  
// })

export default app;

