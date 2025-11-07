import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Header from './Header';
import Nori from './Nori';
import Home from './Home';
import MyPage from './Mypage';

export default function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/nori" element={<Nori />}></Route>
					<Route path="mypage" element={<MyPage />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
};