// Runs the scraper.
const puppeteer = require('puppeteer');

function uniqueArray(arr) {
	if (arr) {return arr.filter((value, index) => (arr.indexOf(value) === index));}
}

async function scrapeProduct(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	// Email
	const [el1] = await page.$x('/html/body')
	const txt1  = await el1.getProperty('textContent');
	const text  = await txt1.jsonValue();
	let email   = uniqueArray(getEmail(text));
	let phone   = uniqueArray(getPhone(text));
	browser.close();
	return [email, phone];
}

// Finds the email using REGEX.
function getEmail(text) {
	return text.match(/\w+@\w+\.\w{1,3}/gm);
}

function getPhone(text) {
	return text.match(/(\+[0-9]\s)?\(?[0-9]{3}[^0-9]{0,2}[0-9]{3}[^0-9]?[0-9]{4}/gm);
}

// Runs the server.
const express = require("express");
const app     = express();
const server  = require("http").Server(app);
const port    = 3000;
const io      = require('socket.io')(server);

// Serve the static website files.
app.use(express.static("public"));

// Starts the server.
server.listen(port, () => {
	console.log("Server is running on port:" + port);
});


// Socket
const users = {};
io.on('connection', function(socket){
	// Runs the scraper when the input is submitted.
	console.log("user connected");

	// Promise handler.
	socket.on("website", (address) => {
		scrapeProduct(address).then((result) => {
			socket.emit("emails", result[0]);
			socket.emit("phone", result[1])
			console.log(result);
		});
		console.log(address);
	});

  socket.on('disconnect', function(){
	console.log('user ' + users[socket.id] + ' disconnected');
	// remove saved socket from users object
	delete users[socket.id];
  });
});
