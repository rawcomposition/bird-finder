import puppeteer from 'puppeteer';
import axios from 'axios';
import { response } from 'express';

export const index = async (req, res) => {
	//To do: set constants from params
	const speciesCode = 'coohaw';
	const lat = 41.155599;
	const lng = -81.508896;
	const distance = 10;

	const locations = await getLocationsWithinBounds();
	if (!locations) {
		res.send('Error retrieving species locations');
	}
	const speciesInfo = await getSpeciesInfo(speciesCode);
	if (!speciesInfo || speciesInfo?.category !== 'species') {
		res.send('Error retrieving species');
	}
	const speciesName = speciesInfo.comName;
	const bounds = getBounds(lat, lng, distance);

	res.send('Success');
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