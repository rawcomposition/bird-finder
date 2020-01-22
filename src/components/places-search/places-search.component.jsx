import React from 'react';
import './places-search.styles.scss';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';

export default class PlacesSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			address: '',
			lat: '',
			lng: ''
		};
	}

	handleChange = address => {
		this.setState({ address });
		this.props.handleChange(address);
	};

	handleSelect = address => {
		this.setState({address});
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				this.props.handleChange({...latLng, address});
			})
			.catch(error => console.error('Error', error));
	};

	render() {
		return (
			<PlacesAutocomplete
				value={this.state.address}
				onChange={this.handleChange}
				onSelect={this.handleSelect}
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
}
