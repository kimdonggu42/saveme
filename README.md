<h1>
  <span>saveme</span>
</h1>

<br/>
<div  align="center">
  <img width="60%" src="https://github.com/kimdonggu42/save-me/assets/115632555/2aadd648-b8e1-4557-9f16-80ec0cdb70f7" alt="ipillu-logo">
</div>
</br>

## 프로젝트 소개

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
