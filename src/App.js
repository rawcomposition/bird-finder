import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import FinderForm from './components/finder-form/finder-form.component';
import HotspotResults from './components/hotspot-results/hotspot-results.component';


const App = ({location: {search}}) => {
	const history = useHistory();
	
	const [searchData, setSearchData] = useState({});
	const [urlState, setUrlState] = useState({});

	useEffect( () => {
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
		
	}, [search])

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
			<Footer/>
		</div>
	)
}

export default withRouter(App);
