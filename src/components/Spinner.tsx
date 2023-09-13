import styled from "styled-components";
import MainIcon from "../assets/images/mainIcon.png";
import { LocationLoadingProps } from "../util/type";

export default function Spinner({ locationLoading }: LocationLoadingProps) {
  return (
    <LoadingContainer>
      <MainIconImg src={MainIcon} alt='loading' />
      {locationLoading ? (
        <InfoText>현재 내 위치를 찾고 있어요</InfoText>
      ) : (
        <InfoText>
          <div>내 주변의 화장실을 찾고 있어요</div>
          <div>잠시만 기다려주세요</div>
        </InfoText>
      )}
    </LoadingContainer>
  );
}

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const MainIconImg = styled.img`
  width: 250px;
  height: 250px;
  margin-bottom: 30px;
  animation: shake 1.5s infinite;

  @media screen and (max-width: 700px) {
    width: 150px;
    height: 150px;
  }

  @keyframes shake {
    0% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(10deg);
    }
  }
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 25px;
  font-weight: 600;
  margin-top: 10px;

  @media screen and (max-width: 700px) {
    font-size: 20px;
  }
`;
