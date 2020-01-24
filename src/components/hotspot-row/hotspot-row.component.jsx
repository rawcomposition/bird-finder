import React from 'react';
import './hotspot-row.styles.scss';
const HotspotRow = ({location_id, average, total_checklists, location_name }) => {
	return (
		<li className="row" key={location_id}>
			<div className="col-md-6">
				<a href={`https://ebird.org/hotspot/${location_id}`} target='_blank' rel='noopener noreferrer'>{location_name}</a>
			</div>
			<div className="col-md-6">
				<b className="percent text-muted">{average}%</b> of {total_checklists} checklists
				<div className="progress">
					<div className="progress-bar" style={{width: `${average}%`}}></div>
				</div>
			</div>
		</li>
	)
}
export default HotspotRow;