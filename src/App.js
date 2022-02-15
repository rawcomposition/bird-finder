import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import './App.scss';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import FinderForm from './components/finder-form/finder-form.component';
import HotspotResults from './components/hotspot-results/hotspot-results.component';


const App = ({location: {search}}) => {
	const history = useHistory();
	
	const [searchData, setSearchData] = useState({});
	const [urlState, setUrlState] = useState({});

	useEffect(() => {
		if(search) {
			const params = new URLSearchParams(search);
			const urlObject = {
				speciesLabel: params.get('speciesLabel'),
				speciesCode: params.get('speciesCode'),
				lat: params.get('lat'),
				lng: params.get('lng'),
				radius: params.get('radius'),
				address: params.get('address')
			}
			setSearchData(urlObject);
			setUrlState(urlObject);
		}
		
	}, [search]);

	const handleFind = response => {
		const { speciesLabel, speciesCode, lat, lng, radius, address } = response;
		setSearchData(response);
		history.push({
			pathname: '/',
			search: `?speciesCode=${speciesCode}&lat=${lat}&lng=${lng}&radius=${radius}&speciesLabel=${speciesLabel}&address=${address}`
		});
	}
	
	return (
		<div>
			<Header/>
			<section>
				<div className="container">
					<div className="section-heading text-center">
						<h2>Find a bird</h2>
						<hr/>
					</div>
					<FinderForm handleFind={handleFind} urlState={urlState} />
					<HotspotResults {...searchData} />
				</div>
			</section>
			<section className="pt-0">
				<h4 className="text-center">Not sure what to search for? Try these...</h4>
				<ul className="example-list">
					<li>
						<a href="/?speciesCode=monqua&lat=31.72508749999999&lng=-110.8800869&radius=5&speciesLabel=Montezuma%20Quail%20-%20Cyrtonyx%20montezumae&address=Madera%20Canyon,%20AZ,%20USA">Montezuma Quail near Madera Canyon, AZ, USA</a>
					</li>
					<li>
						<a href="/?speciesCode=fernwr1&lat=-17.2660801&lng=145.4858599&radius=25&speciesLabel=Fernwren%20-%20Oreoscopus%20gutturalis&address=Atherton%20Queensland,%20Australia">Fernwren near Atherton, Queensland, Australia</a>
					</li>
					<li>
						<a href="/?speciesCode=kirwar&lat=44.6614039&lng=-84.7147512&radius=10&speciesLabel=Kirtland%27s%20Warbler%20-%20Setophaga%20kirtlandii&address=Gr%C3%A9%C3%BDl%C3%AFng,%20MI,%20USA">Kirtland's Warbler near Grayling, MI, USA</a>
					</li>
					<li>
						<a href="/?speciesCode=wallcr1&lat=42.8722093&lng=-0.0834092&radius=30&speciesLabel=Wallcreeper%20-%20Tichodroma%20muraria&address=Pyr%C3%A9n%C3%A9es%20National%20Park,%20France">Wallcreeper near the Pyrénées National Park, France</a>
					</li>
				</ul>
			</section>
			<Footer/>
		</div>
	)
}

export default withRouter(App);
