import React from "react";
import { FaGithub, FaFigma } from "react-icons/fa";
import './Footer.css'; // CSS 파일 임포트

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>© 2024 Favicon. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <a href="https://github.com/24AWP-FAVICON/frontend" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaGithub size={24} />
          </a>
          <a href="https://www.figma.com/design/ZMuTNTAeArgj7Ws3PhfTdO/%EA%B3%A0%EA%B8%89%EC%9B%B9%ED%94%84?node-id=0-1&t=KCRyb9gT84wvBPkO-0" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaFigma size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
