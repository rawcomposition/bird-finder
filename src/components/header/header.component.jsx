import React, {Component} from 'react';
import './header.styles.scss';
import Kingfisher from '../../assets/kingfisher.png';

export default class Header extends Component {
	render() {
		return(
			<header className="masthead">
				<div className="nav-bar">
					<div className="icon">
						<img src={Kingfisher} alt="Bird Logo"/>
					</div>
					<a className="link sitename" href="/">WorldBirder.info</a>
					<a className="link github" href="https://github.com/akjackson1/bird-finder" target="_blank" rel="noopener noreferrer">View it on Github</a>
				</div>
				<div className="container h-100">
					<div className="row h-100">
						<div className="col-lg-7 my-auto">
							<div className="header-content mx-auto">
								<h1 className="mb-5">Find your target birds - the easy way</h1>
							</div>
						</div>
						<div className="col-lg-5 my-auto">
						</div>
					</div>
				</div>
			</header>
		);
	}
}
