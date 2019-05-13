import users from '../data/users';
import User from '../entities/User';
import Guest from '../entities/Guest';
import encrypt from '../encrypt';


export const checkUserType = (req, res, next) => {
    if (req.session && req.session.nickname) {
        const { nickname } = req.session;
        res.locals.currentUser = users.find(user => user.nickname === nickname);
    } else {
        res.locals.currentUser = new Guest();
    }
    next();
};

export const registerUserGet = (req, res) => {
    res.render('users/new', { errors: {}, form: {} });
};

export const registerUserPost = (req, res) => {
    const { nickname, password } = req.body;
    const errors = {};
    if (!nickname) {
        errors.nickname = 'Can\'t be blank';
    } else {
        const isUniq = users.some(user => user.nickname === nickname);
        if (!!isUniq) {
        errors.nickname = 'Already exist';
        }
    }
    if (!password) {
        errors.password = 'Can\'t be blank';
    }
    if (Object.keys(errors).length === 0) {
        const user = new User(nickname, encrypt(password));
        users.push(user);
        res.redirect('/');
        return;
    }
    res.status(422);
    res.render('users/new', { form: req.body, errors });
};

export const getAuth = (req, res) => {
    res.render('session/new', { form: {} });
};
    
export const postAuth = (req, res) => {
    const { nickname, password } = req.body;
    const user = users.find(u => u.nickname === nickname);
    if (user && user.passwordDigest === encrypt(password)) {
        req.session.nickname = user.nickname;
        res.redirect('/');
        return;
    }
    res.status(422);
    res.render('session/new', { form: req.body, error: 'Invalid nickname or password' });
};


export const deleteSession = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        console.log(err);
        } else { 
        console.log(`current session is deleted` );
        }
        res.redirect('/');
    })
};