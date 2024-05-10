import React from "react";
import {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SelectPlace from './SelectPlace';
import SelectTime from './SelectTime';
import Slidebar from './Slidebar';
import './Plan.css';

function Plan(){
    const [isOpen, setIsOpen] = useState(true); // 사이드바 상태(state) 추가
    // 사이드바를 열고 닫는 함수
    const toggleSlidebar = () => {
        setIsOpen(!isOpen);
    };

    return(
            <div className="sidebar">
                <div className="loc">제주</div>
                
                <div className="search">
                <input id="name" type="text" placeholder="장소나 숙소를 검색하세요." />
                </div>

                <div className="button">
                    
                </div>
                <div className="block">
                    <SelectPlace />
                </div>
                <div className={`slidebar ${isOpen ? 'open':''}`}>
                    <Slidebar />
                </div>
                <div className="toggle-button" onClick={toggleSlidebar}>
                <b>{isOpen ? '<' : '>'}</b>
                </div>
            </div>
    );
}

export default Plan;