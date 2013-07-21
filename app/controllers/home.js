
exports.home = function(req, res){
  res.render('home/home', {
    title: 'NextGen Learning Platform !',
    vidUrl: 'http://www.youtube.com/watch?v=5F7Gx0-W-M4'
  })
}