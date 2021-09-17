// Import and setup.
const express   = require("express");
const app       = express();
const server    = require("http").Server(app);
const io        = require('socket.io')(server);
const puppeteer = require('puppeteer');
const Scraper   = require("scraper");
const port      = 3000;

// Convert an array to a unique array.
function uniqueArray(arr) { // (array)
	if (arr) {return arr.filter((value, index) => (arr.indexOf(value) === index));}
}

// Serve the static website files.
app.use(express.static("public"));

// Starts the server.
server.listen(port, () => console.log("Server is running on port:" + port));

// On connection.
io.on('connection', (socket) => {
	const scraper = new Scraper();

	// Scraping signal handler.
	socket.on("website", addressList => { // TODO website>scrape
		// Loop through the address list.
		for (let i in addressList) {
			let address = addressList[i];
			console.log(address);

			// Scrape the address and emit the gathered info back.
			scraper.scrape(address).then(result => {
				//socket.emit("info", result); // TODO emails/phones>info
				socket.emit("emails", result[0]);
				socket.emit("phone", result[1])
				console.log(result);
			});
		}
	});
});
