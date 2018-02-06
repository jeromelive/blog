var cheerio = require('cheerio'),
		http = require('http'),
		iconv = require('iconv-lite'),
		mongoose = require('mongoose');

var index = 1,
		titles = [],
		btLink = [],
		url = 'http://www.ygdy8.net/html/gndy/dyzz/list_23_';

var mongo_url = 'mongodb://localhost:27017/Titles';

var db = mongoose.createConnection(mongo_url);

var schema = new mongoose.Schema({
	title: {type: String}
})

var mongooseModel = db.model('mongoose', schema);

function getTitle(url, i) {
	console.log('正在获取第'+ i + '页的内容');
	http.get(url + i +'.html', (res) => {
		var chunks = [];
		res.on('data', (chunk) => {
			chunks.push(chunk);
		});

		res.on('end', () => {
			var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
			var $ = cheerio.load(html, {decodeEntities: false});
			$('.co_content8 .ulink').each(function (idx, element) {
			  var $element = $(element);
			  titles.push({
			    title: $element.text()
			  })
			  save($element.text());
			});
			if(i < 2) {
				getTitle(url, ++index);
			}  else {
				console.log('Title获取完毕！');
				console.log(titles);
			}
		})
	})
}

function save(title) {
	var doc = {title};
	var mongooseContent = new mongooseModel(doc);
	mongooseContent.save((error) => {
		if(error) {
			console.log(error);
		} else {
			console.log('保存数据库成功!');
		}
		db.close();
	})
}

function getBtLink(urls, n) {
	console.log('正在获取第'+ n + '个url的内容');
	http.get('www.ygdy8.net'+ urls[n].title, (res) => {
		var chunks = [];
		res.on('data', (chunk) => {
			chunks.push(chunk);
		});

		res.on('end', () => {
			console.log(chunks);
			var html = iconv.decode(Buffer.concat(chunks), 'gb2312'); //进行转码
			var $ = cheerio.load(html, {decodeEntities: false});
			$('#Zoom td').children('a').each(function (idx, element) {
			  var $element = $(element);
			  btLink.push({
			    bt: $element.attr('href')
			  })
			})
			if(n < urls.length - 1) {
			  getBtLink(urls, ++count);
			} else {
			  console.log("btlink获取完毕！");
			  console.log(btLink);   
			}
		})
	})
}

function main() {
	console.log('爬虫开始');
	getTitle(url, index);
	// getBtLink(titles, 0);
}

main();