import puppeteer from 'puppeteer';
import axios from 'axios';
import abundance from './models/abundance.js';

export const index = async (req, res) => {
	const query = req.query;
	const speciesCode = query.speciesCode;
	const lat = parseFloat(query.lat);
	const lng = parseFloat(query.lng);
	const distance = parseInt(10);
	const thirtyDays = 30*24*60*60 * 1000;

	const bounds = getBounds(lat, lng, distance);

	const locations = await getLocationsWithinBounds(speciesCode, bounds);

	if (!locations) {
		res.send('Error retrieving species locations');
	}

	const hotspotsInRadius = await getHotspotsInRadius(lat, lng, distance);
	const speciesHotspots = locations.filter(location => location.hs === 1 && location.n in hotspotsInRadius);
	const hotspotIds = speciesHotspots.map(hotspot => hotspot.n);
	const cachedHotspots = await abundance.find({ hotspotId: { $in: hotspotIds }}).lean();
	const staleHotspots = cachedHotspots.filter(hotspot => new Date(hotspot.updatedAt) < new Date(Date.now() - thirtyDays));
	const cachedHotspotIds = cachedHotspots.map(({hotspotId}) => hotspotId);
	const staleHotspotIds = staleHotspots.map(({hotspotId}) => hotspotId);
	const fetchableHotspots = hotspotIds.filter(id => ! cachedHotspotIds.includes(id) || staleHotspotIds.includes(id));
	
	if (fetchableHotspots.length > 0) {
		await updateBarcharts(fetchableHotspots, hotspotsInRadius, speciesCode);
	}

	const results = await abundance.find({ speciesCode: speciesCode }).sort('-average').select('-_id hotspotName hotspotId average totalSamples').lean();

	const formattedResults = results.map(result => {
		return {
			avg: Math.round(result.average * 100),
			id: result.hotspotId,
			name: result.hotspotName,
			n: result.totalSamples,
		}
	});

	res.json(formattedResults);
}

const updateBarcharts = async (hotspots, hotspotNames, speciesCode) => {
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
		const promises = hotspots.map(hotspot => () => fetch(`https://ebird.org/barchartData?fmt=json&spp=${speciesCode}&r=${hotspot}`).then(res => res.json()));

		let json = [];
		while (promises.length) {
			const chunk = await Promise.all(promises.splice(0, 10).map(func => func()));
			json = [...json, ...chunk];
		}

		return json;
	}, hotspots, speciesCode);

	browser.close();
	
	responses.forEach(async (response, index) => {
		const data = response.dataRows[0];
		const hotspotId = hotspots[index]; // TO DO: Ensure hotspot indexes match responses indexes
		let hotspotName = hotspotNames[hotspotId];
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
			hotspotName,
			updatedAt: new Date(),
		}
		await abundance.findOneAndUpdate(filter, update, {
			upsert: true,
		});
	});
}

const getHotspotsInRadius = async (lat, lng, distance) => {
	const hotspotsInRadius = await axios.get(`https://api.ebird.org/v2/ref/hotspot/geo?lat=${lat}&lng=${lng}&fmt=json&dist=${distance}`);
	const hotspotNames = {}
	for (const {locId, locName} of hotspotsInRadius.data) {
		hotspotNames[locId] = locName;
	}
	return hotspotNames;
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