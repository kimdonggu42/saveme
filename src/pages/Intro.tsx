import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import mainImg from "../assets/images/mainImg.png";

export default function Intro() {
  const navigate = useNavigate();

  const moveMapPage = () => {
    navigate("/map");
  };

  return (
    <IntroContainer>
      <MainWrapper>
        <MainTitle>
          save<span>me</span>
        </MainTitle>
        <SubTitle>
          별도의 검색 필요없이 바로
          <br />내 주변의 화장실을 찾아보세요.
        </SubTitle>
        <OuttetMoveMapBtn onClick={moveMapPage}>
          <p className='btnText'>내 주변의 화장실 찾기</p>
          <InnerMoveMapBtn>
            <p className='btnText2'>GO!</p>
          </InnerMoveMapBtn>
        </OuttetMoveMapBtn>
      </MainWrapper>
      <PhoneImgWrapper className='test'>
        <img src={mainImg} alt='메인 페이지 모바일 이미지' />
      </PhoneImgWrapper>
    </IntroContainer>
  );
}

const IntroContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 70px;
  height: 100vh;
  background-color: #2e87ec;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
`;

const MainTitle = styled.div`
  color: white;
  font-size: 100px;
  line-height: 1;

  > span {
    font-weight: 600;
  }
`;

const SubTitle = styled.div`
  margin-right: 120px;
  color: white;
  font-size: 17px;
`;

const InnerMoveMapBtn = styled.div`
  position: relative;
  width: 200px;
  height: 50px;
  margin-top: -39px;
  background: #55b290;
  left: -250px;
  transition: 0.3s;

  > .btnText2 {
    padding-top: 11px;
    font-size: 19px;
    font-weight: 700;
    margin-right: -130px;
    color: white;
  }
`;

const OuttetMoveMapBtn = styled.button`
  background: white;
  width: 330px;
  height: 50px;
  overflow: hidden;
  transition: 0.2s;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  > .btnText {
    margin-top: 10px;
    font-size: 19px;
    font-weight: 700;
    color: #1e2236;
    transition: 0.3s;
  }

  &:hover .btnText {
    margin-left: 65px;
  }

  &:hover ${InnerMoveMapBtn} {
    left: -130px;
  }
  &:hover ${IntroContainer} {
    background-color: white;
  }
`;

const PhoneImgWrapper = styled.div`
  display: flex;
  justify-content: center;

  > img {
    width: 400px;
    height: 540px;
  }

  @media screen and (max-width: 900px) {
    display: none;
  }
`;
