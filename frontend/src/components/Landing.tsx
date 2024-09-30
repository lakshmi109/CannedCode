/** Import necessary libraries */
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/** Constants */
const SERVICE_URL = "http://localhost:3000";

/** Styled components */
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

/** Component */
export const Landing = () => {
    const [language, setLanguage] = useState("node-js");
    const [userId, setuserId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return (
      <Container>
        <Title>Canned Code</Title>
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
    );
}
