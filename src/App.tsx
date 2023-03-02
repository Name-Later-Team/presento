import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "react-bootstrap";

function App() {
	const handleClick = () => {
		fetch("/api/hello")
			.then((res) => res.json())
			.then(console.log)
			.catch(console.log);
	};
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>

				<Button onClick={handleClick}>Click</Button>
			</header>
		</div>
	);
}

export default App;
