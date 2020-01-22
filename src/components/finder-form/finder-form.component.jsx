import React, { useState } from 'react';
import './finder-form.styles.scss';

import PlacesSearch from '../places-search/places-search.component';
import SpeciesSearch from '../species-search/species-search.component';

const FinderForm = ({handleFind}) => {
	const [searchData, setSearchData] = useState({
		speciesLabel: '',
		speciesCode: '',
		address: '',
		radius: 10,
		lat: '',
		lng: ''
	});

	const handlePlacesChange = response => {
		const {address, lat, lng } = response;
		setSearchData({...searchData, address, lat, lng});
	}

	const handleSpeciesChange = response => {
		const {label, value } = response;
		setSearchData({...searchData, speciesLabel: label, speciesCode: value});
	}

	const handleInputChange = event => {
		const {name, value} = event.target;
		setSearchData({...searchData, [name]: value});
	}

	const handleSubmit = event => {
		event.preventDefault();
		if(!searchData.speciesCode) return alert('Please choose a species')
		if(!searchData.lat) return alert('Please choose a location or address')
		handleFind(searchData);
	}

	return(
		<form className='finder-form' onSubmit={handleSubmit}>
			<SpeciesSearch handleChange={handleSpeciesChange}/>
			<div className="form-row">
				<div className="col-md-6 mt-2">
					<PlacesSearch handleChange={handlePlacesChange}/>
				</div>
				<div className="col-md-4 input-group input-group-lg mt-2">
					<div className="input-group-prepend">
						<span className="input-group-text">Radius (km)</span>
					</div>
					<input type="text" name="radius" required className="form-control" onChange={handleInputChange} value={searchData.radius}/>
				</div>
				<div className="col-md-2 mt-2">
					<button type="submit" className="btn find-btn btn-primary mb-2 pl-3 pr-3" >Find</button>
				</div>
			</div>
		</form>
	)
}
export default FinderForm;