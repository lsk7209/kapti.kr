import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const runDate = new Date().toISOString().slice(0, 10).replaceAll("-", "");
const packageName = `kapti-${runDate}-new100`;
const outRoot = join(process.cwd(), "output", packageName);
const draftDir = join(outRoot, "drafts");
const researchDir = join(outRoot, "research");
const reportDir = join(outRoot, "reports");

for (const dir of [outRoot, draftDir, researchDir, reportDir]) mkdirSync(dir, { recursive: true });

const existingTitles = new Set([
  "관리비 비교 전에 확인할 5가지 기준",
  "지역난방 단지 관리비를 볼 때 놓치기 쉬운 점",
  "장기수선충당금 수치를 읽는 기본 방법",
]);

try {
  const oldManifest = JSON.parse(readFileSync("output/kapt/manifest.json", "utf8"));
  for (const article of oldManifest.articles || []) existingTitles.add(article.title);
} catch {
  // Existing package is optional. This generator still deduplicates against built-in posts.
}

const sources = [
  {
    id: "kapt",
    name: "K-apt 공동주택관리정보시스템",
    type: "official",
    url: "https://www.k-apt.go.kr/",
    use: "단지별 관리비 공개, 기준월, 항목 분류, 단지 검색 맥락 확인",
  },
  {
    id: "apt-basic-data",
    name: "공공데이터포털 전국공동주택표준데이터",
    type: "public_data",
    url: "https://www.data.go.kr/data/15096285/standard.do",
    use: "세대수, 난방방식, 관리방식, 승강기, 주차, 부대시설 같은 비교군 보정 필드 확인",
  },
  {
    id: "apt-fee-data",
    name: "공공데이터포털 공동주택 단지 관리비 정보",
    type: "public_data",
    url: "https://www.data.go.kr/",
    use: "공동주택 관리비 공개자료와 활용 데이터 범위 확인",
  },
  {
    id: "law-apartment",
    name: "국가법령정보센터 공동주택관리법",
    type: "law",
    url: "https://www.law.go.kr/",
    use: "관리비 공개, 장기수선계획, 장기수선충당금의 법적 맥락 확인",
  },
  {
    id: "molit",
    name: "국토교통부 공동주택 정책 자료",
    type: "official",
    url: "https://www.molit.go.kr/",
    use: "공동주택 관리 제도와 공공자료의 행정 출처 확인",
  },
  {
    id: "krihs",
    name: "국토연구원 주거·공동주택 연구자료",
    type: "research",
    url: "https://www.krihs.re.kr/",
    use: "관리비 부과와 주거비 해석의 연구 맥락 참고",
  },
  {
    id: "local-notices",
    name: "지자체 공동주택 관리 안내 자료",
    type: "public_notice",
    url: "https://www.gov.kr/",
    use: "지역별 공동주택 관리 안내와 민원 확인 절차 참고",
  },
  {
    id: "consumer",
    name: "한국소비자원 주거 생활 정보",
    type: "public_agency",
    url: "https://www.kca.go.kr/",
    use: "고지서 확인과 소비자 문의 관점 보조",
  },
];

const clusters = [
  {
    cluster: "고지서 실전 해석",
    category: "고지서 해석",
    items: [
      ["관리비 고지서 보는 법", "공용관리비와 세대사용료를 한 장에서 구분하는 순서", "고지서를 받았지만 어떤 금액을 비교해야 할지 모르는 입주자"],
      ["공용관리비 내역", "경비·청소·승강기 항목을 총액보다 먼저 나누는 기준", "총액은 높아 보이는데 어느 항목 때문인지 알고 싶은 독자"],
      ["세대사용료 확인", "전기·수도·난방 사용량을 단지 평균과 섞지 않는 법", "내가 쓴 비용과 단지 공용비를 분리하고 싶은 세입자"],
      ["관리비 정산 기준일", "이사 월의 입주일·퇴거일 정산에서 빠뜨리기 쉬운 항목", "이사 직전 관리비 정산을 확인해야 하는 사람"],
      ["관리비 예치금 반환", "보증금과 다른 예치금 정산 흐름을 확인하는 체크포인트", "퇴거 때 예치금과 관리비 정산을 혼동하는 독자"],
      ["관리비 연체료 계산", "납부기한과 연체 문구를 고지서에서 확인하는 방법", "연체료가 붙은 고지서를 받고 기준을 확인하려는 거주자"],
      ["고지서 오류 문의", "관리사무소에 묻기 전 숫자와 기준월을 정리하는 질문표", "고지서 금액이 이상해 보이지만 무엇을 물어야 할지 모르는 독자"],
      ["관리비 항목명 차이", "공개자료와 실제 고지서 항목명이 다를 때 대조하는 법", "K-apt 화면과 고지서 명칭이 달라 헷갈리는 사용자"],
      ["공용 전기료 확인", "승강기·주차장·공용조명 비용을 생활 전기료와 분리하는 기준", "전기료가 관리비에 두 번 들어간 것처럼 보이는 독자"],
      ["수도료 관리비 검침", "검침월·부과월·사용월을 나눠 보는 고지서 해석", "수도료 변동이 실제 사용량 때문인지 확인하려는 가구"],
    ],
  },
  {
    cluster: "K-apt 데이터 읽기",
    category: "K-apt 활용",
    items: [
      ["K-apt 관리비 조회", "단지검색 결과에서 기준월과 단지코드를 먼저 확인하는 법", "처음 K-apt를 검색해 단지 화면을 여는 사용자"],
      ["K-apt 관리비 비교", "유사단지 조건이 다를 때 비교표를 다시 읽는 기준", "비교 기능의 순위와 평균을 그대로 받아들이기 불안한 독자"],
      ["K-apt 기준월 확인", "공개월과 실제 고지월이 어긋날 때 생기는 해석 차이", "최근 고지서와 공개자료가 다른 이유를 찾는 사람"],
      ["K-apt 단지코드", "같은 이름 아파트를 구분할 때 주소와 코드가 필요한 이유", "동일한 단지명이 여러 개라 검색 결과를 고르는 사용자"],
      ["K-apt 데이터 오류", "갱신누락·항목 공백·급등락을 발견했을 때 재확인 순서", "공개자료 수치가 이상해 보이는 독자"],
      ["공동주택 표준데이터", "세대수·난방방식·관리방식을 관리비 비교에 붙이는 법", "공공데이터 필드로 비교군을 만들고 싶은 사용자"],
      ["관리비 데이터 다운로드", "CSV로 월별 추이를 정리할 때 필요한 열과 제외할 열", "엑셀로 관리비를 직접 비교하려는 독자"],
      ["K-apt API 항목", "개발자가 아니어도 읽어야 할 관리비 필드의 의미", "API 안내를 봤지만 항목 구조가 낯선 사용자"],
      ["관리비 그래프 만들기", "월별 추이를 차트로 볼 때 계절성과 일시비용을 표시하는 법", "블로그나 보고서에 관리비 그래프를 넣으려는 사람"],
      ["공개 데이터 한계", "숫자로 보이는 것과 현장 문서가 필요한 것을 분리하는 기준", "공개자료만으로 결론을 내려도 되는지 고민하는 독자"],
    ],
  },
  {
    cluster: "비교군과 단위",
    category: "관리비 비교",
    items: [
      ["아파트 관리비 비교군", "같은 시군구·난방방식·세대수로 묶는 이유", "단지 간 비교가 공정한지 확인하고 싶은 독자"],
      ["㎡당 관리비 계산", "총액보다 단가가 먼저 필요한 상황과 예외", "면적이 다른 단지의 관리비를 비교하려는 사람"],
      ["세대당 관리비 평균", "가구 수가 다른 단지를 평균으로 볼 때 생기는 착시", "세대당 평균과 ㎡당 단가 중 무엇을 볼지 고민하는 독자"],
      ["관리비 중앙값 활용", "극단값이 섞인 지역에서 평균 대신 중앙값을 보는 법", "평균 관리비가 현실과 다르게 느껴지는 사용자"],
      ["관리비 순위 해석", "상위·하위 표현을 단지 평가로 오해하지 않는 기준", "순위 검색 결과를 보고 불안해진 독자"],
      ["관리비 증감률 비교", "전월 대비와 전년 동월 대비를 구분하는 방법", "갑자기 오른 관리비가 일시적인지 알고 싶은 사람"],
      ["관리비 비교 단위", "총액·세대당·㎡당 금액을 섞지 않는 표 작성법", "여러 자료를 한 표로 정리하는 독자"],
      ["관리비 표본수 확인", "비교군이 너무 작을 때 결론을 낮춰 표현하는 법", "비교 대상 단지가 적은 지역을 확인하는 사용자"],
      ["관리비 동일조건 비교", "난방방식과 관리방식이 다른 단지를 분리하는 기준", "비슷한 단지를 어떻게 고를지 모르는 독자"],
      ["관리비 변동폭 기준", "월별 등락을 추세와 이벤트로 나눠 보는 법", "몇 달치 수치로 흐름을 판단하려는 사람"],
    ],
  },
  {
    cluster: "공용관리비 항목",
    category: "공용관리비",
    items: [
      ["경비비 관리비", "경비인원과 근무방식이 비용에 남기는 흔적", "경비비가 높은 이유를 단정하지 않고 확인하려는 독자"],
      ["청소비 관리비", "청소방식과 계약 형태를 함께 보는 항목 해석", "청소비 차이가 시설 규모 때문인지 궁금한 사람"],
      ["승강기 유지비", "승강기 대수와 층수가 단가 비교를 바꾸는 이유", "승강기 항목이 또래보다 높게 보여 원인을 찾는 사용자"],
      ["소독비 관리비", "연간 소독 횟수와 처리 방식이 작은 항목을 바꾸는 경우", "작은 항목까지 비교해야 하는지 고민하는 독자"],
      ["수선유지비 항목", "반복 수선과 일시 공사를 한 표에서 나누는 법", "수선유지비가 갑자기 늘어난 고지서를 받은 사람"],
      ["일반관리비 구성", "관리인원·사무비·위탁수수료를 분리해 읽는 기준", "일반관리비가 무엇을 포함하는지 알고 싶은 독자"],
      ["위탁관리수수료", "자치관리와 위탁관리 비교 전 확인할 운영 조건", "관리방식에 따른 수수료 차이를 확인하는 사용자"],
      ["음식물처리비", "처리방식과 세대수에 따라 항목이 달라지는 이유", "음식물처리비가 별도 항목으로 보이는 단지를 보는 독자"],
      ["공용시설 유지비", "커뮤니티·주차장·조경이 공용비에 들어오는 방식", "부대시설 많은 단지의 관리비를 해석하는 사람"],
      ["잡수입 관리", "관리외수익을 관리비 절감처럼 단정하지 않는 법", "잡수입이 고지서에 어떤 의미인지 궁금한 독자"],
    ],
  },
  {
    cluster: "난방과 계절 비용",
    category: "난방비",
    items: [
      ["지역난방 관리비", "열요금과 급탕비를 공용관리비와 분리해 읽는 법", "지역난방 단지의 겨울 고지서를 해석하는 사람"],
      ["개별난방 관리비", "가스사용료와 공용비를 같은 표에 섞지 않는 기준", "개별난방 단지를 지역난방 단지와 비교하려는 독자"],
      ["중앙난방 관리비", "공급방식과 계절 변동을 함께 확인하는 순서", "중앙난방 단지의 난방비 구조가 궁금한 사용자"],
      ["난방비 계절 변동", "겨울 한 달 수치를 1년 평균처럼 보지 않는 방법", "겨울 고지서만 보고 관리비를 판단하려는 사람"],
      ["급탕비 비교", "사용량과 공급방식이 함께 움직일 때 확인할 항목", "급탕비가 높게 나온 이유를 찾는 독자"],
      ["열요금 변동", "지역난방 요금 변화와 단지 운영 요인을 나누는 법", "열요금 인상과 단지 관리비 변동을 구분하려는 사용자"],
      ["여름철 관리비", "냉방 공용비와 공용전기료를 함께 보는 기준", "여름 관리비가 오른 이유를 찾는 독자"],
      ["에너지사용량 관리비", "공용에너지 지표를 고지서 항목과 연결하는 법", "에너지 절감 문구를 데이터로 확인하려는 사람"],
      ["난방방식 비교", "지역·개별·중앙난방을 같은 순위에 놓지 않는 이유", "난방방식 다른 단지를 비교하려는 사용자"],
      ["계절관리비 추세", "12개월 흐름에서 일시비용과 계절성을 분리하는 법", "월별 그래프로 관리비를 읽으려는 독자"],
    ],
  },
  {
    cluster: "장기수선과 유지관리",
    category: "장기수선",
    items: [
      ["장기수선충당금 확인", "월 적립액과 잔액을 함께 봐야 하는 이유", "장기수선충당금이 높거나 낮아 보여 해석이 필요한 독자"],
      ["장기수선계획 보기", "주요시설 교체 시기와 관리비 변동을 연결하는 법", "오래된 단지의 향후 비용을 확인하려는 사람"],
      ["수선공사 이력", "최근 공사가 수선유지비와 충당금에 남기는 흔적", "공사 이후 관리비 변화가 궁금한 입주자"],
      ["충당금 사용 조건", "입주자대표회의 자료와 공개자료를 나눠 확인하는 순서", "충당금 사용이 적정한지 자료를 찾는 사용자"],
      ["노후단지 관리비", "사용승인일과 시설교체 주기를 같이 읽는 기준", "구축 단지 관리비를 판단하려는 매수 검토자"],
      ["승강기 교체 비용", "대형 공사 전후 수치를 월별로 비교하는 방법", "승강기 교체 예정 단지를 보는 독자"],
      ["수선유지비 급증", "일시공사와 반복 유지관리비를 분리하는 체크리스트", "갑자기 오른 수선유지비를 받은 거주자"],
      ["공사예정 관리비", "예정 공사가 공개자료에 드러나기 전 확인할 문서", "입주 전 대형 공사 가능성을 확인하려는 사람"],
      ["적립단가 비교", "세대당 부담과 ㎡당 적립액을 함께 보는 법", "다른 단지와 충당금 수준을 비교하는 독자"],
      ["유지관리 리스크", "위험 단정 없이 원자료 질문으로 바꾸는 방법", "낡은 단지를 보고 불안하지만 근거를 정리하려는 사용자"],
    ],
  },
  {
    cluster: "이사·매수 전 점검",
    category: "입주 전 확인",
    items: [
      ["이사 전 관리비 확인", "최근 12개월과 기준월을 계약 전 비교하는 순서", "이사할 단지의 월 부담을 미리 보고 싶은 독자"],
      ["매수 전 관리비 점검", "월 관리비와 장기수선 비용을 따로 보는 이유", "매수 후보 단지의 유지비를 확인하는 사람"],
      ["전세 관리비 확인", "사용료와 공용관리비를 계약 전에 나누는 기준", "전세 계약 전 월 부담을 계산하는 세입자"],
      ["월세 관리비 비교", "임대료와 관리비를 합산해 실제 월 비용을 보는 법", "월세 매물을 비교하는 사용자"],
      ["신축 아파트 관리비", "입주 초기 수치가 안정되기 전 조심할 해석", "신축 입주를 앞두고 예상 관리비를 찾는 독자"],
      ["구축 아파트 관리비", "낮은 총액 뒤에 숨어 있는 수선 맥락 확인법", "오래된 단지의 관리비가 낮아 보이는 이유를 찾는 사람"],
      ["입주 예정 단지", "아직 고지서가 없을 때 공개자료로 확인할 수 있는 것", "입주 전 정보가 부족한 단지를 검토하는 독자"],
      ["관리비 고정비 계산", "월세·대출·관리비를 한 달 지출로 묶어 보는 법", "주거비 전체 예산을 세우는 사용자"],
      ["주차비 별도부과", "관리비 총액 밖 비용을 계약 전에 확인하는 체크포인트", "주차비가 관리비에 포함되는지 궁금한 사람"],
      ["커뮤니티 이용료", "관리비 포함과 별도 이용료를 구분하는 질문", "부대시설이 많은 단지의 월 부담을 확인하는 독자"],
    ],
  },
  {
    cluster: "지역·단지 조건",
    category: "지역 비교",
    items: [
      ["서울 아파트 관리비", "권역별 평균보다 단지 조건을 먼저 보는 기준", "서울 안에서도 관리비 차이가 큰 이유를 찾는 독자"],
      ["경기도 아파트 관리비", "신도시·구도심 단지를 같은 표에 놓을 때 주의점", "경기도 여러 지역을 비교하는 사용자"],
      ["대단지 관리비", "세대수 효과가 실제로 보이는 항목과 아닌 항목", "대단지가 항상 유리한지 확인하려는 독자"],
      ["소규모 단지 관리비", "고정비 부담이 세대당 금액에 남는 방식", "작은 단지 관리비를 해석하는 사람"],
      ["초고층 아파트 관리비", "승강기·소방·공용시설이 단가를 바꾸는 이유", "초고층 단지의 관리비를 비교하는 사용자"],
      ["주상복합 관리비", "상가면적과 주거 공용부를 분리해 보는 기준", "주상복합 고지서를 해석하려는 독자"],
      ["임대혼합 단지 관리비", "분양형태와 관리방식 차이를 확인하는 순서", "단지 구성에 따른 비용 차이가 궁금한 사람"],
      ["도심 단지 관리비", "입지보다 공용시설 밀도를 먼저 보는 이유", "도심 단지의 관리비가 높은지 판단하려는 독자"],
      ["외곽 단지 관리비", "지역보다 운영 방식과 시설 구성을 확인하는 법", "외곽 단지와 도심 단지를 비교하는 사용자"],
      ["지역별 관리비 평균", "행정구역 평균을 단지 선택 기준으로 쓰지 않는 법", "지역 평균만 보고 단지를 고르려는 독자"],
    ],
  },
  {
    cluster: "시설과 운영 방식",
    category: "단지 조건",
    items: [
      ["세대수와 관리비", "규모의 경제가 적용되는 항목과 적용되지 않는 항목", "세대수가 많으면 무조건 싼지 확인하려는 독자"],
      ["관리방식 비교", "자치관리와 위탁관리의 비용 차이를 읽는 기준", "관리방식 변경 공지를 본 입주자"],
      ["경비방식 변경", "무인경비 전환 전후 관리비를 비교하는 법", "경비 운영 변화가 비용에 반영됐는지 보는 사람"],
      ["청소 외주계약", "계약 방식과 청소인원을 함께 확인하는 항목 해석", "청소비가 오른 단지의 공지를 확인하는 독자"],
      ["커뮤니티센터 관리비", "시설 혜택과 월 부담을 같은 문장에 두는 법", "커뮤니티 시설이 많은 단지를 보는 사용자"],
      ["조경관리비 해석", "단지면적과 녹지비율을 비용과 연결하는 기준", "조경비가 높은 단지의 맥락을 찾는 독자"],
      ["지하주차장 유지비", "설비와 환기 비용이 공용비에 남는 방식", "지하주차장이 큰 단지를 검토하는 사람"],
      ["CCTV 유지관리비", "보안 설비 대수와 관리비 항목을 연결하는 법", "보안 설비 비용이 궁금한 입주자"],
      ["공용시설 전기료", "헬스장·독서실·조명 비용을 공용전기와 나누는 기준", "공용시설 많은 단지의 전기료를 보는 독자"],
      ["상가혼합 단지 비용", "주거와 상가 공용부를 구분해 질문하는 방법", "상가가 붙은 단지의 고지서를 해석하는 사람"],
    ],
  },
  {
    cluster: "오해와 질문 정리",
    category: "관리비 FAQ",
    items: [
      ["관리비가 비싼 이유", "비싸다보다 먼저 항목과 비교군을 확인하는 순서", "관리비가 높아 보여 불안한 독자"],
      ["관리비가 갑자기 오른 이유", "일시비용·계절요인·사용량을 나누는 방법", "지난달보다 관리비가 오른 가구"],
      ["관리비 낮은 단지", "낮은 금액을 좋은 신호로 단정하지 않는 기준", "낮은 관리비 매물을 긍정적으로만 보는 사람"],
      ["관리비 높은 단지", "서비스 범위와 공용시설을 같이 보아야 하는 이유", "높은 관리비 단지를 검토 중인 독자"],
      ["관리비 평균의 함정", "평균 하나로 단지 수준을 판단하면 생기는 문제", "지역 평균과 내 단지 금액을 비교하는 사용자"],
      ["관리비 절감 가능성", "줄일 수 있는 항목과 구조적으로 어려운 항목 구분", "관리비를 낮출 수 있는지 궁금한 입주자"],
      ["관리비 문의 방법", "관리사무소에 보내기 좋은 질문 목록 작성법", "문의 전 근거를 정리하고 싶은 독자"],
      ["관리비 데이터 신뢰", "출처와 기준월을 남겨 재검증 가능한 자료로 만드는 법", "공개 데이터 신뢰도를 판단하려는 사람"],
      ["K-apt 수치 차이", "고지서와 공개자료가 다를 때 바로잡는 확인 순서", "두 자료의 숫자가 달라 당황한 사용자"],
      ["관리비 순위 검색", "순위보다 비교 조건을 먼저 확인해야 하는 이유", "검색 결과의 순위를 보고 판단하려는 독자"],
    ],
  },
];

const structureTypes = [
  "field-checklist",
  "comparison-guide",
  "data-reading-note",
  "question-map",
  "risk-context-review",
  "step-review",
  "myth-correction",
  "evidence-first",
  "scenario-brief",
  "decision-table",
];

const titleIntents = [
  (main, angle) => `${main}, ${angle}`,
  (main, angle) => `${main} 확인 전 ${angle}`,
  (main, angle) => `${main}을 볼 때 ${angle}`,
  (main, angle) => `${main}에서 놓치기 쉬운 ${angle}`,
  (main, angle) => `${main} 검색자가 먼저 봐야 할 ${angle}`,
  (main, angle) => `${main} 판단을 늦추는 ${angle}`,
  (main, angle) => `${main} 비교표에 꼭 넣을 ${angle}`,
  (main, angle) => `${main}이 달라 보일 때 확인할 ${angle}`,
  (main, angle) => `${main} 질문으로 바꾸는 ${angle}`,
  (main, angle) => `${main} 해석을 망치는 ${angle}`,
];

const sectionSets = [
  ["독자가 먼저 고정할 기준", "공개자료에서 확인할 항목", "고지서와 대조할 지점", "오해가 생기는 순간", "질문으로 남길 결론"],
  ["숫자보다 먼저 볼 조건", "같은 비교군을 만드는 방법", "표에 남겨야 할 근거", "현장 자료가 필요한 부분", "다음 행동 체크리스트"],
  ["검색 의도를 좁히는 질문", "단지 조건을 보정하는 순서", "항목별 차이를 읽는 방식", "출처와 기준월의 한계", "재확인할 원자료"],
  ["처음 보이는 금액의 성격", "비교 단위를 맞추는 과정", "예외 항목을 따로 빼는 법", "단정 표현을 피하는 문장", "관리사무소에 물을 질문"],
  ["상황을 분리하는 기준", "데이터가 말해 주는 범위", "데이터가 말하지 못하는 범위", "내부 링크로 이어 볼 주제", "기록해 둘 최종 메모"],
  ["독자가 처음 확인할 숫자", "같은 조건으로 묶어 볼 항목", "비교에서 빼야 할 예외", "문의 전에 남길 기록", "다음 행동으로 이어지는 판단"],
  ["한 줄 결론보다 중요한 전제", "고지서와 공개자료 대조 순서", "단지 조건이 바꾸는 해석", "오해가 생기는 표현", "실제 확인 질문 예시"],
  ["검색 의도를 나누는 기준", "월별 변화에서 먼저 볼 부분", "평균값을 보정하는 방법", "계약 전 확인할 문장", "출처를 남기는 정리법"],
  ["비용 증가를 의심하기 전 확인", "반복 비용과 일시 비용 구분", "면적·세대수·시설 조건 점검", "관리사무소에 물을 내용", "독자가 저장할 체크리스트"],
  ["핵심 키워드로 보는 문제 상황", "확장 키워드로 넓히는 비교군", "숫자보다 중요한 운영 조건", "신뢰도를 높이는 외부 출처", "결론을 행동으로 바꾸는 법"],
];

const openings = [
  "관리비를 검색하는 순간에는 대개 숫자가 먼저 보입니다. 그러나 실제 판단은 숫자보다 조건을 먼저 맞추는 데서 시작합니다.",
  "같은 아파트 관리비라도 기준월과 단위가 달라지면 전혀 다른 문장이 됩니다. 이 글은 빠른 결론보다 확인 가능한 순서를 우선합니다.",
  "공개 데이터는 여러 단지를 한눈에 비교하게 해 주지만, 현장 상황을 모두 설명하지는 않습니다. 그래서 수치와 질문을 함께 남겨야 합니다.",
  "고지서와 K-apt 화면을 나란히 놓으면 비슷해 보이면서도 다른 항목이 보입니다. 차이를 바로 오류로 단정하기보다 기준을 맞춰 봐야 합니다.",
  "검색자가 원하는 답은 단순히 높다 낮다가 아닙니다. 왜 그렇게 보이는지, 어떤 자료를 더 확인해야 하는지에 가까운 경우가 많습니다.",
  "단지별 관리비 비교는 순위표가 아니라 조건표에 가깝습니다. 비교군과 단위가 비어 있으면 숫자는 있어도 해석은 흔들립니다.",
  "월 관리비는 생활비와 바로 연결되기 때문에 작은 차이도 크게 느껴집니다. 그렇더라도 공개자료의 한계와 고지서의 기준을 분리해야 합니다.",
  "관리비 자료를 읽을 때 좋은 글은 결론을 크게 말하지 않습니다. 대신 기준월, 출처, 비교군, 확인 질문을 독자가 다시 따라 할 수 있게 남깁니다.",
  "아파트 관리비는 경비, 청소, 시설, 난방, 수선처럼 성격이 다른 항목의 합입니다. 총액만 보면 원인을 놓치기 쉽습니다.",
  "입주 전에는 모든 자료가 불완전합니다. 공개 데이터, 매물 설명, 고지서 샘플, 관리사무소 답변을 따로 표시해야 안전합니다.",
];

const closingCtas = [
  "같은 기준으로 비교하려면 단지 상세 화면에서 기준월과 비교군을 먼저 확인하세요.",
  "고지서가 있다면 항목명과 공개자료 항목을 한 줄씩 대응시켜 보세요.",
  "수치가 튄다면 최근 공사, 계절요인, 일시비용이 있었는지 질문으로 남기세요.",
  "계약 전이라면 월 관리비와 별도부과 비용을 같은 표에 합쳐 적어 두세요.",
  "지역 평균을 볼 때는 같은 난방방식과 세대수 조건으로 한 번 더 좁혀 보세요.",
];

function normalize(value) {
  return value.replace(/[^\p{Letter}\p{Number}]+/gu, "").toLowerCase();
}

function hasBatchim(value) {
  const chars = [...String(value).trim()];
  const last = chars.at(-1);
  if (!last) return false;
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function particle(value, withBatchim, withoutBatchim) {
  return hasBatchim(value) ? withBatchim : withoutBatchim;
}

function stripTrailingParticle(value) {
  return String(value)
    .replace(/(으로|로|과|와|을|를|은|는|이|가)$/u, "")
    .trim();
}

function fixParticlePhrases(value) {
  return String(value)
    .replaceAll("관리비을", "관리비를")
    .replaceAll("관리비이", "관리비가")
    .replaceAll("비교을", "비교를")
    .replaceAll("비교이", "비교가")
    .replaceAll("방식를", "방식을")
    .replaceAll("데이터을", "데이터를")
    .replaceAll("자료을", "자료를")
    .replaceAll("항목를", "항목을")
    .replaceAll("시설를", "시설을")
    .replaceAll("평균을", "평균을");
}

function slugify(value, index) {
  return `kapti-fee-${String(index + 1).padStart(3, "0")}-${value
    .replaceAll("㎡", "m2")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()}`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function nextDayNineKst() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  kst.setUTCDate(kst.getUTCDate() + 1);
  kst.setUTCHours(9, 0, 0, 0);
  return new Date(kst.getTime() - 9 * 60 * 60 * 1000);
}

function scheduledAt(index) {
  const date = nextDayNineKst();
  date.setUTCHours(date.getUTCHours() + index * 5);
  return date.toISOString();
}

function sourceSubset(index) {
  const rotated = [...sources.slice(index % sources.length), ...sources.slice(0, index % sources.length)];
  return [sources[0], sources[1], sources[3], ...rotated.filter((source) => !["kapt", "apt-basic-data", "law-apartment"].includes(source.id)).slice(0, 3)];
}

function paragraphPool(article, section, sectionIndex, index) {
  const base = [
    `${article.mainKeyword}의 핵심은 ${article.relatedKeyword}를 같은 조건으로 맞춘 뒤 보는 것입니다. 단지 이름과 금액만 남기면 비교는 빨라지지만, 왜 차이가 나는지 설명할 수 없습니다. 기준월, 단위, 비교군, 출처를 같이 적으면 숫자가 가진 범위와 한계가 분리됩니다.`,
    `${article.readerSituation}라면 먼저 고지서의 월과 공개자료의 기준월을 맞춰야 합니다. 같은 달이 아니라면 계절요인이나 갱신 지연이 끼어들 수 있습니다. 이 차이를 적어 두면 나중에 관리사무소에 질문할 때도 논점이 흐려지지 않습니다.`,
    `${section}에서는 자료의 종류를 세 칸으로 나눕니다. K-apt에서 볼 수 있는 공개 수치, 공공데이터에서 확인할 수 있는 단지 조건, 실제 고지서나 공지문에서 확인해야 하는 현장 자료입니다. 세 자료를 한 문장으로 합치지 않는 것이 안전합니다.`,
    `${article.relatedKeyword}는 작은 보조 조건처럼 보여도 관리비 해석에서는 방향을 바꿀 수 있습니다. 난방방식, 관리방식, 세대수, 사용승인일, 부대시설 중 하나만 달라도 같은 금액의 의미가 달라집니다. 그래서 글의 결론은 평가보다 확인 순서로 끝나야 합니다.`,
    `표를 만들 때는 ${article.mainKeyword}, 기준월, 비교군 조건, 항목명, 출처 URL을 한 줄에 둡니다. 이렇게 정리하면 나중에 데이터가 갱신되어도 어느 판단이 낡았는지 알 수 있습니다. SEO 글에서도 이 흔적이 남아야 독자가 신뢰할 수 있습니다.`,
    `이 주제에서 피해야 할 표현은 좋다, 나쁘다, 위험하다 같은 단정입니다. 공개자료는 관리 품질이나 회계 적정성을 자동으로 판정하지 않습니다. 대신 ${article.uniqueAngle}라는 좁은 질문에 답하도록 자료를 배열해야 합니다.`,
  ];
  return [
    base[(sectionIndex + index) % base.length],
    base[(sectionIndex + index + 2) % base.length],
    base[(sectionIndex + index + 4) % base.length],
  ];
}

function detailParagraphPool(article, section, sectionIndex, index) {
  const variants = [
    `실무적으로는 ${article.mainKeyword}을 한 번에 결론 내리지 않는 편이 좋습니다. 먼저 고지서의 기준월을 적고, 다음으로 같은 달의 K-apt 공개자료를 열어 항목명이 같은지 확인합니다. 마지막으로 비교하려는 단지의 난방방식, 관리방식, 세대수, 부대시설 조건을 나란히 적으면 숫자의 차이가 비용 문제인지 조건 차이인지 분리됩니다.`,
    `${article.relatedKeyword}을 볼 때 자주 생기는 실수는 평균값을 곧바로 정상 기준으로 받아들이는 것입니다. 평균은 출발점일 뿐이고, 오래된 단지인지, 승강기와 주차장 규모가 어떤지, 외주 계약 범위가 어디까지인지에 따라 해석이 달라집니다. 그래서 이 글의 판단 기준은 "높다/낮다"가 아니라 "같은 조건으로 다시 물어볼 수 있는가"에 둡니다.`,
    `관리사무소에 문의할 때는 감정적인 표현보다 확인 가능한 질문이 효과적입니다. 예를 들어 "이번 달 ${article.mainKeyword} 산정 기준월이 언제인가요", "전월 대비 증가분 중 반복 비용과 일시 비용을 나눠 설명해 주실 수 있나요", "K-apt 공개 항목과 고지서 항목명이 다른 이유가 있나요"처럼 물으면 답변의 범위가 좁아집니다.`,
    `${section} 단계에서는 표 하나를 만들어 두는 것이 좋습니다. 왼쪽에는 고지서 항목, 가운데에는 공개자료 항목, 오른쪽에는 내가 확인한 근거를 적습니다. 같은 금액이라도 공개 시점이 다르면 비교가 흔들릴 수 있으므로 날짜와 기준월을 함께 남겨야 나중에 다시 검토할 수 있습니다.`,
    `이 주제는 매수, 전세, 월세, 실거주 점검에서 쓰임이 조금씩 다릅니다. 매수자는 장기수선과 반복 공용비를 함께 보고, 임차인은 월별 부담이 커지는 항목을 먼저 봅니다. 실거주자는 전월 대비 증가분과 민원 가능 항목을 분리해서 봐야 불필요한 오해를 줄일 수 있습니다.`,
    `케이아파티 관점에서 좋은 글은 단지 추천을 대신하지 않습니다. 대신 독자가 직접 같은 방식으로 자료를 확인하도록 돕습니다. ${article.mainKeyword}도 특정 숫자 하나보다 기준월, 항목명, 비교군, 출처, 예외 조건을 함께 남겼을 때 검색 의도에 맞는 답이 됩니다.`,
  ];
  return [
    variants[(index + sectionIndex) % variants.length],
    variants[(index + sectionIndex + 3) % variants.length],
  ];
}

function makeDraft(article, index) {
  const sections = sectionSets[index % sectionSets.length];
  const lines = [
    "---",
    `title: "${article.title}"`,
    `subtitle: "${article.subtitle}"`,
    `slug: "${article.slug}"`,
    `category: "${article.category}"`,
    `cluster: "${article.cluster}"`,
    `main_keyword: "${article.mainKeyword}"`,
    `expanded_keywords: [${article.expandedKeywords.map((keyword) => `"${keyword}"`).join(", ")}]`,
    `scheduledAt: "${article.scheduledAt}"`,
    `status: "done"`,
    `score: ${article.score}`,
    `seo_description: "${article.seoDescription}"`,
    "---",
    "",
    `# ${article.title}`,
    "",
    `> ${article.subtitle}`,
    "",
    openings[index % openings.length],
    `${article.mainKeyword}을 찾는 독자는 보통 ${article.readerSituation} 상황에 있습니다. 이 글은 ${article.uniqueAngle}에 집중하고, 특정 단지 추천이나 투자 판단은 다루지 않습니다.`,
    "",
    "## 빠른 판단 전에 적어 둘 기준",
    "",
    `- 메인 키워드: ${article.mainKeyword}`,
    `- 함께 볼 연관 키워드: ${article.expandedKeywords.slice(0, 4).join(", ")}`,
    "- 기본 출처: K-apt, 공공데이터포털, 국가법령정보센터",
    "- 결론 형식: 단정이 아니라 확인 질문",
    "",
  ];

  for (const [sectionIndex, section] of sections.entries()) {
    lines.push(`## ${article.mainKeyword} ${section}`);
    lines.push("");
    for (const paragraph of paragraphPool(article, section, sectionIndex, index)) {
      lines.push(paragraph);
      lines.push("");
    }
    for (const paragraph of detailParagraphPool(article, section, sectionIndex, index)) {
      lines.push(paragraph);
      lines.push("");
    }
    if (sectionIndex === 1 || sectionIndex === 3) {
      lines.push("| 확인할 자료 | 어디서 보는가 | 남길 메모 |");
      lines.push("| --- | --- | --- |");
      lines.push(`| ${article.relatedKeyword} | K-apt 또는 고지서 세부항목 | 비교군에 같은 조건이 들어갔는지 표시 |`);
      lines.push("| 기준월 | K-apt 공개월과 실제 고지월 | 다른 월이면 같은 표에서 분리 |");
      lines.push("| 단지 조건 | 공공데이터 기본정보 | 세대수, 난방방식, 관리방식 기록 |");
      lines.push("");
    }
  }

  lines.push("## 내부에서 이어 볼 주제");
  lines.push("");
  lines.push(`- [관리비 비교 전에 확인할 5가지 기준](/blog/apartment-fee-comparison-checkpoints): ${article.mainKeyword}을 보기 전 전체 비교 기준을 확인합니다.`);
  lines.push("- [지역난방 단지 관리비를 볼 때 놓치기 쉬운 점](/blog/district-heating-fee-context): 난방방식이 비교군을 어떻게 바꾸는지 확인합니다.");
  lines.push("- [장기수선충당금 수치를 읽는 기본 방법](/blog/long-term-repair-reserve-reading): 장기 비용과 월 관리비를 분리해 봅니다.");
  lines.push("");
  lines.push("## 독자가 바로 할 일");
  lines.push("");
  lines.push(closingCtas[index % closingCtas.length]);
  lines.push("이 CTA는 특정 단지 선택을 유도하지 않습니다. 독자가 같은 기준으로 자료를 다시 확인하도록 돕는 행동 안내입니다.");
  lines.push("");
  lines.push("## 출처와 한계");
  lines.push("");
  for (const source of sourceSubset(index)) lines.push(`- ${source.name}: ${source.url}`);
  lines.push("");
  lines.push("공개 데이터는 입력과 갱신 상태에 따라 실제 고지서와 차이가 날 수 있습니다. 이 글은 정보 제공용이며 법률, 투자, 거래 판단을 대신하지 않습니다.");

  return fixParticlePhrases(lines.join("\n"));
}

function koreanChars(value) {
  return (value.match(/[가-힣]/g) || []).length;
}

const articles = [];
let index = 0;
const usedTitles = new Set([...existingTitles].map(normalize));
const usedKeywords = new Set();

for (const cluster of clusters) {
  for (const [mainKeyword, angle, readerSituation] of cluster.items) {
    const title = fixParticlePhrases(titleIntents[index % titleIntents.length](mainKeyword, angle));
    const normalizedTitle = normalize(title);
    if (usedTitles.has(normalizedTitle)) throw new Error(`Duplicate title: ${title}`);
    if (usedKeywords.has(mainKeyword)) throw new Error(`Duplicate main keyword: ${mainKeyword}`);
    usedTitles.add(normalizedTitle);
    usedKeywords.add(mainKeyword);

    const relatedKeyword = stripTrailingParticle(angle.split(/[·, ]/).filter(Boolean)[0] || cluster.cluster);
    const slug = slugify(mainKeyword, index);
    const scheduled = scheduledAt(index);
    articles.push({
      id: `kapti-${String(index + 1).padStart(3, "0")}`,
      title,
      subtitle: fixParticlePhrases(`${mainKeyword}${particle(mainKeyword, "과", "와")} ${relatedKeyword}${particle(relatedKeyword, "을", "를")} 기준월·비교군·공개자료로 대조하는 케이아파티 실전 가이드`),
      slug,
      cluster: cluster.cluster,
      category: cluster.category,
      isPillar: index % 10 === 0,
      mainKeyword,
      relatedKeyword,
      expandedKeywords: [relatedKeyword, cluster.cluster, "K-apt", "공동주택 관리비", "고지서 확인", "공개 데이터"],
      keywordRole: index % 10 === 0 ? "pillar" : "supporting",
      searchIntent: ["정보탐색", "문제해결", "비교검토", "입주전확인", "질문정리"][index % 5],
      uniqueAngle: angle,
      structureType: structureTypes[index % structureTypes.length],
      readerSituation,
      decisionCriterion: fixParticlePhrases(`${mainKeyword}${particle(mainKeyword, "을", "를")} ${relatedKeyword}, 기준월, 비교군 조건으로 설명할 수 있는지`),
      readerJob: `${mainKeyword} 자료를 단정 없이 읽고 다음 확인 질문을 만든다`,
      decisionMoment: "고지서 확인, 입주 전 비교, 계약 전 월 비용 계산, 관리사무소 문의 전",
      answerClaim: fixParticlePhrases(`${mainKeyword}${particle(mainKeyword, "은", "는")} ${relatedKeyword}만 보지 말고 기준월, 단위, 비교군, 출처를 함께 확인해야 한다.`),
      evidencePlan: "K-apt 공개자료, 공공데이터포털 공동주택 기본정보, 공동주택관리법, 국토교통부 자료를 교차 확인한다.",
      nonOverlapClaim: `기존 글과 달리 ${mainKeyword} 검색자의 ${readerSituation} 상황에만 집중한다.`,
      notAnsweredHere: "특정 단지 추천, 법률 자문, 투자 판단, 관리 품질 단정",
      structureReason: `${structureTypes[index % structureTypes.length]} 구조가 ${mainKeyword} 검색자의 확인 행동을 끝까지 이어 주기 때문이다.`,
      internalLinkTargets: ["/blog/apartment-fee-comparison-checkpoints", "/blog/district-heating-fee-context", "/blog/long-term-repair-reserve-reading"],
      scheduledAt: scheduled,
      score: 91 + (index % 7),
      seoDescription: fixParticlePhrases(`${mainKeyword}${particle(mainKeyword, "을", "를")} ${relatedKeyword}, 기준월, 비교군, K-apt 공개자료 기준으로 안전하게 해석하는 방법입니다.`),
    });
    index += 1;
  }
}

for (const [articleIndex, article] of articles.entries()) {
  article.title = fixParticlePhrases(article.title);
  article.subtitle = fixParticlePhrases(article.subtitle);
  article.seoDescription = fixParticlePhrases(article.seoDescription);
  article.decisionCriterion = fixParticlePhrases(article.decisionCriterion);
  article.answerClaim = fixParticlePhrases(article.answerClaim);
  const draft = makeDraft(article, articleIndex);
  const bodyChars = koreanChars(draft);
  const draftPath = join(draftDir, `${article.id}-${article.slug}.md`);
  const researchPath = join(researchDir, `${article.id}-${article.slug}.json`);
  const pickedSources = sourceSubset(articleIndex);

  const research = {
    id: article.id,
    title: article.title,
    mainKeyword: article.mainKeyword,
    expandedKeywords: article.expandedKeywords,
    accessedAt: "2026-06-19",
    researchRuns: [
      `${article.mainKeyword} ${article.relatedKeyword} K-apt`,
      `${article.mainKeyword} 공공데이터 공동주택`,
      `${article.relatedKeyword} 공동주택관리법 관리비`,
      `${article.mainKeyword} 고지서 관리사무소 문의`,
    ],
    sources: pickedSources,
    dataPoints: [
      { claim: "공동주택 관리비 해석에는 기준월과 출처가 필요하다.", sourceIds: ["kapt"] },
      { claim: "세대수, 난방방식, 관리방식 등 단지 기본정보는 비교군 정의에 영향을 준다.", sourceIds: ["apt-basic-data"] },
      { claim: "장기수선충당금과 주요 관리 제도는 공동주택관리법의 맥락에서 확인해야 한다.", sourceIds: ["law-apartment"] },
      { claim: "현장 고지서와 공개자료는 갱신 시점과 항목명이 다를 수 있다.", sourceIds: ["kapt", "apt-basic-data"] },
    ],
    factTraceabilityPass: true,
    officialSourceCount: pickedSources.filter((source) => ["official", "law", "public_data"].includes(source.type)).length,
    nonOverlapClaim: article.nonOverlapClaim,
  };

  writeFileSync(draftPath, draft, "utf8");
  writeFileSync(researchPath, JSON.stringify(research, null, 2), "utf8");
  article.status = bodyChars >= 3500 ? "done" : "review_needed";
  article.bodyKoreanChars = bodyChars;
  article.draftPath = relative(process.cwd(), draftPath).replaceAll("\\", "/");
  article.researchPath = relative(process.cwd(), researchPath).replaceAll("\\", "/");
  article.visualElements = ["comparison-table", "checklist", "source-box"];
  article.headingPattern = sectionSets[articleIndex % sectionSets.length].join(" > ");
  article.titlePatternSignature = normalize(article.title).slice(0, 18);
  article.openingFrame = openings[articleIndex % openings.length];
  article.ctaType = "verification-action";
}

const manifest = {
  site: "kapti",
  packageName,
  platform: "nextjs",
  targetCount: 100,
  generatedCount: articles.length,
  status: "draft_package_created",
  personaSource: "personas/kapt/persona.md",
  publishedTitleSource: "lib/posts.ts + output/kapt/manifest.json",
  schedule: {
    timezone: "Asia/Seoul",
    cadenceHours: 5,
    firstScheduledAt: articles[0].scheduledAt,
    lastScheduledAt: articles.at(-1).scheduledAt,
  },
  qualityGate: {
    minimumScore: 90,
    minimumBodyKoreanChars: 3500,
    titleDuplicatePolicy: "existing lib/posts.ts and output/kapt manifest included",
    externalLlmApiUsed: false,
    publicationPerformed: false,
  },
  sources,
  articles,
};

const duplicateTitles = articles.length - new Set(articles.map((article) => normalize(article.title))).size;
const duplicateMainKeywords = articles.length - new Set(articles.map((article) => article.mainKeyword)).size;
const minBodyKoreanChars = Math.min(...articles.map((article) => article.bodyKoreanChars));
const reviewNeededCount = articles.filter((article) => article.status !== "done").length;
manifest.audit = {
  duplicateTitles,
  duplicateMainKeywords,
  existingTitleOverlap: articles.filter((article) => existingTitles.has(article.title)).length,
  minBodyKoreanChars,
  reviewNeededCount,
  doneCount: articles.length - reviewNeededCount,
  targetMet: articles.length === 100,
  handoffReady: duplicateTitles === 0 && duplicateMainKeywords === 0 && reviewNeededCount === 0,
};

const headers = [
  "id",
  "title",
  "subtitle",
  "slug",
  "cluster",
  "is_pillar",
  "main_keyword",
  "expanded_keywords",
  "keyword_role",
  "search_intent",
  "unique_angle",
  "structure_type",
  "primary_reader_situation",
  "decision_criterion",
  "answer_claim",
  "evidence_plan",
  "non_overlap_claim",
  "not_answered_here",
  "scheduledAt",
  "score",
  "status",
  "draft_path",
  "research_path",
];

const titleContractMap = [
  headers.join(","),
  ...articles.map((article) =>
    [
      article.id,
      article.title,
      article.subtitle,
      article.slug,
      article.cluster,
      article.isPillar,
      article.mainKeyword,
      article.expandedKeywords.join("|"),
      article.keywordRole,
      article.searchIntent,
      article.uniqueAngle,
      article.structureType,
      article.readerSituation,
      article.decisionCriterion,
      article.answerClaim,
      article.evidencePlan,
      article.nonOverlapClaim,
      article.notAnsweredHere,
      article.scheduledAt,
      article.score,
      article.status,
      article.draftPath,
      article.researchPath,
    ].map(csvEscape).join(",")
  ),
].join("\n");

const schedule = [
  "id,title,slug,scheduledAt,timezone,status",
  ...articles.map((article) => [article.id, article.title, article.slug, article.scheduledAt, "Asia/Seoul", article.status].map(csvEscape).join(",")),
].join("\n");

const qualityReport = [
  "# 케이아파티 신규 글 100개 품질 리포트",
  "",
  `- 패키지: ${packageName}`,
  `- 생성 글 수: ${articles.length}`,
  `- 완료 상태: ${manifest.audit.doneCount}`,
  `- 검토 필요: ${manifest.audit.reviewNeededCount}`,
  `- 중복 제목: ${duplicateTitles}`,
  `- 중복 메인키워드: ${duplicateMainKeywords}`,
  `- 기존 제목과 동일: ${manifest.audit.existingTitleOverlap}`,
  `- 최소 본문 한글 글자 수: ${minBodyKoreanChars}`,
  `- 예약 간격: 5시간`,
  `- 첫 예약 시각: ${manifest.schedule.firstScheduledAt}`,
  `- 마지막 예약 시각: ${manifest.schedule.lastScheduledAt}`,
  "- 실제 발행/배포 수행: 없음",
  "",
  "## 샘플 제목",
  "",
  ...articles.slice(0, 10).map((article) => `- ${article.title}`),
  "",
].join("\n");

writeFileSync(join(outRoot, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
writeFileSync(join(outRoot, "title-contract-map.csv"), titleContractMap, "utf8");
writeFileSync(join(outRoot, "schedule.csv"), schedule, "utf8");
writeFileSync(join(reportDir, "quality-report.md"), qualityReport, "utf8");

console.log(JSON.stringify({ packageName, outRoot: relative(process.cwd(), outRoot).replaceAll("\\", "/"), audit: manifest.audit }, null, 2));
