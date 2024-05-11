import React from "react";
import {useState} from 'react';
import SelectPlace from './SelectPlace';
import SelectTime from './SelectTime';
import Slidebar from './Slidebar';
import './Plan.css';

function Plan(){
    const [isOpen, setIsOpen] = useState(true); // 사이드바 상태(state) 추가
    const [isTime,isPlace] = useState(false);  // 시간선택 or 장소선택
    // 사이드바를 열고 닫는 함수
    const toggleSlidebar = () => {
        setIsOpen(!isOpen);
    };
    const selectTime = () => {
        if(isTime){
            isPlace(!isTime);
        }
    }
    const selectPlace = () => {
        if(!isTime){
            isPlace(!isTime);
        }
    }
    

    return(
            <div className="sidebar">
                <div className="loc">제주</div>
                
                <div className="search">
                <input id="name" type="text" placeholder="장소나 숙소를 검색하세요." />
                </div>

                <div className="button">
                    <button onClick={selectTime} className={`${!isTime ? 'click':''}`}>시간선택</button>
                    <button onClick={selectPlace} className={`${isTime ? 'click':''}`}>장소선택</button>
                </div>
                <div className="block">
                    {isTime ? <SelectPlace /> : <SelectTime />}
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