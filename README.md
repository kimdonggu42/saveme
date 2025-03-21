# 🚽 saveme

### 급할 때 바로 찾는 서울시 공공화장실 위치 안내 서비스

- [saveme(바로가기)](https://saveme-restroom.com/)는 사용자의 위치를 기반으로 빠르게 주변 화장실 정보를 제공하는 웹 서비스입니다. Naver Map API와 서울 열린데이터 광장의 공공화장실 데이터를 활용하여 가장 가까운 화장실을 안내합니다.

<img width="100%" alt="main image" src="https://github.com/user-attachments/assets/cf02d473-e70c-4277-bca4-6f0277148429" />

## 기능 및 특징

### 내 위치 기반 화장실 찾기

- 현재 내 위치를 확인한 후, 가장 가까운 화장실들을 안내해주며 각 화장실까지의 거리도 함께 확인할 수 있습니다.

### 원하는 장소 검색하기

- 내 위치가 아닌 다른 장소 주변의 화장실이 필요할 땐, 주소를 검색해 해당 위치 주변의 화장실 정보를 확인할 수 있습니다.

### 다양한 지도 보기 옵션

- 일반 지도뿐 아니라 지형도나 위성 지도로 전환하여 볼 수 있으며, 파노라마 기능을 통해 화장실 주변 환경도 미리 확인할 수 있습니다.

## 개발 환경

<img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"/>

<img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>

- Next.js를 선택한 첫 번째 이유는 프로젝트에서 사용한 공공데이터 API가 HTTP 프로토콜만 지원되어 HTTPS 환경의 브라우저에서 직접 호출 시 보안상의 Mixed Content 에러를 발생시키는 문제가 있었습니다. 이를 해결하기 위해 Next.js의 서버 컴포넌트를 활용하여 서버 측에서 API를 호출하고, 그 결과를 HTTPS를 통해 클라이언트로 전달하는 방식을 채택했습니다. 이를 통해 브라우저 환경의 보안 제약을 우회하고, 안정적으로 데이터를 호출하고자 했습니다.

- 두 번째 이유는 성능 개선입니다. 공공데이터가 약 5천 개에 달해 브라우저 렌더링 후 클라이언트 측에서 매번 API를 호출하면 지도 위의 마커를 표시하는 데 시간이 오래 걸렸습니다. 이를 개선하기 위해 ISR(Incremental Static Regeneration)을 활용해 서버에서 데이터를 미리 가져와 정적 페이지로 생성하고, 일정 주기마다만 데이터를 갱신하도록 하여 빠른 렌더링과 효율적인 캐싱을 구현하고자 했습니다. 특히 공공데이터는 자주 변경되지 않는 특성을 가지고 있어 ISR이 적합한 해결책이라고 판단했습니다.

<img src="https://img.shields.io/badge/-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white"/>

- Tailwind CSS는 Next.js 환경에서 복잡한 추가 설정 없이 바로 사용할 수 있기 때문에 선택했습니다. styled components는 SSR 환경에서 사용하기 위해 컴파일러 설정과 전역 스타일 레지스트리 구성 등 초기 설정이 필요한 반면, Tailwind는 런타임에 스타일시트를 생성하지 않고 빌드 타임에 스타일시트를 가져오는 방식으로 작동하기 때문에, SSR 환경에서도 안정적으로 동작한다는 장점이 있습니다.

<img src="https://img.shields.io/badge/-shadcn%20UI-111827?style=for-the-badge&logo=&logoColor=white"/>

- shadcn UI를 선택한 이유는 컴포넌트의 코드를 직접 가져와 사용하는 방식 덕분에 원하는 대로 자유롭게 커스터마이징할 수 있기 때문입니다. 이전에 사용했던 MUI의 경우 세부적인 스타일 변경이 쉽지 않아 불편했는데, shadcn UI는 이러한 제약 없이 자유로운 조정이 가능하다는 점이 큰 장점이었습니다. 또한 Tailwind를 사용하는 점도 개발 과정에서 효율성과 편리성을 높여주었습니다.

# 구버전

- **saveme는 검색 필요없이 바로 내 주변의 공공화장실을 찾을 수 있는 서비스입니다.**

- 진행 기간 : 2023.05 ~ 2023.06

- 배포 링크 : [https://save-me-bd34d.web.app/](https://save-me-bd34d.web.app/)

- [서울 열린데이터 광장 활용사례(갤러리) > saveme](https://data.seoul.go.kr/dataVisual/gallery/galleryView.do?bbsCd=10005&seq=4c72e2e003d527921170806b1d757cb9&ditcCd=WEB&ver=1)

<br>

## 개발 환경

### Developement

<img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"/> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white"> <img src="https://img.shields.io/badge/REACT-61DAFB?style=for-the-badge&logo=REACT&logoColor=black"> <img src="https://img.shields.io/badge/REACT ROUTER-CA4245?style=for-the-badge&logo=REACT ROUTER&logoColor=white"> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=white"> <img src="https://img.shields.io/badge/Naver Maps API-03C75A?style=for-the-badge&logo=Naver&logoColor=white">

### Styling

<img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white">

<br>

## 실행 방법

- 이 프로젝트는 Naver Maps API와 서울시 공공 데이터를 활용하고 있습니다. 로컬 환경에서의 원활한 실행을 위해 `.env` 파일에서 `REACT_APP_API_KEY = 발급받은 key`와 같이 설정해주어야 합니다.

- `REACT_APP_NAVER_MAP_API_KEY`에는 발급 받으신 네이버 지도 API key를 설정해주세요.

- `REACT_APP_SEOUL_PUBLIC_API_KEY`에는 서울 열린데이터 광장에서 발급받으신 key를 설정해주세요.

```
$ git clone git@github.com:kimdonggu42/saveme.git

$ npm install

$ npm start
```

<br>

## 디렉토리 구조

```
📦 src
 ┣ 📂 assets
 ┃ ┣ 📂 images
 ┃ ┗ 📂 style
 ┣ 📂 components
 ┣ 📂 hooks
 ┣ 📂 pages
 ┣ 📂 recoil
 ┣ 📂 util
 ┣ 📜 App.tsx
 ┗ 📜 index.tsx
```

<br>

## 개발 내용

### 1. 지도 및 마커 생성

- Naver Maps API를 사용하여 현재 사용자의 위치를 중심으로 하는 지도 및 마커 생성했습니다.

- 약 5000개의 데이터를 불러와 현재 내 위치와 화장실 위치까지의 거리를 계산해 가장 가까운 100개의 화장실만 필터링하여 보여주도록 했습니다.

### 2. 마커 렌더링 최적화

- 성능 저하를 방지하기 위해 각 마커에 현재 보이는 화면에 들어와 있는지 판단하는 이벤트를 등록하여 지도 범위에 올라와 있는 마커만 렌더링 되도록 개선했습니다.

### 3. UX 사용성 개선

- 현재 사용자가 있는 위치 정보 요청과 화장실 위치 데이터 요청 상태를 분리하여 현재 어떤 데이터를 불러오고 있는지 사용자가 인지할 수 있도록 개선

<br>

## 시연 영상

|                                                      **메인화면**                                                      |                                                      **로딩화면**                                                      |
| :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| <img width="100%" src="https://github.com/kimdonggu42/save-me/assets/115632555/15eb758c-8a99-4232-9400-d5df04caa98b"/> | <img width="100%" src="https://github.com/kimdonggu42/save-me/assets/115632555/b4037b91-4926-4c9f-b77c-18538de8fab1"/> |
|                                                        **지도**                                                        |                                                  **현재 위치로 이동**                                                  |
| <img width="100%" src="https://github.com/kimdonggu42/save-me/assets/115632555/55678aed-8c78-4011-82e2-f7f130b92608"/> | <img width="100%" src="https://github.com/kimdonggu42/save-me/assets/115632555/13db9f1d-b8fd-4c49-b921-f06085217d43"/> |
