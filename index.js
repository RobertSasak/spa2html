var express = require('express');
var arguments = process.argv.splice(2)
var port = arguments[0] || process.env.PORT || 8888;

function handleRequest(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	var url;
	var afterSlash = req.url.substring(1);

	if (req.headers['x-forwarded-host']) {
		url = 'http://' + req.headers['x-forwarded-host'] + req.url;
	} else if (afterSlash.indexOf('http://') === 0 || afterSlash.indexOf('https://') === 0) {
		url = afterSlash;
	} else if (afterSlash === '') {
		res.sendFile(path.join(__dirname, 'README.md'));
		return;
	} else {
		res.status(500).send('Url: ' + afterSlash + '\n<br>The url was not specified or doen not start with http(s)://.<br>\nSee <a href="/">README</a>.');
		return;
	}

	console.log('Fetching url:', url);
	getContentQ(url, function (content) {
		res.send(content);
	});
}

var app = express();
app.get(/(.*)/, handleRequest);
app.listen(port);


var max = 15;

function getContentQ(url, callback) {
	if (max > 0) {
		getContent(url, callback);
	}
	max--;
}

/* */

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');

function getContent(url, callback) {
	var childArgs = [
		'--local-storage-quota=500MB', path.join(__dirname, 'phantom-server.js'), url
	];

	var child = childProcess.execFile(phantomjs.path, childArgs);

	var content = '';
	child.stdout.on('data', function (data) {
		content += data.toString();
	});

	child.stderr.on('data', function (data) {
		console.log(data.toString());
	});

	child.on('exit', function (code, msg) {
		if (code !== 0) {
			console.log('Phantomjs return error', msg);
			callback(content);
		} else {
			callback(content);
		}
	});
}