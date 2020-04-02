import React from 'react';
import './footer.styles.scss';
import Kingfisher from '../../assets/kingfisher.png';
const Footer = () => (
	<React.Fragment>
		<section className="footer-banner">
			<div className="container">
				<h2>Bird smarter, not harder <img className="birdy" src={Kingfisher} alt="Bird Logo"/></h2>
			</div>
		</section>

		<footer>
			<div className="container">
				<p>&copy; 2020 Adam Jackson. All Rights Reserved.<br/>mail@rawcomposition.com • <a href="https://github.com/akjackson1/bird-finder" target="_blank" rel="noopener noreferrer">View it on Github</a></p>
			</div>
		</footer>
	</React.Fragment>
)
export default Footer;