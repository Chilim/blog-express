import posts from '../data/posts';

export default (req, res) => {
    console.log(posts);
    res.render('index', { posts });
};