import Express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import Post from './entities/Post';
import methodOverride from 'method-override';
import NotFoundError from './errors/NotFoundError';
import { checkUserType, registerUserGet, registerUserPost, getAuth, postAuth, deleteSession } from './controllers/users';
import { postsList, createPostGet, createPostPost, showPost, editPost, updatePost, deletePost } from './controllers/posts';
import home from './controllers/index';

const app = new Express();


app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: false, }));
app.use(checkUserType);

app.get('/', home);

// Authentifaction
app.get('/users/new', registerUserGet);
app.post('/users', registerUserPost);
app.get('/session/new', getAuth);
app.post('/session', postAuth);
app.delete('/session', deleteSession);

// Posts

app.get('/posts', postsList);
app.get('/posts/new', createPostGet);
app.post('/posts', createPostPost);
app.get('/posts/:id', showPost);
app.get('/posts/:id/edit', editPost);
app.patch('/posts/:id', updatePost);
app.delete('/posts/:id', deletePost);

export default app;

