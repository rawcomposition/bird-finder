import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import FinderForm from './components/finder-form/finder-form.component';


const App = () => {
	const [queryData, setQueryData] = useState({})
	
	const handleFind = response => {
		setQueryData(response);
	}
	return (
		<div>
			<Header/>
			<section>
				<div className="container">
					<div className="section-heading text-center">
						<h2>Find a bird</h2>
						<hr/>
					</div>
					<FinderForm handleFind={handleFind}/>
					<ol className="hotspot-results mt-5"></ol>
				</div>
			</section>
			<Footer/>
		</div>
	)
}

export default App;
