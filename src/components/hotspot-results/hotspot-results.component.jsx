import React, { useState, useEffect } from 'react';
import './hotspot-results.styles.scss';
import LoadingSpinner from '../loading-spinner/loading-spinner.component';
import HotspotRow from '../hotspot-row/hotspot-row.component';
import ErrorAlert from '../error-alert/error-alert.component';

const HotspotResults = ({speciesCode, lat, lng, radius}) => {
	const [hotspots, setHotspots] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);
	const [noResults, setNoResults] = useState(false);

	const handleResponse = response => {
		const genericError = "Oops. Something bad happened.";
		if (response.ok) {
			return response.json().catch(error => {
				throw new Error(genericError);
			});
		} else {
			return response.json().catch(error => {
				throw new Error(genericError);
			}).then(json => {
				throw new Error(json.message);
			});
		}
	}

	useEffect( () => {
		if( speciesCode && lat && lng && radius) {
			setIsLoading(true);
			setHotspots([]);
			setError(false);
			setNoResults(false)
			fetch(`/api/?code=${speciesCode}&lat=${lat}&lng=${lng}&distance=${radius}`)
				.then( response => handleResponse(response) )
				.then( data => {
					setIsLoading(false);
					setHotspots(data);
					if(!data.length) {
						setNoResults(true);
					}
				})
				.catch( error => {
					console.log(error);
					const message = error.message || "Oops. An error occured";
					setError(message);
					setIsLoading(false);
				});
		}
	}, [speciesCode, lat, lng, radius])
	
	return (
		<div className='results-container'>
			{ isLoading ? <LoadingSpinner /> : ''}
			{ error ? <ErrorAlert message={error}/> : '' }
			{ noResults ? <p className='no-results'>We couldn't find any hotspots. Try a different location or larger radius.</p> : '' }
			
			<ol className="hotspot-results">
				{hotspots.map( item => (
					<HotspotRow key={item.location_id} {...item}/>
				))}
			</ol>
		</div>
	)
}
export default HotspotResults;