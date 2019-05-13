import Post from '../entities/Post';
import posts from '../data/posts';

console.log(posts);

export const postsList = (req, res) => {
  res.render('posts/index', { posts });
};

export const createPostGet = (req, res) => {
  res.render('posts/new', { form: {}, errors: {} });
};

export const createPostPost = (req, res) => {
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
};

export const showPost = (req, res, next) => {
  const post = posts.find(post => post.id === +req.params.id);
  if (post) {
    res.render('posts/show', { post });
  } else {
    next(new NotFoundError());
  }
};

export const editPost = (req, res) => {
  const { id } = req.params;
  const post = posts.find(post => post.id === +id);
  res.render('posts/edit', { post, form: post, errors: {} });
};

export const updatePost = (req, res) => {
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
};

export const deletePost = (req, res) => {
    const { id } = req.params;
    const deletedPost = posts.find(post => post.id === +id);
    posts = posts.filter(post => post.id !== deletedPost.id);
    res.redirect(`/posts/`);
};

