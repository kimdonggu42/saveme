import styled from "styled-components";
import MainIcon from "../../assets/images/mainIcon.png";
import { useRecoilValue } from "recoil";
import { isMapLoadingAtom } from "../../Recoil/atom";

const LoadingContainer = styled.div`
  width: 100vw;
  height: 92vh;
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

  @media screen and (max-width: 721px) {
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
  font-size: 25px;
  font-weight: 600;
  margin-top: 10px;
`;

function Spinner() {
  const isMapLoading = useRecoilValue<boolean>(isMapLoadingAtom);

  return (
    <LoadingContainer>
      <MainIconImg src={MainIcon} alt='loading' />
      {isMapLoading ? (
        <InfoText>현재 내 위치 정보를 불러오는 중이에요</InfoText>
      ) : (
        <InfoText>내 주변의 화장실 정보를 불러오는 중이에요</InfoText>
      )}
    </LoadingContainer>
  );
}

export default Spinner;