import styled from "styled-components";

const HeaderContainer = styled.header`
  height: 70px;
`;

function Header() {
  return (
    <HeaderContainer>
      <h2>save me!</h2>
    </HeaderContainer>
  );
}

export default Header;
