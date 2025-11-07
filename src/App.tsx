import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Header from './Header';
import Nori from './Nori';
import Home from './Home';
import Memeber from './Memeber';

export default function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Memeber />}></Route>
					<Route path="/nori" element={<Nori />}></Route>
					<Route path="/mypage" element={<Memeber />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
};