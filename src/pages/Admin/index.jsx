import React, { Component } from 'react'
import Statistics from './Statistics'
import Statement from './Statement'

export default class Admin extends Component {
	render() {
		return (
			<div>
				<Statistics/>
				<Statement/>
			</div>
		)
	}
}
