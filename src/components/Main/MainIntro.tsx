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
`;

const InnerMoveMapBtn = styled.div`
  position: relative;
  width: 200px;
  height: 50px;
  margin-top: -37px;
  background: #55b290;
  left: -250px;
  transition: 0.3s;

  > .btnText2 {
    padding-top: 13px;
    font-size: 19px;
    font-weight: 700;
    margin-right: -130px;
    color: white;
  }
`;

const OuttetMoveMapBtn = styled.button`
  background: white;
  /* margin-top: 30px; */
  width: 330px;
  height: 50px;
  overflow: hidden;
  transition: 0.2s;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  > .btnText {
    margin-top: 13px;
    font-size: 19px;
    font-weight: 700;
    color: #2a2c32;
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

const MainTitle = styled.div`
  color: white;
  font-size: 100px;

  > span {
    font-weight: 600;
  }
`;

const SubTitle = styled.div`
  margin: 15px 0 30px 0;
  color: white;
  font-size: 17px;
  margin-right: 120px;
`;

const PhoneImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 20px;

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
          별도의 검색 필요없이 바로
          <br />내 주변의 화장실을 찾아보세요.
        </SubTitle>
        <Link to='Main'>
          <OuttetMoveMapBtn>
            <p className='btnText'>내 주변의 화장실 찾기</p>
            <InnerMoveMapBtn>
              <p className='btnText2'>GO!</p>
            </InnerMoveMapBtn>
          </OuttetMoveMapBtn>
        </Link>
      </MainWrapper>
      <PhoneImgWrapper className='test'>
        <img src={mainImg} alt='메인 페이지 모바일 이미지' />
      </PhoneImgWrapper>
    </IntroContainer>
  );
}

export default MainIntro;
