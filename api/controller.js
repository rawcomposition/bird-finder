import puppeteer from 'puppeteer';

export const index = async (req, res) => {
	const locations = await getLocationsWithinBounds();
	if (!locations) {
		res.send('Error retrieving species locations');
	}
	res.send('Success!');
	
}

const getLocationsWithinBounds = async () => {
	const url = 'https://ebird.org/map/points?speciesCode=blubun&byr=1900&eyr=2021&yr=&bmo=1&emo=12&maxY=27.003050007744548&maxX=-97.1859875790417&minY=25.777830773864366&ev=Z&minX=-99.05229006927607';
	let json = null;
	try {
		const response = await getSecureEbirdContent(url);
		json = JSON.parse(response);
	} catch (error) {}
	return json;
}

const getSecureEbirdContent = async (url) => {
	const browser = await puppeteer.launch({
		userDataDir: "./puppeteer_data"
	});
	let response = '';
	const page = await browser.newPage();
	response = await page.goto(url);

	const needsLogin = await page.$('#input-user-name');
	if (needsLogin) {
		await page.type('#input-user-name', process.env.EBIRD_USERNAME);
		await page.type('#input-password', process.env.EBIRD_PASSWORD);
		await page.click('#form-submit');
		response = await page.waitForNavigation();
	}

	const text = await response.text();
	await browser.close();
	return text;
};