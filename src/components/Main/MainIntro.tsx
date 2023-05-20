import styled from "styled-components";
import { Link } from "react-router-dom";
import mainImg from "../../assets/images/mainImg.png";

const IntroContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2e87ec;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 450px;
`;

const MainTitle = styled.div`
  color: white;
  font-size: 100px;

  > span {
    font-weight: 600;
  }
`;

const SubTitle = styled.div`
  margin-top: 20px;
  color: white;
  font-size: 17px;
  margin-left: -90px;
`;

const MoveMapBtn = styled.button`
  color: #2a2c32;
  font-size: 20px;
  font-weight: 700;
  margin-top: 30px;
  width: 330px;
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #f1f3f5;
  }
`;

const PhoneImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 500px;
  height: 600px;
`;

function MainIntro() {
  return (
    <IntroContainer>
      <MainWrapper>
        <MainTitle>
          save<span>me</span>
        </MainTitle>
        <SubTitle>
          별도의 검색 필요없이 <br />
          바로 내 주위의 화장실을 찾아보세요.
        </SubTitle>
        <Link to='Main'>
          <MoveMapBtn>주위의 화장실 찾아보기</MoveMapBtn>
        </Link>
      </MainWrapper>
      <PhoneImgWrapper>
        <img src={mainImg} alt='메인 페이지 모바일 이미지' />
      </PhoneImgWrapper>
    </IntroContainer>
  );
}

export default MainIntro;
