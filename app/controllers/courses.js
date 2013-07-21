
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Courses = mongoose.model('Courses')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Courses.load(id, function (err, course) {
    if (err) return next(err)
    if (!course) return next(new Error('not found'))
    req.course = course
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  Courses.list(options, function(err, courses) {
    if (err) return res.render('500')
    Courses.count().exec(function (err, count) {
      res.render('courses/index', {
        title: 'Courses',
        articles: courses,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

/**
 * New article
 */

exports.new = function(req, res){
  res.render('courses/new', {
    title: 'New Course',
    article: new Courses({})
  })
}

/**
 * Create an article
 */

exports.create = function (req, res) {
  var course = new Courses(req.body)
  course.user = req.user

  course.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created article!')
      return res.redirect('/courses/'+course._id)
    }

    res.render('courses/new', {
      title: 'New courses',
      article: course,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('courses/edit', {
    title: 'Edit ' + req.course.title,
    course: req.course
  })
}

/**
 * Update article
 */

exports.update = function(req, res){
  var article = req.article
  article = _.extend(article, req.body)

  article.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/articles/' + article._id)
    }

    res.render('courses/edit', {
      title: 'Edit courses',
      article: article,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('courses/show', {
    title: req.article.title,
    article: req.article
  })
}

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var course = req.course
  course.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/courses')
  })
}
