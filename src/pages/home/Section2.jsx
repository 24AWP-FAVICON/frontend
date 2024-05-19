import React, { useState } from "react";
import "./Section2.css";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Card({ image, title, description }) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
      </div>
      <div className="card-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Section2() {
  // 카드 데이터
  const cards = [
    {
      image: `${process.env.PUBLIC_URL}/card1.jpg`,
      title: "바에서의 에스프레소",
      description:
        "이탈리아의 작은 카페에서 에스프레소를 주문할 때, 바에서 서서 마시면 앉아서 마실 때보다 더 저렴하다는 것을 기억하세요. 테이블 서비스에 추가 요금이 부과될 수 있습니다.",
    },
    {
      image: `${process.env.PUBLIC_URL}/card2.jpg`,
      title: "지역 축제 참여하기",
      description:
        "브라질을 여행할 때는 각 지역의 독특한 축제에 참여해보세요. 리우데자네이루의 카니발이나 살바도르의 바이아나 축제는 브라질의 다양한 문화를 체험할 수 있는 좋은 기회입니다.",
    },
    {
      image: `${process.env.PUBLIC_URL}/card3.jpg`,
      title: "음식의 매운 정도 확인하기",
      description:
        "인도에서 음식을 주문할 때는 매운 정도를 반드시 확인하세요. 인도 요리는 그 매운 맛으로 유명하지만, 대부분의 식당은 외국인의 입맛에 맞게 조절할 수 있습니다.",
    },
    {
      image: `${process.env.PUBLIC_URL}/card4.jpg`,
      title: "강한 햇볕으로부터 피부 보호하기",
      description:
        "오스트레일리아에서는 도시뿐만 아니라 국립공원이나 해변에서도 피부를 강한 햇볕으로부터 보호하는 것이 중요합니다. 오스트레일리아는 오존층이 얇아 UV 수준이 매우 높습니다.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : cards.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < cards.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <section className="section">
      <div className="cards">
        <Card {...cards[currentIndex]} />
      </div>
      <div className="navigation">
        <button className="nav-btn prev" onClick={handlePrev}>
          <span className="icon-wrapper"><FiChevronLeft /></span>
        </button>
        <button className="nav-btn next" onClick={handleNext}>
          <span className="icon-wrapper"><FiChevronRight /></span>
        </button>
      </div>
    </section>
  );
}

export default Section2;