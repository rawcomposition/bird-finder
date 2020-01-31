import React from 'react';
import './places-search.styles.scss';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';


const PlacesSearch = (props) => {
	
	const handleSelect = address => {
		props.handleAddressChange(address);
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				props.handleLatLngChange(latLng);
			})
			.catch(error => console.error('Error', error));
	};
	
	return (
		<PlacesAutocomplete
			value={props.address}
			onChange={props.handleAddressChange}
			onSelect={handleSelect}
		>
			{({ getInputProps, suggestions, getSuggestionItemProps }) => (
				<React.Fragment>
					<input
						{...getInputProps({
							placeholder: 'Search for a place or address',
							className: 'form-control form-control-lg location-search-input',
						})}
					/>
					<div className="autocomplete-dropdown-container">
						{suggestions.map(suggestion => {
							const { formattedSuggestion: { mainText, secondaryText } } = suggestion;
							const className = 'suggestion-item' + (suggestion.active
								? ' active'
								: '');
							return (
								<div {...getSuggestionItemProps(suggestion, { className })}>
									<strong>{mainText}</strong><span className='secondary-text'>{secondaryText}</span>
								</div>
							);
						})}
					</div>
				</React.Fragment>
			)}
		</PlacesAutocomplete>
	);
}

export default PlacesSearch;
