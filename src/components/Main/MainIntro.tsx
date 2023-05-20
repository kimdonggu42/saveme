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
  width: 400px;
  padding: 20px;
  margin-right: 20px;
  /* border: 1px solid red; */

  > :not(:second-child) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
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
`;

const MoveMapBtn = styled.button`
  color: #2a2c32;
  font-size: 19px;
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
  margin-left: 20px;
  /* border: 1px solid red; */

  > img {
    width: 400px;
    height: 540px;
  }

  @media screen and (max-width: 900px) {
    display: none;
  }
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
          바로 내 주변의 화장실을 찾아보세요.
        </SubTitle>
        <Link to='Main'>
          <MoveMapBtn>내 주변의 화장실 찾기</MoveMapBtn>
        </Link>
      </MainWrapper>
      <PhoneImgWrapper>
        <img src={mainImg} alt='메인 페이지 모바일 이미지' />
      </PhoneImgWrapper>
    </IntroContainer>
  );
}

export default MainIntro;
