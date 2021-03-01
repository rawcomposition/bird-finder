import puppeteer from 'puppeteer';
import axios from 'axios';
import abundance from './models/abundance.js';

export const index = async (req, res) => {
	//To do: set constants from params
	const speciesCode = 'coohaw';
	const lat = 41.155599;
	const lng = -81.508896;
	const distance = 10;

	/*const speciesInfo = await getSpeciesInfo(speciesCode);
	if (!speciesInfo || speciesInfo?.category !== 'species') {
		res.send('Error retrieving species');
	}
	const speciesName = speciesInfo.comName;
	const bounds = getBounds(lat, lng, distance);

	const locations = await getLocationsWithinBounds(speciesCode, bounds);
	if (!locations) {
		res.send('Error retrieving species locations');
	}*/

	//For development
	const locations = [
		{
			hs: 1,
			n: 'L1156858',
		},
		{
			hs: 1,
			n: 'L275473',
		},
	];

	const hotspots = locations.filter(location => location.hs === 1 && location.n);
	await updateBarcharts(hotspots, speciesCode);
	res.send('Success');
}

const updateBarcharts = async (hotspots, speciesCode) => {
	const browser = await puppeteer.launch({
		// TO DO: Skip loading assets
		userDataDir: "./puppeteer_data"
	});
	const page = await browser.newPage();
	await page.goto('https://ebird.org/myebird');

	const needsLogin = await page.$('#input-user-name');
	if (needsLogin) {
		await page.type('#input-user-name', process.env.EBIRD_USERNAME);
		await page.type('#input-password', process.env.EBIRD_PASSWORD);
		await page.click('#form-submit');
		await page.waitForNavigation();
	}

	const responses = await page.evaluate(async (hotspots, speciesCode) => {
		const promises = hotspots.map(hotspot => () => fetch(`https://ebird.org/barchartData?fmt=json&spp=${speciesCode}&r=${hotspot.n}`).then(res => res.json()));

		let json = [];
		while (promises.length) {
			const chunk = await Promise.all(promises.splice(0, 24).map(func => func()));
			json = [...json, ...chunk];
		}

		return json;
	}, hotspots, speciesCode);

	browser.close();
	
	responses.forEach(async (response, index) => {
		const data = response.dataRows[0];
		const hotspotId = hotspots[index].n; // TO DO: Ensure hotspot indexes match responses indexes
		const hotspotInfo = await axios.get(`https://api.ebird.org/v2/ref/hotspot/info/${hotspotId}`);
		const percents = data.values;
		const samples = data.values_N;
		const totalObserved = percents.reduce((sum, percent, index) => sum + (percent * samples[index]));
		const totalSamples = samples.reduce((sum, sampleSize) => sum + sampleSize);
		const average = totalObserved / totalSamples;
		const filter = {
			hotspotId,
			speciesCode,
		}
		const update = {
			average,
			totalSamples,
			speciesName: data.name,
			hotspotName: hotspotInfo.data.name,
			updatedAt: new Date(),
		}
		await abundance.findOneAndUpdate(filter, update, {
			upsert: true,
		});
	});
	
	
}

const getLocationsWithinBounds = async (speciesCode, {maxLat, minLat, maxLng, minLng}) => {
	const url = `https://ebird.org/map/points?speciesCode=${speciesCode}&byr=1900&eyr=2021&yr=&bmo=1&emo=12&maxY=${maxLat}&maxX=${maxLng}&minY=${minLat}&ev=Z&minX=${minLng}`;
	let json = null;
	try {
		const response = await getSecureEbirdContent(url);
		json = JSON.parse(response);
	} catch (error) {}
	return json;
}

const getSpeciesInfo = async (speciesCode) => {
	try {
		const response = await axios.get(`https://api.ebird.org/v2/ref/taxonomy/ebird?species=${speciesCode}&fmt=json`);
		return response.data[0];
	} catch (error) {
		return false;
	}
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
}

const getBounds = (lat, lng, distance, unit = 'km') => {
	const earth_radius = unit === 'km' ? 6371.009 : 3958.761;
	
	// latitude boundaries
	const maxLat = lat + radiansToDegrees(distance / earth_radius);
	const minLat = lat - radiansToDegrees(distance / earth_radius);

	// longitude boundaries
	const maxLng = lng + radiansToDegrees(distance / earth_radius) / Math.cos(degreesToRadians(lat));
	const minLng = lng - radiansToDegrees(distance / earth_radius) / Math.cos(degreesToRadians(lat));

	return { maxLat, minLat, maxLng, minLng }
}

const radiansToDegrees = (radians) => {
	const pi = Math.PI;
	return radians * (180/pi);
}

const degreesToRadians = (radians) => {
	const pi = Math.PI;
	return radians * (pi/180);
}