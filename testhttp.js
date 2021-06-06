require('http').createServer(function(req, res){
  //->http 서비스 연결
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1>Hello World...</h1>')
  //->텍스트 출력 확인
}).listen(3001, function () {
  console.log('Server Running at http://127.0.0.1:3001')
  //->콘솔로그 확인 
})
