import React from "react";
import styled from "styled-components";

interface TimeCardProps {
  day: string;
  startTime: string;
  endTime: string;  
}

const Card = styled.div`
  width: 370px;
  height: 52px;
  background: #f7f7f7;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  font-family: "Inter", sans-serif;
`;

const DayText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #2b2b2b;
`;

const TimeText = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #1a2c42;
`;

const TimeCard: React.FC<TimeCardProps> = ({ day, startTime, endTime }) => {
  return (
    <Card>
      <DayText>{day}</DayText>
      <TimeText>{startTime} - {endTime}</TimeText>
    </Card>
  );
};

export default TimeCard;
