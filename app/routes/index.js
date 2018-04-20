const express = require('express');
const router = express.Router();
const showdown = require('showdown');
const NotFoundError = require('../errors/notfounderror');

const mdConverter = new showdown.Converter();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: '首页',
    posts: [],
    categories: [],
  });
});

router.get('/post/:slug', (req, res, next) => {
  res.render('post', {
    post: null,
  });
});

router.get('/categories/:category', (req, res, next) => {
  res.render('category', {
    categories: [],
    posts: [],
  });
});

router.get('/tags', (req, res, next) => {
  res.render('tags', {
    tags: [],
  });
});

router.get('/tags/:tag', (req, res, next) => {
  res.render('posts', {
    tag: req.params.tag,
    posts: [],
  });
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/archives', (req, res, next) => {
  res.render('archives', {
    posts: [],
  });
});

router.get('/search', (req, res, next) => {
  let conditions = req.query.s;
  conditions = conditions.split(/,|\s+/); // 正则
  conditions = conditions.filter(c => c !== '');

  res.render('search', {
    s: conditions.join(' '),
    posts: [],
  });
});

module.exports = router;
