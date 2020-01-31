import React, { useState, useEffect } from 'react';
import './finder-form.styles.scss';

import PlacesSearch from '../places-search/places-search.component';
import SpeciesSearch from '../species-search/species-search.component';

const FinderForm = ({handleFind, urlState}) => {
	const initialState = {
		speciesLabel: '',
		speciesCode: '',
		address: '',
		radius: 10,
		lat: '',
		lng: '',
	}
	
	const [formState, setFormState] = useState(initialState);

	useEffect( () => {
		if (Object.keys(urlState).length > 0) setFormState(urlState);
	}, [urlState]);

	const handleAddressChange = address => {
		setFormState({...formState, address});
	}
	
	const handleLatLngChange = response => {
		const {lat, lng } = response;
		setFormState( prevState => {
			return {...prevState, lat, lng}
		});
	}

	const handleSpeciesChange = response => {
		const {label, value } = response;
		setFormState({...formState, speciesLabel: label, speciesCode: value});
	}

	const handleInputChange = event => {
		const {name, value} = event.target;
		setFormState({...formState, [name]: value});
	}

	const handleSubmit = event => {
		event.preventDefault();
		if(!formState.speciesCode) return alert('Please choose a species')
		if(!formState.lat) return alert('Please choose a location or address')
		handleFind(formState);
	}

	const { radius, speciesCode, speciesLabel, address } = formState;

	return(
		<form className='finder-form' onSubmit={handleSubmit}>
			<SpeciesSearch handleChange={handleSpeciesChange} value={speciesCode} label={speciesLabel}/>
			<div className="form-row">
				<div className="col-md-6 mt-2">
					<PlacesSearch handleAddressChange={handleAddressChange} address={address} handleLatLngChange={handleLatLngChange}/>
				</div>
				<div className="col-md-4 input-group input-group-lg mt-2">
					<div className="input-group-prepend">
						<span className="input-group-text">Radius (km)</span>
					</div>
					<input type="text" name="radius" required className="form-control" onChange={handleInputChange} value={radius}/>
				</div>
				<div className="col-md-2 mt-2">
					<button type="submit" className="btn find-btn btn-primary mb-2 pl-3 pr-3" >Find</button>
				</div>
			</div>
		</form>
	)
}
export default FinderForm;