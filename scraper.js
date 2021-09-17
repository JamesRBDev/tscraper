class Scraper {
	scrape(url = "https://example.com", recursive = true) { // (string, boolean)
		const browser = await puppeteer.launch();
		const page    = await browser.newPage();

		await page.goto(url);

		const [el1] = await page.$x('/html/body');
		const txt1  = await el1.getProperty('textContent');
		const text  = await txt1.jsonValue();

		let emails = uniqueArray(getEmails(text));
		let phones = uniqueArray(getPhones(text));
		let links  = uniqueArray(getLinks(text));

		// Scrape recursively.
		if (recursive) {
			for (let i in links) {
				await page.goto(links[i]);

				const [el1] = await page.$x('/html/body');
				const txt1  = await el1.getProperty('textContent');
				const text  = await txt1.jsonValue();

				let rEmails = uniqueArray(getEmails(text));
				let rPhones = uniqueArray(getPhones(text));

				for (let i in rEmails) {
					emails.push(rEmails[i]);
				}

				for (let i in rPhones) {
					phones.push(rPhones[i]);
				}
			}
		}

		browser.close();
		return [emails, phones];
	}

	getEmails(text = "") {
		return text.match(/\w+@\w+\.\w{1,3}/g);
	}

	getPhones(text = "") {
		return text.match(/(\+[0-9]\s)?\(?[0-9]{3}[^0-9]{0,2}[0-9]{3}[^0-9]?[0-9]{4}/g);
	}

	getLinks(text = "") {
		return text.match(/https?:\/\/.*\.\w{3}(\/\S*)?/g);
	}
}

module.exports = Scraper;