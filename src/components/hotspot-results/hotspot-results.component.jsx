import React, { useState, useEffect } from 'react';
import './hotspot-results.styles.scss';
import LoadingSpinner from '../loading-spinner/loading-spinner.component';
import HotspotRow from '../hotspot-row/hotspot-row.component';
import ErrorAlert from '../error-alert/error-alert.component';

const HotspotResults = ({speciesCode, lat, lng, radius}) => {
	const [hotspots, setHotspots] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect( () => {
		if( speciesCode && lat && lng && radius) {
			setIsLoading(true);
			setHotspots([]);
			setError(false);
			fetch(`/api/?code=${speciesCode}&lat=${lat}&lng=${lng}&distance=${radius}`)
				.then( response => {
					return response.ok ? response.json() : Promise.reject(response);
				})
				.then( data => {
					setIsLoading(false);
					setHotspots(data);
				})
				.catch( error => {
					setError(true);
					setIsLoading(false);
				});
		}
	}, [speciesCode, lat, lng, radius])
	
	return (
		<div className='results-container'>
			{ isLoading ? <LoadingSpinner /> : ''}
			{ error ? <ErrorAlert/> : '' }
			{ hotspots.length < 0 && !isLoading && ! error ? <p className='no-results'>We couldn't find any hotspots. Try a different location or larger radius.</p> : '' }
			
			<ol className="hotspot-results">
				{hotspots.map( item => (
					<HotspotRow key={item.location_id} {...item}/>
				))}
			</ol>
		</div>
	)
}
export default HotspotResults;