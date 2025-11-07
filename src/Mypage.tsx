import React from 'react';
import { MyPageInfo } from './components/my/MyPageInfo';
import { mockMypageData } from './components/my/mockData';

export default function Mypage() {
  return <MyPageInfo data={mockMypageData} />;
}