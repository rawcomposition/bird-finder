import React from 'react';
import './species-search.styles.scss';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';

const SpeciesSearch = ({handleChange}) => {
	const wait = 300;
	const loadOptions = inputValue => getAsyncOptions(inputValue);
	const debouncedLoadOptions = debounce(loadOptions, wait);
	
	const getAsyncOptions = (inputValue) => {
		//https://github.com/JedWatson/react-select/issues/3075#issuecomment-450194917
		const url = 'https://api.ebird.org/v2/ref/taxon/find?locale=en_US&cat=species&key=jfekjedvescr&q=' + inputValue;
		return fetch(url)
		.then(response => response.json())
		.then( data => {
			return new Promise((resolve, reject) => {
				resolve(data.map( item => {
	  			  return {
	  				  label: item.name,
	  				  value: item.code,
	  			  }
	  		  }));
			});
		})
		.catch(err => {
			alert("error");
		});
	}
	
	return(
		<AsyncSelect loadOptions={inputValue => debouncedLoadOptions(inputValue)} onChange={handleChange} placeholder="Search for a species..." className="species-select" />
	)
}
export default SpeciesSearch;