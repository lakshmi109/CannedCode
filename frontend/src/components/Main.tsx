import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import '../temp.css';

/** Constants */
const SERVICE_URL = "http://localhost:3000";


/** Styled components */
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledSelect = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #d4a17d;
  color: black;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: #9e5a29;
  }
`;


export const GlowTextPage: React.FC = () => {

    const [language, setLanguage] = useState("node-js");
    const [userId, setuserId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  return (
    <>
      <div className="bg">
        <div></div>
        <div></div>
      </div>
      <div className="header-text" aria-hidden="true">
        <br />
        <span className="glow-filter" data-text="Canned Code">Canned Code</span>
        <br />
        The Ultimate Coding Sandbox 
        <br />
      </div>

      <Container>
        <StyledInput
          onChange={(e) => setuserId(e.target.value)}
          type="text"
          placeholder="User ID"
          value={userId}
        />
        <StyledSelect
          name="language"
          id="language"
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="node-js">Node.js</option>
          <option value="python">Python</option>
        </StyledSelect>
        <StyledButton disabled={loading} onClick={async () => {
          setLoading(true);
          await axios.post(`${SERVICE_URL}/project`, { userId, language });
          setLoading(false);
          navigate(`/coding/?userId=${userId}`)
        }}>{loading ? "Starting ..." : "Start Coding"}</StyledButton>
      </Container>

      <svg className="filters" width="1440px" height="300px" viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-4" colorInterpolationFilters="sRGB" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur4" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="19" result="blur19" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur9" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30" />
            <feColorMatrix
              in="blur4"
              result="color-0-blur"
              type="matrix"
              values="1 0 0 0 0 0 0.980 0 0 0 0 0 0.964 0 0 0 0 0 0.8 0"
            />
            <feOffset in="color-0-blur" result="layer-0-offsetted" dx="0" dy="0" />
            <feColorMatrix
              in="blur19"
              result="color-1-blur"
              type="matrix"
              values="0.815 0 0 0 0 0 0.494 0 0 0 0 0 0.262 0 0 0 0 0 1 0"
            />
            <feOffset in="color-1-blur" result="layer-1-offsetted" dx="0" dy="2" />
            <feColorMatrix
              in="blur9"
              result="color-2-blur"
              type="matrix"
              values="1 0 0 0 0 0 0.666 0 0 0 0 0 0.364 0 0 0 0 0 0.65 0"
            />
            <feOffset in="color-2-blur" result="layer-2-offsetted" dx="0" dy="2" />
            <feColorMatrix
              in="blur30"
              result="color-3-blur"
              type="matrix"
              values="1 0 0 0 0 0 0.611 0 0 0 0 0 0.392 0 0 0 0 0 1 0"
            />
            <feOffset in="color-3-blur" result="layer-3-offsetted" dx="0" dy="2" />
            <feColorMatrix
              in="blur30"
              result="color-4-blur"
              type="matrix"
              values="0.454 0 0 0 0 0 0.164 0 0 0 0 0 0 0 0 0 0 0 1 0"
            />
            <feOffset in="color-4-blur" result="layer-4-offsetted" dx="0" dy="16" />
            <feColorMatrix
              in="blur30"
              result="color-5-blur"
              type="matrix"
              values="0.423 0 0 0 0 0 0.196 0 0 0 0 0 0.113 0 0 0 0 0 1 0"
            />
            <feOffset in="color-5-blur" result="layer-5-offsetted" dx="0" dy="64" />
            <feColorMatrix
              in="blur30"
              result="color-6-blur"
              type="matrix"
              values="0.211 0 0 0 0 0 0.109 0 0 0 0 0 0.074 0 0 0 0 0 1 0"
            />
            <feOffset in="color-6-blur" result="layer-6-offsetted" dx="0" dy="64" />
            <feColorMatrix
              in="blur30"
              result="color-7-blur"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.68 0"
            />
            <feOffset in="color-7-blur" result="layer-7-offsetted" dx="0" dy="64" />
            <feMerge>
              <feMergeNode in="layer-0-offsetted" />
              <feMergeNode in="layer-1-offsetted" />
              <feMergeNode in="layer-2-offsetted" />
              <feMergeNode in="layer-3-offsetted" />
              <feMergeNode in="layer-4-offsetted" />
              <feMergeNode in="layer-5-offsetted" />
              <feMergeNode in="layer-6-offsetted" />
              <feMergeNode in="layer-7-offsetted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </>
  );
};
