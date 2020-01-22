import React from 'react';
import './footer.styles.scss';
import { ReactComponent as Birdy } from '../../assets/birdy.svg';
const Footer = () => (
	<React.Fragment>
		<section class="contact bg-primary">
			<div class="container">
				<h2>Bird smarter, not harder <Birdy className='birdy'/></h2>
			</div>
		</section>

		<footer>
			<div class="container">
				<p>&copy; 2017 Adam Jackson. All Rights Reserved.<br/>mail@rawcomposition.com</p>
			</div>
		</footer>
	</React.Fragment>
)
export default Footer;