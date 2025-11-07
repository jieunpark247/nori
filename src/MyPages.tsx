import React from 'react';
import { MyPage } from './components/mypage/MyPage';
import { mockMypageData } from './components/mypage/mockData';

export default function MyPages() {
  return <MyPage data={mockMypageData} />;
}