import React from 'react';
import { MyPage } from './components/mypage/MyPage';
import { mockMypageData } from './components/mypage/mockData';

export default function MyPagePage() {
  return <MyPage data={mockMypageData} />;
}