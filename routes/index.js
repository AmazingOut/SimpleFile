var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = 'SimpleFile 招投标存证系统';
  var title_main = 'SimpleFile 招投标存证系统';
  var title_sub = '跟踪招标文件从提交到合约存证';
  res.render('index', { title: title, title_main: title_main, title_sub: title_sub  });
});

//XmlHTTP request flash messages
router.post('/flash', function(req,res) {
    var title = 'SimpleFile 招投标存证系统';
    var title_main = 'SimpleFile 招投标存证系统';
    var title_sub = '跟踪招标文件从提交到合约存证';

    var post_message_type = req.body.message_type; //error or success
    var post_message_description = req.body.message_description;
    var flash_page = req.body.message_page;
    req.flash(post_message_type, post_message_description);

    res.render(flash_page, {title: title, title_main: title_main, title_sub: title_sub});
});

module.exports = router;
