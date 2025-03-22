# saveme

### 급할 때 바로 찾는 서울시 공공화장실 위치 안내 서비스

saveme는 사용자의 위치를 기반으로 빠르게 주변 화장실 정보를 제공하는 웹 서비스입니다. Naver Map API와 서울 열린데이터 광장의 공공화장실 데이터를 활용하여 가장 가까운 화장실을 안내합니다.

🔗 [**saveme 바로가기**](https://saveme-restroom.com)

<img width="100%" alt="스크린샷 2025-03-22 오후 12 41 31" src="https://github.com/user-attachments/assets/563b0656-1690-4051-aeae-8c22d7849728" />

## 💡 기능 및 특징

### 1. 내 위치 기반 화장실 찾기

- 현재 내 위치를 확인한 후, 가장 가까운 화장실들을 안내해주며 각 화장실까지의 거리도 함께 확인할 수 있습니다.

![Mar-22-2025 12-55-43](https://github.com/user-attachments/assets/00a2d185-74bd-4f32-b219-4374d40c3888)

### 2. 원하는 장소 검색하기

- 내 위치가 아닌 다른 장소 주변의 화장실이 필요할 땐, 주소를 검색해 해당 위치 주변의 화장실 정보를 확인할 수 있습니다.

![Mar-22-2025 12-57-24](https://github.com/user-attachments/assets/05734a39-ebd4-4559-bf17-82f201f94b6f)

### 3. 다양한 지도 보기 옵션

- 일반 지도뿐 아니라 지형도나 위성 지도로 전환하여 볼 수 있으며, 파노라마 기능을 통해 화장실 주변 환경도 미리 확인할 수 있습니다.

![Mar-22-2025 13-00-05](https://github.com/user-attachments/assets/d54b7f4b-8534-4fb3-9270-d5810075d65e)

## 📆 개발 기간

- MVP 개발: 2023. 05 ~ 2023. 06

- 추가 기능 개발 및 성능 개선: 2025. 02 ~ 2025. 03

## 💻 개발 환경

<img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white" />

- Naver Map API와 공공데이터 API를 활용해 지도 기능 및 데이터 통신을 구현하면서, 정적 타입 체크를 통해 API 응답과 지도 객체들의 구조를 명확하게 정의함으로써 런타임 오류를 예방하고 안정적인 데이터 처리를 보장할 수 있었습니다.

<img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />

- Next.js를 선택한 첫 번째 이유는 프로젝트에서 사용한 공공데이터 API가 HTTP 프로토콜만 지원되어 HTTPS 환경의 브라우저에서 직접 호출 시 보안상의 Mixed Content 에러를 발생시키는 문제가 있었습니다. 이를 해결하기 위해 Next.js의 서버 컴포넌트를 활용하여 서버 측에서 API를 호출하고, 그 결과를 HTTPS를 통해 클라이언트로 전달하는 방식을 채택했습니다. 이를 통해 브라우저 환경의 보안 제약을 우회하고, 안정적으로 데이터를 호출하고자 했습니다.

- 두 번째 이유는 성능 개선입니다. 공공데이터가 약 5천 개에 달해 브라우저 렌더링 후 클라이언트 측에서 매번 API를 호출하면 지도 위의 마커를 표시하는 데 시간이 오래 걸렸습니다. 이를 개선하기 위해 ISR(Incremental Static Regeneration)을 활용해 서버에서 데이터를 미리 가져와 정적 페이지로 생성하고, 일정 주기마다만 데이터를 갱신하도록 하여 빠른 렌더링과 효율적인 캐싱을 구현하고자 했습니다. 특히 공공데이터는 자주 변경되지 않는 특성을 가지고 있어 ISR이 적합한 해결책이라고 판단했습니다.

<img src="https://img.shields.io/badge/-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />

- Tailwind CSS는 Next.js 환경에서 복잡한 추가 설정 없이 바로 사용할 수 있기 때문에 선택했습니다. styled components는 SSR 환경에서 사용하기 위해 컴파일러 설정과 전역 스타일 레지스트리 구성 등 초기 설정이 필요한 반면, Tailwind는 런타임에 스타일시트를 생성하지 않고 빌드 타임에 스타일시트를 가져오는 방식으로 작동하기 때문에, SSR 환경에서도 안정적으로 동작한다는 장점이 있습니다.

<img src="https://img.shields.io/badge/-shadcn%20UI-111827?style=for-the-badge&logo=&logoColor=white" />

- shadcn UI를 선택한 이유는 컴포넌트의 코드를 직접 가져와 사용하는 방식 덕분에 원하는 대로 자유롭게 커스터마이징할 수 있기 때문입니다. 이전에 사용했던 MUI의 경우 세부적인 스타일 변경이 쉽지 않아 불편했는데, shadcn UI는 이러한 제약 없이 자유로운 조정이 가능하다는 점이 큰 장점이었습니다. 또한 Tailwind를 사용하는 점도 개발 과정에서 효율성과 편리성을 높여주었습니다.

## 🗂️ 개발 히스토리

<p align="center">
  <a href="https://velog.io/@donggoo/%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%A7%80%EB%8F%84-api%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-%EC%A7%80%EB%8F%84-%EB%A7%8C%EB%93%A4%EA%B8%B0" target="_blank" rel="noopener noreferrer">
    <img width="49.7%" src="https://velog-readme-stats.vercel.app/api?name=donggoo&slug=기능-구현-네이버-지도-api를-이용하여-지도-만들기" />
  </a>

  <a href="https://velog.io/@donggoo/%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0-%EC%9E%AC%EA%B7%80%EC%A0%81%EC%9C%BC%EB%A1%9C-API-%ED%98%B8%EC%B6%9C%ED%95%98%EA%B8%B0" target="_blank" rel="noopener noreferrer">
    <img width="49.7%" src="https://velog-readme-stats.vercel.app/api?name=donggoo&slug=문제-해결-재귀적으로-API-호출하기" />
  </a>

  <a href="https://velog.io/@donggoo/%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0-un6ynbcv" target="_blank" rel="noopener noreferrer">
    <img width="49.7%" src="https://velog-readme-stats.vercel.app/api?name=donggoo&slug=문제-해결-un6ynbcv" />
  </a>

  <a href="https://velog.io/@donggoo/%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0-Mixed-content-%EC%97%90%EB%9F%AC" target="_blank" rel="noopener noreferrer">
    <img width="49.7%" src="https://velog-readme-stats.vercel.app/api?name=donggoo&slug=문제-해결-Mixed-content-에러" />
  </a>
</p>
