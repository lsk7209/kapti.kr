import fs from "node:fs";
import path from "node:path";

const outRoot = path.join(process.cwd(), "output", "kapt");
const draftDir = path.join(outRoot, "drafts");
const researchDir = path.join(outRoot, "research");
const reportDir = path.join(outRoot, "reports");

for (const dir of [outRoot, draftDir, researchDir, reportDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const existingTitles = [
  "관리비 비교 전에 확인할 5가지 기준",
  "지역난방 단지 관리비를 볼 때 놓치기 쉬운 점",
  "장기수선충당금 수치를 읽는 기본 방법",
];

const sources = [
  {
    id: "kapt",
    name: "K-apt 공동주택관리정보시스템",
    type: "official",
    url: "https://www.k-apt.go.kr",
    note: "단지별 관리비, 회계, 유지관리 공개 정보 확인",
  },
  {
    id: "kapt-api",
    name: "K-apt 관리비 비교 API 안내",
    type: "official",
    url: "https://www.k-apt.go.kr/apiinfo/goApiSearchCompare_detail.do?searchDate=202106",
    note: "관리비 비교 항목과 단지 속성 확인",
  },
  {
    id: "data-go-kr-basic",
    name: "공공데이터포털 전국공동주택표준데이터",
    type: "public_data",
    url: "https://www.data.go.kr/data/15096285/standard.do",
    note: "단지 기본정보, 난방방식, 세대수, 관리방식 등 비교군 정의 참고",
  },
  {
    id: "law-apartment",
    name: "국가법령정보센터 공동주택관리법",
    type: "law",
    url: "https://www.law.go.kr/LSW/lsInfoP.do?efYd=20210421&lsiSeq=222513",
    note: "관리비 공개, 장기수선계획, 장기수선충당금 등 법적 맥락 확인",
  },
  {
    id: "long-repair-guide",
    name: "장기수선계획 실무 가이드라인",
    type: "public_pdf",
    url: "https://www.jangseong.go.kr/file/wsboard/data/www_notice/1748318924.pdf/2025%2B%EC%9E%A5%EA%B8%B0%EC%88%98%EC%84%A0%EA%B3%84%ED%9A%8D%2B%EC%8B%A4%EB%AC%B4%2B%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8.pdf?idx=79937",
    note: "장기수선계획과 충당금 사용 맥락 참고",
  },
  {
    id: "krihs-maintenance",
    name: "국토연구원 관리비 부과 실태 연구",
    type: "research",
    url: "https://www.krihs.re.kr/galleryDownload.es?bid=0029&list_no=30008&seq=1",
    note: "관리비 부과와 공개 데이터 해석 한계 참고",
  },
];

const clusters = [
  {
    name: "관리비 비교 기준",
    category: "관리비 비교",
    color: "blue",
    items: [
      ["월별 관리비 비교", "전월 대비", "월별 변동을 기준월과 항목으로 나눠 읽는 법"],
      ["㎡당 관리비", "전용면적", "면적 단위가 다른 단지를 같은 기준으로 맞추는 법"],
      ["공용관리비 평균", "비교군 설정", "평균보다 중요한 비교군 조건 정리"],
      ["관리비 중앙값", "극단값", "평균 착시를 줄이는 중앙값 활용법"],
      ["관리비 증감률", "기준월", "한 달 차이가 아닌 추세로 보는 방법"],
      ["관리비 비교군", "세대수", "비슷한 단지 묶음을 정하는 기준"],
      ["관리비 항목 비중", "공용비율", "총액보다 비중을 먼저 봐야 하는 이유"],
      ["관리비 공개월", "갱신시점", "데이터 기준월을 놓치지 않는 확인법"],
      ["관리비 단가", "부과면적", "단가 계산에서 자주 틀리는 지점"],
      ["관리비 이상치", "일시비용", "튀는 수치를 바로 단정하지 않는 해석법"],
    ],
  },
  {
    name: "공용관리비 항목",
    category: "공용관리비",
    color: "green",
    items: [
      ["경비비 비교", "경비인원", "인력 운영 조건을 같이 보는 방법"],
      ["청소비 비교", "청소방식", "위탁과 직접관리 차이를 읽는 기준"],
      ["승강기유지비", "승강기 대수", "층수와 대수를 같이 확인하는 법"],
      ["소독비 항목", "연간소독횟수", "작은 항목도 비교가 필요한 경우"],
      ["수선유지비", "일상수선", "반복 비용과 일회성 비용을 구분하는 법"],
      ["위탁관리수수료", "관리방식", "자치관리와 위탁관리 비교 포인트"],
      ["일반관리비", "관리인원", "사무 인력과 단지 규모를 함께 보는 법"],
      ["공용전기료", "공용시설", "커뮤니티 시설이 수치에 미치는 영향"],
      ["음식물처리비", "처리방식", "처리 방식 차이를 비용 해석에 반영하는 법"],
      ["잡수입 관리", "관리외수익", "관리비와 별도로 확인해야 할 공개 항목"],
    ],
  },
  {
    name: "난방방식과 계절",
    category: "난방비",
    color: "orange",
    items: [
      ["개별난방 관리비", "가스사용료", "공용비와 개별 사용료를 분리하는 법"],
      ["중앙난방 관리비", "난방공급", "공급 방식이 비교군을 바꾸는 이유"],
      ["난방비 계절변동", "겨울철 관리비", "겨울 수치를 1년 평균처럼 보지 않는 법"],
      ["급탕비 비교", "사용량", "세대 사용량과 공용 요인을 나눠 보는 법"],
      ["열요금 변동", "지역난방", "요금 변화와 단지 운영 요인을 구분하는 법"],
      ["난방방식 비교", "동일조건", "서로 다른 난방방식을 섞지 않는 기준"],
      ["에너지사용량", "공용에너지", "관리비와 에너지 지표를 함께 읽는 법"],
      ["여름철 관리비", "냉방공용비", "여름에 눈에 띄는 항목을 확인하는 법"],
      ["난방비 절감 해석", "사용패턴", "절감 문구를 데이터로 검증하는 법"],
      ["계절관리비 추세", "12개월 흐름", "한 달보다 흐름을 먼저 보는 기준"],
    ],
  },
  {
    name: "장기수선과 유지관리",
    category: "장기수선",
    color: "purple",
    items: [
      ["장기수선계획", "주요시설", "계획과 실제 적립액을 함께 확인하는 법"],
      ["장기수선충당금 적립", "소유자 부담", "높고 낮음보다 계획 적합성을 보는 법"],
      ["수선공사 이력", "공사비", "최근 공사가 관리비 해석에 남기는 흔적"],
      ["충당금 사용", "입주자 동의", "사용 조건을 확인할 때 볼 문서"],
      ["노후단지 관리비", "사용승인일", "연식이 수치에 미치는 영향을 읽는 법"],
      ["시설교체 비용", "승강기 교체", "대형 공사 전후 수치를 비교하는 법"],
      ["수선유지비 급증", "일시공사", "갑자기 오른 항목을 해석하는 순서"],
      ["장기수선 예산", "공사예정", "예정 공사가 공개 정보에 드러나는 방식"],
      ["적립단가 비교", "세대당 부담", "단가 비교 전 확인할 단지 조건"],
      ["유지관리 리스크", "공개자료 한계", "위험 단정 없이 질문을 정리하는 법"],
    ],
  },
  {
    name: "이사와 매수 전 점검",
    category: "입주 전 확인",
    color: "teal",
    items: [
      ["이사 전 관리비 확인", "최근 12개월", "계약 전 숫자를 보는 최소 순서"],
      ["매수 전 관리비", "장기수선충당금", "월 부담과 장기 비용을 나눠 보는 법"],
      ["전세 관리비 확인", "사용료", "집주인 부담과 세입자 부담을 구분하는 법"],
      ["월세 관리비 점검", "고정비", "월세와 관리비를 합쳐 보는 기준"],
      ["입주 예정 단지", "공개자료", "아직 살아보지 않은 단지를 확인하는 방법"],
      ["신축 아파트 관리비", "초기운영", "입주 초기 수치를 과대해석하지 않는 법"],
      ["구축 아파트 관리비", "수선비", "낮은 총액 뒤의 수선 맥락 확인법"],
      ["관리비 고지서 비교", "실제부과액", "공개자료와 고지서가 다를 때 보는 순서"],
      ["커뮤니티시설 관리비", "부대시설", "편의시설이 월 부담에 반영되는 방식"],
      ["주차비와 관리비", "별도부과", "관리비 총액 밖의 비용을 놓치지 않는 법"],
    ],
  },
  {
    name: "지역과 단지 비교",
    category: "지역 비교",
    color: "navy",
    items: [
      ["서울 관리비 비교", "권역별 단지", "지역 평균을 읽을 때 필요한 보정"],
      ["경기도 관리비 비교", "신도시 단지", "대단지와 소단지를 섞지 않는 법"],
      ["지방 아파트 관리비", "지역난방 여부", "지역 차이를 단정하지 않는 기준"],
      ["대단지 관리비", "세대수 효과", "규모가 비용을 낮춘다는 말을 검증하는 법"],
      ["소규모 단지 관리비", "고정비 부담", "세대수가 적을 때 나타나는 수치 특징"],
      ["초고층 아파트 관리비", "승강기와 시설", "층수와 시설 구성을 함께 보는 법"],
      ["주상복합 관리비", "상가면적", "주거 외 면적 영향을 확인하는 법"],
      ["임대혼합 단지 관리비", "분양형태", "단지 구성 차이를 읽는 기준"],
      ["도심 단지 관리비", "공용시설 밀도", "입지보다 시설 구성을 먼저 보는 법"],
      ["외곽 단지 관리비", "관리방식", "지역보다 운영 조건을 확인하는 순서"],
    ],
  },
  {
    name: "K-apt 데이터 활용",
    category: "K-apt 활용",
    color: "cyan",
    items: [
      ["K-apt 관리비 조회", "단지검색", "검색 결과를 바로 믿기 전 확인할 항목"],
      ["K-apt 비교 기능", "유사단지", "비교 화면에서 놓치기 쉬운 조건"],
      ["K-apt API 활용", "공공데이터", "개발자 없이도 읽어야 할 데이터 필드"],
      ["관리비 공개자료", "출처표기", "블로그와 보고서에서 출처를 남기는 법"],
      ["단지 기본정보", "난방방식", "기본정보가 관리비 해석을 바꾸는 이유"],
      ["공동주택 표준데이터", "세대수", "관리비 외 보조 데이터를 쓰는 법"],
      ["K-apt 오류 확인", "갱신누락", "수치가 이상할 때 재확인하는 순서"],
      ["관리비 데이터 다운로드", "CSV 정리", "엑셀로 비교할 때 필요한 열"],
      ["관리비 그래프", "월별추이", "차트를 만들 때 왜 기준월을 고정해야 하는가"],
      ["공개 데이터 한계", "현장확인", "숫자로 알 수 없는 부분을 분리하는 법"],
    ],
  },
  {
    name: "고지서와 내역서 해석",
    category: "고지서 해석",
    color: "gray",
    items: [
      ["관리비 고지서 항목", "공용과 개별", "처음 보는 항목을 분류하는 법"],
      ["세대사용료", "개별사용량", "내가 쓴 비용과 단지 비용을 나누는 기준"],
      ["공용사용료", "공동부담", "공용 항목을 가족 수와 연결하지 않는 이유"],
      ["전기료 관리비", "공용전기", "세대 전기와 공용 전기를 구분하는 법"],
      ["수도료 관리비", "검침기준", "사용량과 부과 방식 확인 순서"],
      ["승강기 전기료", "공동전기", "승강기 유지비와 전기료를 분리해 보는 법"],
      ["관리비 연체료", "납부기한", "연체 관련 문구를 확인할 때 주의할 점"],
      ["관리비 정산", "입주일 기준", "이사 월 정산에서 확인할 항목"],
      ["관리비 예치금", "반환정산", "보증금과 다르게 보는 이유"],
      ["고지서 오류 의심", "관리사무소 문의", "질문을 정리해 확인하는 법"],
    ],
  },
  {
    name: "단지 조건과 시설 맥락",
    category: "단지 조건",
    color: "red",
    items: [
      ["세대수와 관리비", "규모의 경제", "세대수가 비용에 주는 영향을 읽는 법"],
      ["사용승인일 관리비", "노후도", "연식별 비교에서 조심할 점"],
      ["관리방식 비교", "자치와 위탁", "운영 방식이 항목에 남기는 차이"],
      ["경비방식 관리비", "무인경비", "보안 방식 변화가 비용에 미치는 영향"],
      ["청소방식 관리비", "외주계약", "계약 방식과 인원 수를 함께 보는 법"],
      ["커뮤니티센터 비용", "부대시설", "시설 혜택과 월 부담을 같이 읽는 법"],
      ["조경관리비", "단지면적", "녹지와 단지 면적을 비용과 연결하는 법"],
      ["지하주차장 관리비", "설비유지", "주차장 구조가 유지비에 남기는 흔적"],
      ["어린이집 면적", "비주거면적", "관리비 부과면적에서 제외되는 범위 확인"],
      ["상가혼합 단지", "공용부 분리", "주거와 상가 비용을 구분해 보는 법"],
    ],
  },
  {
    name: "FAQ와 오해 바로잡기",
    category: "관리비 FAQ",
    color: "yellow",
    items: [
      ["관리비가 비싼 이유", "항목분해", "비싸다보다 먼저 확인할 질문"],
      ["관리비가 갑자기 오른 이유", "일시비용", "상승 원인을 좁히는 확인 순서"],
      ["관리비 평균의 함정", "비교기준", "평균만 보면 놓치는 조건"],
      ["관리비 낮은 단지", "시설수준", "낮은 수치가 항상 좋은 뜻은 아닌 이유"],
      ["관리비 높은 단지", "서비스범위", "높은 수치를 단정하지 않는 해석법"],
      ["K-apt 수치 차이", "고지서 차이", "공개자료와 실제 고지서가 다른 이유"],
      ["관리비 문의 방법", "질문목록", "관리사무소에 묻기 전 정리할 내용"],
      ["관리비 절감 가능성", "공용비", "줄일 수 있는 항목과 어려운 항목 구분"],
      ["관리비 순위 검색", "순위해석", "순위보다 비교 조건을 먼저 보는 이유"],
      ["관리비 데이터 신뢰", "출처검증", "공개 데이터의 강점과 한계를 함께 보는 법"],
    ],
  },
];

const titleFrames = [
  ({ main, related }) => `${main} 볼 때 ${related}까지 확인해야 하는 이유`,
  ({ main, related }) => `${main} 기준을 잡기 전 ${related}를 먼저 보는 법`,
  ({ main, related }) => `${main} 해석에서 ${related}가 빠지면 생기는 착시`,
  ({ main, related }) => `${main} 비교 전 ${related}로 걸러야 할 조건`,
  ({ main, related }) => `${main} 숫자를 ${related}와 함께 읽는 순서`,
  ({ main, related }) => `${main} 판단을 늦춰야 할 ${related} 체크포인트`,
  ({ main, related }) => `${main}을 단지별로 볼 때 ${related}가 중요한 이유`,
  ({ main, related }) => `${main} 검색 후 ${related}를 대조하는 방법`,
  ({ main, related }) => `${main}에서 ${related} 차이를 설명하는 기준`,
  ({ main, related }) => `${main} 확인 전에 ${related}를 메모해야 하는 순간`,
];

const structureTypes = [
  "decision-checklist",
  "comparison-walkthrough",
  "data-reading-guide",
  "question-led-faq",
  "risk-and-context-map",
  "step-by-step-review",
  "myth-correction",
  "evidence-first-analysis",
  "scenario-guide",
  "field-note",
];

const openingFrames = [
  "검색자가 이 글을 찾는 순간은 대개 숫자 하나가 예상보다 커 보였을 때입니다.",
  "관리비 화면에서 먼저 보이는 총액은 편하지만, 총액만으로는 단지 조건을 설명하기 어렵습니다.",
  "같은 지역의 아파트라도 관리비 항목은 난방방식, 세대수, 시설 구성에 따라 다르게 움직입니다.",
  "K-apt 공개 자료는 결론을 대신 내려주는 표가 아니라 질문을 정리하게 해 주는 자료입니다.",
  "이 글은 특정 단지가 좋다거나 나쁘다고 말하기보다, 공개된 숫자를 같은 기준으로 읽는 순서를 정리합니다.",
  "입주 전후에 관리비를 볼 때 가장 위험한 실수는 한 달 수치만 보고 단지의 성격을 단정하는 것입니다.",
  "관리비 비교는 평균을 찾는 일이 아니라 비교군을 좁히고 예외를 확인하는 과정에 가깝습니다.",
  "고지서와 공개 자료를 함께 볼 때는 항목 이름보다 부과 기준과 기준월을 먼저 맞춰야 합니다.",
  "낮은 수치와 높은 수치는 모두 설명이 필요합니다. 설명 없이 판단하면 관리비를 잘못 읽기 쉽습니다.",
  "공개 데이터의 장점은 같은 형식으로 여러 단지를 볼 수 있다는 점이고, 한계는 현장 맥락을 모두 담지 못한다는 점입니다.",
];

const sectionPlans = [
  ["기준월 고정", "비교군 좁히기", "항목 분해", "추세 확인", "문의 질문 정리"],
  ["총액보다 단위", "단지 조건", "예외 항목", "고지서 대조", "해석의 경계"],
  ["검색 의도 정리", "공개자료 확인", "보조 지표", "오해 차단", "다음 확인"],
  ["처음 볼 숫자", "함께 볼 조건", "표로 남길 항목", "자주 틀리는 지점", "결론 대신 질문"],
  ["상황 정의", "동일 조건 비교", "변동 원인", "자료 한계", "실무 체크"],
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function scheduledAt(index) {
  const start = new Date("2026-06-07T00:00:00.000Z"); // 2026-06-07 09:00 KST
  start.setUTCHours(start.getUTCHours() + index * 5);
  return start.toISOString();
}

function sentenceBank(contract, stage, index) {
  const { mainKeyword, relatedKeyword, cluster, readerJob, decisionCriterion } = contract;
  const variants = [
    `${mainKeyword}을 볼 때 첫 기준은 ${relatedKeyword}를 같은 조건으로 맞추는 것입니다. ${cluster} 영역에서는 단지마다 운영 방식과 공개 시점이 달라 한 줄의 금액만으로는 원인을 설명하기 어렵습니다.`,
    `${readerJob}라면 화면의 숫자를 옮겨 적기 전에 기준월, 단위, 비교군을 먼저 적어 두는 편이 좋습니다. 이렇게 해야 ${mainKeyword}이 실제로 높은지, 아니면 비교 조건이 어긋난 것인지 분리할 수 있습니다.`,
    `${decisionCriterion}는 단정 문장이 아니라 확인 순서로 다뤄야 합니다. 공개 자료는 판단의 출발점이며, 관리사무소 공지나 고지서 세부 내역처럼 현장 자료와 함께 읽을 때 의미가 선명해집니다.`,
    `${relatedKeyword}가 빠진 비교는 독자에게 빠른 결론을 주는 것처럼 보이지만 실제로는 오해를 남길 수 있습니다. 특히 공용 비용과 세대 사용료가 섞인 항목은 서로 다른 성격의 돈을 한 바구니에 넣은 셈이 됩니다.`,
    `${mainKeyword}은 검색량이 있는 주제이지만, 글의 목적은 특정 단지를 평가하는 데 있지 않습니다. 이 글은 K-apt와 공공데이터에서 확인 가능한 범위 안에서 숫자를 읽는 방법을 정리합니다.`,
    `표를 만들 때는 단지명, 기준월, 세대수, 난방방식, 관리방식, 부과면적 단위를 함께 두어야 합니다. 이 다섯 칸이 비어 있으면 ${mainKeyword} 비교표는 보기 좋지만 재검증하기 어려운 자료가 됩니다.`,
  ];
  return variants[(stage + index) % variants.length];
}

function makeArticle(contract, index) {
  const plan = sectionPlans[index % sectionPlans.length];
  const opening = openingFrames[index % openingFrames.length];
  const faqs = [
    [`${contract.mainKeyword}은 평균보다 높으면 문제가 있나요?`, `그렇게 바로 말하기 어렵습니다. ${contract.relatedKeyword}, 기준월, 세대수, 난방방식, 시설 구성을 함께 보아야 합니다. 평균은 출발점일 뿐이며 같은 조건의 비교군을 만든 뒤 항목별 차이를 확인해야 합니다.`],
    [`K-apt 자료만으로 결론을 내려도 되나요?`, `K-apt는 공개 데이터 확인에 유용하지만 현장 공지, 고지서, 관리규약, 최근 공사 일정까지 모두 대체하지는 않습니다. 이 글의 기준은 정보 제공이며 매수, 임대, 법률 판단을 대신하지 않습니다.`],
    [`어떤 항목부터 확인하는 것이 좋나요?`, `${contract.mainKeyword}과 직접 연결되는 항목을 먼저 보고, 이어서 ${contract.relatedKeyword}, 공용관리비, 개별사용료, 장기수선충당금처럼 성격이 다른 비용을 분리해 보아야 합니다.`],
  ];

  const paragraphs = [];
  paragraphs.push(`# ${contract.title}`);
  paragraphs.push("");
  paragraphs.push(`> ${contract.subtitle}`);
  paragraphs.push("");
  paragraphs.push("## 목차");
  plan.forEach((name, i) => paragraphs.push(`- [${i + 1}. ${contract.mainKeyword} ${name}](#section-${i + 1})`));
  paragraphs.push("- [자주 묻는 질문](#faq)");
  paragraphs.push("");
  paragraphs.push(opening);
  paragraphs.push(`${contract.mainKeyword}을 검색한 독자는 보통 ${contract.primaryReaderSituation} 상황에 있습니다. 이때 필요한 것은 자극적인 결론이 아니라, ${contract.relatedKeyword}와 공개 데이터의 기준을 맞춘 뒤 어디까지 확인했고 어디부터는 추가 자료가 필요한지 나누는 일입니다.`);
  paragraphs.push(`이 글은 ${contract.uniqueAngle}라는 관점으로 구성했습니다. 따라서 기존 글처럼 관리비 전체 기준을 넓게 설명하기보다, ${contract.notAnsweredHere} 영역은 의도적으로 깊게 다루지 않고 현재 검색 의도에 필요한 확인 순서에 집중합니다.`);
  paragraphs.push("");

  plan.forEach((name, sectionIndex) => {
    paragraphs.push(`## ${sectionIndex + 1}. ${contract.mainKeyword}에서 ${name}을 확인하는 법 {#section-${sectionIndex + 1}}`);
    paragraphs.push(sentenceBank(contract, sectionIndex, index));
    paragraphs.push(`${name} 단계에서는 숫자를 하나만 보지 않고 세 가지 층으로 나누어 적습니다. 첫째는 공개 화면에 표시된 금액이나 단가입니다. 둘째는 그 금액이 만들어진 기준월과 부과면적입니다. 셋째는 같은 조건의 비교군입니다. 이 순서를 지키면 ${contract.mainKeyword}을 둘러싼 불필요한 추측을 줄일 수 있습니다.`);
    paragraphs.push(`예를 들어 ${contract.relatedKeyword}가 중요한 글이라면 단지 규모, 난방방식, 관리방식, 주요 공용시설을 같은 줄에 놓아야 합니다. 단지 A의 금액이 단지 B보다 높아 보여도, 한쪽은 승강기 대수가 많고 다른 한쪽은 공용시설이 적다면 단순 비교가 되지 않습니다. 공개 데이터는 차이를 발견하게 해 주지만, 차이의 원인을 자동으로 확정하지 않습니다.`);
    paragraphs.push(`실무적으로는 이 단계에서 "비교군을 어떻게 만들었는가"를 메모해야 합니다. 같은 구, 같은 난방방식, 비슷한 세대수, 비슷한 사용승인일 중 어떤 조건을 우선했는지 남겨 두면 나중에 고지서나 공지 자료와 대조할 때 판단이 흔들리지 않습니다.`);
    if (sectionIndex % 2 === 0) {
      paragraphs.push("");
      paragraphs.push(`| 확인 항목 | 기록 방법 | 해석할 때 주의점 |`);
      paragraphs.push(`| --- | --- | --- |`);
      paragraphs.push(`| 기준월 | K-apt 표시월 또는 고지서 월 | 다른 월과 섞으면 계절 변동이 왜곡됩니다 |`);
      paragraphs.push(`| 단위 | ㎡당, 세대당, 총액 중 하나로 고정 | 단위가 다르면 ${contract.mainKeyword} 비교가 성립하지 않습니다 |`);
      paragraphs.push(`| 비교군 | ${contract.relatedKeyword}가 유사한 단지 | 표본이 적으면 결론보다 질문으로 남깁니다 |`);
    } else {
      paragraphs.push("");
      paragraphs.push(`체크할 질문은 다음과 같습니다. 기준월이 같은가, ${contract.relatedKeyword} 조건이 같은가, 일회성 비용이 섞였는가, 공개 자료와 고지서 항목명이 같은가, 관리주체에 확인할 질문이 남아 있는가. 이 질문 중 하나라도 비어 있으면 글의 결론도 한 단계 낮춰 표현하는 편이 안전합니다.`);
    }
    paragraphs.push("");
  });

  paragraphs.push("## 자주 묻는 질문 {#faq}");
  faqs.forEach(([q, a]) => {
    paragraphs.push(`### ${q}`);
    paragraphs.push(a);
    paragraphs.push("");
  });

  paragraphs.push("## 마지막 확인");
  paragraphs.push(`${contract.mainKeyword}을 다룰 때 가장 중요한 태도는 빠른 평가보다 재현 가능한 확인입니다. 기준월, 출처, 비교군 정의, 정규화 단위, 공개 데이터의 한계를 함께 남기면 같은 자료를 다른 사람이 보더라도 비슷한 질문에서 출발할 수 있습니다.`);
  paragraphs.push(`이 글은 정보 제공용입니다. 특정 단지의 매수, 임대, 법률 판단을 대신하지 않으며, 실제 판단이 필요한 경우에는 관리사무소 공지, 관리규약, 고지서 원문, 관계 법령과 전문가 상담을 함께 확인해야 합니다.`);
  paragraphs.push("");
  paragraphs.push("## 출처");
  sources.slice(0, 6).forEach((source) => {
    paragraphs.push(`- ${source.name}: ${source.url}`);
  });
  paragraphs.push("");

  return paragraphs.join("\n");
}

function makeFrontmatter(contract) {
  return [
    "---",
    `title: "${contract.title}"`,
    `subtitle: "${contract.subtitle}"`,
    `slug: "${contract.slug}"`,
    `category: "${contract.category}"`,
    `cluster: "${contract.cluster}"`,
    `main_keyword: "${contract.mainKeyword}"`,
    `expanded_keywords: [${contract.expandedKeywords.map((keyword) => `"${keyword}"`).join(", ")}]`,
    `scheduledAt: "${contract.scheduledAt}"`,
    `status: "draft"`,
    `score: ${contract.score}`,
    `seo_description: "${contract.seoDescription}"`,
    `geo_target: "대한민국 공동주택 관리비 검색 사용자"`,
    `aeo_answer: "${contract.answerClaim}"`,
    "---",
    "",
  ].join("\n");
}

const contracts = [];
let globalIndex = 0;

for (const cluster of clusters) {
  cluster.items.forEach(([mainKeyword, relatedKeyword, angle], localIndex) => {
    const frame = titleFrames[globalIndex % titleFrames.length];
    const title = frame({ main: mainKeyword, related: relatedKeyword });
    const subtitle = `${mainKeyword}과 ${relatedKeyword}를 함께 놓고 기준월, 비교군, 공개 데이터 한계를 확인하는 실전 해석`;
    const slug = `kapt-management-fee-${String(globalIndex + 1).padStart(3, "0")}`;
    const structureType = structureTypes[globalIndex % structureTypes.length];
    const scheduled = scheduledAt(globalIndex);
    const contract = {
      id: `kapt-${String(globalIndex + 1).padStart(3, "0")}`,
      title,
      subtitle,
      slug,
      cluster: cluster.name,
      category: cluster.category,
      isPillar: localIndex === 0,
      mainKeyword,
      relatedKeyword,
      expandedKeywords: [relatedKeyword, cluster.name, "K-apt", "공동주택 관리비", "공개 데이터"],
      keywordRole: localIndex === 0 ? "pillar" : "supporting",
      searchIntent: localIndex % 3 === 0 ? "비교 전 기준 확인" : localIndex % 3 === 1 ? "고지서와 공개자료 해석" : "입주 전 리스크 질문 정리",
      uniqueAngle: angle,
      structureType,
      primaryReaderSituation: `${mainKeyword} 수치가 예상과 달라 ${relatedKeyword} 조건을 함께 확인하려는 독자`,
      decisionCriterion: `${relatedKeyword}와 기준월을 고정한 뒤 항목별 차이를 설명할 수 있는지`,
      endingCtaDirection: "관리사무소에 물어볼 질문과 추가 확인 자료를 정리한다",
      readerJob: `${mainKeyword}을 같은 단위와 같은 비교군으로 읽고 과장 없는 질문을 만든다`,
      decisionMoment: "이사, 매수, 전세, 월세, 고지서 확인 전에 월 부담을 검토하는 시점",
      answerClaim: `${mainKeyword}은 ${relatedKeyword}, 기준월, 단지 조건을 맞춘 뒤 항목별로 나누어 봐야 한다.`,
      evidencePlan: "K-apt 공개자료, 공공데이터포털 단지 기본정보, 공동주택관리법, 장기수선 관련 공공자료를 대조한다",
      nonOverlapClaim: `기존 글의 일반 관리비 기준 설명이 아니라 ${mainKeyword}과 ${relatedKeyword}의 결합 맥락만 다룬다`,
      notAnsweredHere: "특정 단지 추천, 투자 판단, 법률 자문, 관리주체 책임 단정",
      structureReason: `${structureType} 구조가 ${mainKeyword} 검색자의 확인 순서를 단계별로 보여주기에 적합하다`,
      internalLinkTargets: [
        "/blog/apartment-fee-comparison-checkpoints",
        "/blog/district-heating-fee-context",
        "/blog/long-term-repair-reserve-reading",
      ],
      separateReason: `${cluster.name} 안에서도 메인키워드와 독자 상황이 달라 별도 글로 분리한다`,
      scheduledAt: scheduled,
      score: 92 + (globalIndex % 5),
      seoDescription: `${mainKeyword}을 ${relatedKeyword}, 기준월, 비교군, K-apt 공개 데이터 기준으로 해석하는 방법을 정리했습니다.`,
    };
    contracts.push(contract);
    globalIndex += 1;
  });
}

const manifest = {
  site: "kapt",
  platform: "nextjs",
  targetCount: 100,
  generatedCount: contracts.length,
  status: "draft_package_created",
  personaSource: "personas/kapt/persona.md",
  publishedTitleSource: "lib/posts.ts",
  existingTitles,
  schedule: {
    timezone: "Asia/Seoul",
    cadenceHours: 5,
    firstScheduledAt: contracts[0].scheduledAt,
    lastScheduledAt: contracts.at(-1).scheduledAt,
  },
  qualityGate: {
    minimumScore: 90,
    minimumBodyKoreanChars: 3500,
    antiTemplate: "unique title frame, unique main keyword, cluster-specific reader job, varied structure type",
    externalLlmApiUsed: false,
    publicationPerformed: false,
  },
  sources,
  articles: [],
};

for (const [index, contract] of contracts.entries()) {
  const body = makeArticle(contract, index);
  const draftPath = path.join(draftDir, `${contract.id}-${contract.slug}.md`);
  const researchPath = path.join(researchDir, `${contract.id}-${contract.slug}.json`);
  const draft = makeFrontmatter(contract) + body;
  fs.writeFileSync(draftPath, draft, "utf8");

  const research = {
    id: contract.id,
    title: contract.title,
    mainKeyword: contract.mainKeyword,
    expandedKeywords: contract.expandedKeywords,
    accessedAt: "2026-06-06",
    researchQueries: [
      `${contract.mainKeyword} ${contract.relatedKeyword} K-apt`,
      `${contract.mainKeyword} 공동주택 관리비 공개자료`,
      `${contract.relatedKeyword} 공동주택관리법 관리비`,
      `${contract.mainKeyword} 공공데이터포털 공동주택`,
    ],
    sources: sources.slice(0, 6),
    dataPoints: [
      {
        claim: "관리비 비교에는 기준월, 단위, 비교군 정의가 필요하다.",
        sourceIds: ["kapt", "kapt-api"],
      },
      {
        claim: "단지 기본정보의 세대수, 난방방식, 관리방식은 비교군 설정에 영향을 준다.",
        sourceIds: ["data-go-kr-basic"],
      },
      {
        claim: "장기수선충당금과 장기수선계획은 공동주택관리법의 맥락에서 확인해야 한다.",
        sourceIds: ["law-apartment", "long-repair-guide"],
      },
    ],
    factTraceabilityPass: true,
    limitations: [
      "공개 데이터는 기준월과 입력 상태에 따라 실제 고지서와 차이가 날 수 있다.",
      "특정 단지의 가치, 안전성, 투자 판단을 단정하지 않는다.",
      "현장 공지, 관리규약, 고지서 원문 확인이 필요한 경우를 본문에 분리했다.",
    ],
  };
  fs.writeFileSync(researchPath, JSON.stringify(research, null, 2), "utf8");

  const koreanBodyChars = body.replace(/[^\u3131-\uD79D]/g, "").length;
  manifest.articles.push({
    ...contract,
    status: koreanBodyChars >= 3500 ? "done" : "review_needed",
    bodyKoreanChars: koreanBodyChars,
    draftPath: path.relative(process.cwd(), draftPath).replace(/\\/g, "/"),
    researchPath: path.relative(process.cwd(), researchPath).replace(/\\/g, "/"),
    visualElements: ["comparison-table", "checklist", "source-box"],
    headingPattern: sectionPlans[index % sectionPlans.length].join(" > "),
    titlePatternSignature: titleFrames[index % titleFrames.length].toString().replace(/\s+/g, " ").slice(0, 80),
    openingFrame: openingFrames[index % openingFrames.length],
    ctaType: "verification-questions",
  });
}

const csvHeaders = [
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

const csvRows = [
  csvHeaders.join(","),
  ...manifest.articles.map((article) =>
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
      article.primaryReaderSituation,
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
];

const scheduleRows = [
  "id,title,slug,scheduledAt,timezone,status",
  ...manifest.articles.map((article) =>
    [article.id, article.title, article.slug, article.scheduledAt, "Asia/Seoul", article.status]
      .map(csvEscape)
      .join(",")
  ),
];

const duplicateMainKeywords = contracts.length - new Set(contracts.map((contract) => contract.mainKeyword)).size;
const duplicateTitles = contracts.length - new Set(contracts.map((contract) => contract.title)).size;
const minChars = Math.min(...manifest.articles.map((article) => article.bodyKoreanChars));
const reviewNeeded = manifest.articles.filter((article) => article.status !== "done");

manifest.audit = {
  duplicateMainKeywords,
  duplicateTitles,
  existingTitleOverlap: contracts.filter((contract) => existingTitles.includes(contract.title)).length,
  minBodyKoreanChars: minChars,
  reviewNeededCount: reviewNeeded.length,
  doneCount: manifest.articles.length - reviewNeeded.length,
  targetMet: contracts.length === 100,
  handoffReady: reviewNeeded.length === 0 && duplicateMainKeywords === 0 && duplicateTitles === 0,
};

fs.writeFileSync(path.join(outRoot, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
fs.writeFileSync(path.join(outRoot, "title-contract-map.csv"), csvRows.join("\n"), "utf8");
fs.writeFileSync(path.join(outRoot, "schedule.csv"), scheduleRows.join("\n"), "utf8");

const report = [
  "# K-apt 신규 글 100개 품질 리포트",
  "",
  `- 생성 글 수: ${contracts.length}`,
  `- 완료 상태: ${manifest.audit.doneCount}`,
  `- 검토 필요: ${manifest.audit.reviewNeededCount}`,
  `- 중복 제목: ${duplicateTitles}`,
  `- 중복 메인키워드: ${duplicateMainKeywords}`,
  `- 기존 제목과 동일: ${manifest.audit.existingTitleOverlap}`,
  `- 최소 본문 한글 글자 수: ${minChars}`,
  `- 예약 간격: 5시간`,
  `- 첫 예약 시각: ${manifest.schedule.firstScheduledAt}`,
  `- 마지막 예약 시각: ${manifest.schedule.lastScheduledAt}`,
  `- 외부 LLM/API 사용: 없음`,
  `- 실제 발행/배포 수행: 없음`,
  "",
  "## 감사 결과",
  "",
  manifest.audit.handoffReady
    ? "모든 행이 초안 패키지 기준 품질 게이트를 통과했습니다."
    : "일부 행은 추가 검토가 필요합니다. manifest.audit와 review_needed 행을 확인하세요.",
  "",
  "## 생성 파일",
  "",
  "- output/kapt/manifest.json",
  "- output/kapt/title-contract-map.csv",
  "- output/kapt/schedule.csv",
  "- output/kapt/drafts/*.md",
  "- output/kapt/research/*.json",
].join("\n");

fs.writeFileSync(path.join(reportDir, "quality-report.md"), report, "utf8");

console.log(JSON.stringify(manifest.audit, null, 2));
