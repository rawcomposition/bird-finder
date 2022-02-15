import React, {Component} from 'react';
import './header.styles.scss';

export default class Header extends Component {
	render() {
		return(
			<header>
				<div className="nav-bar">
					<div className="container">
						<a className="sitename" href="/">
							<img className="icon" src="https://rawcomposition.com/logo.png" alt="Logo"/>
							birding.dev
						</a>
						<nav>
							<a href="https://rawcomposition.com/about">By RawComposition.com</a>
						</nav>
					</div>
				</div>
			</header>
		);
	}
}
