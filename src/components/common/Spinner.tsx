import styled from "styled-components";
import MainIcon from "../../assets/images/mainIcon.png";

const LoadingContainer = styled.div`
  width: 100vw;
  height: 92vh;
  display: flex;
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

function Spinner() {
  return (
    <LoadingContainer>
      <MainIconImg src={MainIcon} alt='loading' />
    </LoadingContainer>
  );
}

export default Spinner;
