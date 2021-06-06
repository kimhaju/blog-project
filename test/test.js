var express = require('express');
var test = express();
test.locals.pretty = true;
test.set('view engine', 'pug');
test.set('views', '../blog_view'); //-> 앞에 뷰스는 퍼그의 문법 바꾸면 안됨. 뒤에는 링크
test.use(express.static('public'));

test.get('/test', function(req,res){
  res.render('test'); //->어떤 퍼그 파일을 실행시킬래? 하는 문법.
})

test.listen(3000, function(){
  console.log('연결완료 3000 PORT!');
})
//->따로 테스트 폴더 만들고 실행하니까 다시 테스트 폴더로 들어가서 실행해야 하는 번거로움이 있음.

// 나 머지했다!!!!!!!
