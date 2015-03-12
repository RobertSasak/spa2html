var system = require('system');
var page = require('webpage').create();

page.settings.loadImages = false;
page.settings.localToRemoteUrlAccessEnabled = true;
page.viewportSize = {
	width: 1024,
	height: 768
};

/* fix from https://github.com/ariya/phantomjs/issues/12697 */
function exit(code) {
	if (page) page.close();
	setTimeout(function () {
		phantom.exit(code);
	}, 0);
	phantom.onError = function () {
		throw new Error('');
	};
}

page.onCallback = function () {
	console.log(page.content);
	exit();
};

page.onConsoleMessage = function (msg, lineNum, sourceId) {
	console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.onInitialized = function () {
	page.evaluate(function () {
		document.addEventListener('__htmlReady__', function () {
			window.callPhantom();
		}, false);
		setTimeout(function () {
			window.callPhantom();
		}, 5000);
	});
};

page.onError = function (msg, trace) {
	var msgStack = ['ERROR: ' + msg];

	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function (t) {
			msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
		});
	}
	console.error(msgStack.join('\n'));
};

page.onConsoleMessage = function (msg, lineNum, sourceId) {
	console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.open(system.args[1], function () {

});