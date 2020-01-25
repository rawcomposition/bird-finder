import React from 'react';
import './error-alert.styles.scss';
const ErrorAlert = ({message}) => (
	<div className='alert alert-warning error'>{message}</div>
)
export default ErrorAlert;