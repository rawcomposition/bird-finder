import React from 'react';
import './hotspot-row.styles.scss';
const HotspotRow = ({id, avg, n, name }) => {
	return (
		<li className="row">
			<div className="col-md-6">
				<a href={`https://ebird.org/hotspot/${id}`} target='_blank' rel='noopener noreferrer'>{name}</a>
			</div>
			<div className="col-md-6">
				<b className="percent text-muted">{avg}%</b> of {n} checklists
				<div className="progress">
					<div className="progress-bar" style={{width: `${avg}%`}}></div>
				</div>
			</div>
		</li>
	)
}
export default HotspotRow;