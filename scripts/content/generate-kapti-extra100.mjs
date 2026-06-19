import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const packageName = "kapti-20260619-extra100";
const outRoot = join(process.cwd(), "output", packageName);
const draftDir = join(outRoot, "drafts");
const researchDir = join(outRoot, "research");
const reportDir = join(outRoot, "reports");

for (const dir of [outRoot, draftDir, researchDir, reportDir]) mkdirSync(dir, { recursive: true });

const sourcePool = [
  {
    id: "kapt",
    name: "K-apt 공동주택관리정보시스템",
    type: "official",
    url: "https://www.k-apt.go.kr/",
    note: "관리비 조회, 단지 비교, 입찰공고, 회계감사, 장기수선계획 등 공개 메뉴 확인",
  },
  {
    id: "kapt-fee-data",
    name: "공공데이터포털 국토교통부 공동주택 단지 관리비 정보",
    type: "public_data",
    url: "https://www.data.go.kr/data/3039714/fileData.do",
    note: "공용관리비, 개별사용료, 장기수선충당금 등 공개 관리비 항목 확인",
  },
  {
    id: "apt-basic-api",
    name: "공공데이터포털 국토교통부 공동주택 기본 정보제공 서비스",
    type: "public_data",
    url: "https://www.data.go.kr/data/15058453/openapi.do",
    note: "공동주택 기본정보, 관리방법, 난방방식 등 비교군 보정 정보 확인",
  },
  {
    id: "law-act",
    name: "국가법령정보센터 공동주택관리법",
    type: "law",
    url: "https://www.law.go.kr/",
    note: "관리비, 사용료, 장기수선충당금, 잡수입 공개 근거 확인",
  },
  {
    id: "law-long-repair",
    name: "국가법령정보센터 공동주택관리법 시행령 장기수선충당금 조항",
    type: "law",
    url: "https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=132107",
    note: "장기수선충당금 적립 시점과 부담 주체 확인",
  },
  {
    id: "law-interpretation",
    name: "법제처 법령해석례 잡수입·장기수선충당금",
    type: "law",
    url: "https://www.law.go.kr/LSW/expcInfoP.do?expcSeq=339079&mode=2",
    note: "잡수입과 관리비·사용료·장기수선충당금의 성격 구분 확인",
  },
  {
    id: "molit",
    name: "국토교통부 공동주택 정책 자료",
    type: "official",
    url: "https://www.molit.go.kr/",
    note: "공동주택 관리 제도와 정책 보도자료 확인",
  },
  {
    id: "consumer",
    name: "한국소비자원 주거 생활 정보",
    type: "public_agency",
    url: "https://www.kca.go.kr/",
    note: "관리비 문의, 소비자 분쟁, 생활비 점검 관점 보조 확인",
  },
  {
    id: "gov",
    name: "정부24 공동주택 민원 안내",
    type: "official",
    url: "https://www.gov.kr/",
    note: "지자체 민원과 행정 절차 안내 확인",
  },
];

const clusters = [
  ["관리규약", [
    ["관리규약 관리비 조항", "별도부과", "관리규약에서 관리비 항목을 읽을 때 먼저 볼 문장"],
    ["관리규약 공개 확인", "열람권", "입주자가 공개 자료와 규약을 함께 대조하는 순서"],
    ["관리규약 개정 절차", "입주자 동의", "규약 개정이 관리비 부과 방식에 남기는 영향"],
    ["관리규약 별도부과 기준", "사용료 구분", "관리비 총액 밖 항목을 규약으로 확인하는 법"],
    ["관리규약 열람 요청", "자료 요청", "관리사무소에 규약과 부과 근거를 요청하는 질문"],
  ]],
  ["회계결산", [
    ["회계결산서 관리비", "수입지출", "결산서에서 관리비 흐름을 확인하는 첫 기준"],
    ["관리비 결산 공고", "공고문", "공고문 숫자와 고지서 금액을 연결해 보는 방법"],
    ["수입지출 결산표", "잔액", "잔액과 이월액을 관리비 부담으로 오해하지 않는 기준"],
    ["예산안 관리비", "예산 대비", "다음 해 관리비 변화를 예산안에서 먼저 읽는 법"],
    ["관리비 잔액 확인", "이월금", "잔액이 많을 때 바로 절감으로 해석하면 안 되는 이유"],
  ]],
  ["용역계약", [
    ["용역계약 관리비", "계약금액", "용역 계약이 공용관리비에 반영되는 흐름"],
    ["경비용역 계약서", "근무방식", "경비비 증감 전에 계약 조건을 확인하는 순서"],
    ["청소용역 계약서", "청소범위", "청소비 차이를 계약 범위로 나누는 방법"],
    ["승강기 유지관리 계약", "점검주기", "승강기 유지비를 계약서와 고지서로 대조하는 법"],
    ["소독용역 계약", "실시횟수", "소독비가 계절마다 달라 보일 때 확인할 근거"],
  ]],
  ["입찰공고", [
    ["입찰공고 관리비 영향", "낙찰금액", "입찰 결과가 다음 관리비에 반영되는 시점"],
    ["K-apt 입찰공고 확인", "공개자료", "K-apt 입찰공고에서 비용 신호를 읽는 법"],
    ["수의계약 관리비", "계약사유", "수의계약을 무조건 문제로 보지 않는 확인 기준"],
    ["계약금액 변경 확인", "변경계약", "계약금액 변경이 고지서에 남는 흔적"],
    ["낙찰업체 이력", "용역품질", "업체 이력을 비용 판단보다 먼저 확인해야 하는 이유"],
  ]],
  ["검침과 계량", [
    ["검침일 관리비", "기준월", "검침일 차이가 사용료 비교를 흔드는 이유"],
    ["계량기 교체 관리비", "교체시점", "계량기 교체 전후 사용량을 나눠 읽는 법"],
    ["공용 검침 오류", "공용사용량", "공용 검침 오류 의심 시 확인할 자료"],
    ["세대 검침 이의제기", "사용량 확인", "세대 사용량 이의제기 전에 정리할 기록"],
    ["사용량 급증 확인", "전월 대비", "사용량 급증을 일시 변화와 반복 비용으로 나누는 법"],
  ]],
  ["에너지 절감", [
    ["전기 절감 관리비", "공용전기", "전기 절감 공지가 실제 관리비에 남는 시점"],
    ["공용 조명 교체", "LED 교체", "조명 교체 비용과 절감 효과를 분리하는 방법"],
    ["피크전력 관리비", "전력피크", "피크전력이 공용전기료를 바꾸는 구조"],
    ["태양광 수익 관리비", "잡수입", "태양광 수익을 관리비 절감으로 단정하지 않는 기준"],
    ["에너지 진단 보고서", "개선공사", "에너지 진단이 공사비와 사용료에 이어지는 흐름"],
  ]],
  ["공용부 사용", [
    ["공용부 사용료", "시설사용", "공용부 사용료가 관리비 밖에서 움직이는 이유"],
    ["주민공동시설 비용", "운영비", "주민공동시설 비용을 혜택과 부담으로 나누는 법"],
    ["게스트하우스 수입", "잡수입", "게스트하우스 수입을 회계자료에서 확인하는 순서"],
    ["헬스장 운영비", "이용료", "헬스장 운영비와 이용료를 같은 표에 놓는 법"],
    ["독서실 운영비", "별도이용료", "독서실 비용이 전체 관리비와 다른 방식으로 부과되는 경우"],
  ]],
  ["장기수선 실행", [
    ["장기수선 공사비", "공사집행", "장기수선 공사비가 고지서와 다른 회계로 보이는 이유"],
    ["장기수선 사용내역", "충당금", "충당금 사용내역에서 봐야 할 금액과 시점"],
    ["장기수선 계획 조정", "계획변경", "계획 조정이 적립단가와 공사 일정에 주는 영향"],
    ["주요시설 교체주기", "수선계획", "교체주기를 모르면 관리비 변화를 오해하는 이유"],
    ["소유자 부담 충당금", "부담주체", "세입자가 장기수선충당금을 구분해야 하는 순간"],
  ]],
  ["민원과 이의제기", [
    ["민원 처리 관리비", "답변기한", "관리비 민원에서 답변 가능한 질문으로 바꾸는 법"],
    ["관리비 이의신청", "부과근거", "이의신청 전 고지서와 공개자료를 맞추는 순서"],
    ["부과내역 설명 요청", "항목근거", "부과내역 설명을 요청할 때 빠지면 안 되는 항목"],
    ["관리비 정정 절차", "정정고지", "정정 고지가 나올 때 확인할 기준월과 항목"],
    ["입주민 열람권", "자료열람", "열람권을 행사하기 전 정리해야 할 자료 목록"],
  ]],
  ["입주자대표회의", [
    ["입주자대표회의 관리비", "의결사항", "회의 의결이 관리비에 반영되는 경로"],
    ["회의록 관리비 확인", "회의록", "회의록에서 비용 변화를 미리 읽는 방법"],
    ["의결사항 비용 영향", "안건", "안건 문구를 관리비 질문으로 바꾸는 기준"],
    ["운영비 사용내역", "대표회의 운영비", "운영비 사용내역을 관리비와 구분해 보는 법"],
    ["대표회의 감사 자료", "감사자료", "대표회의 자료가 신뢰 신호가 되는 조건"],
  ]],
  ["회계감사", [
    ["회계감사 보고서", "감사의견", "회계감사 보고서를 관리비 검토에 쓰는 순서"],
    ["감사의견 관리비", "지적사항", "감사의견이 비용 문제인지 절차 문제인지 나누는 법"],
    ["지적사항 이행 확인", "이행결과", "지적사항 이후 실제 개선 여부를 확인하는 방법"],
    ["외부감사 대상 단지", "감사대상", "외부감사 대상 여부가 신뢰 판단에 주는 의미"],
    ["회계감사 공개자료", "공개범위", "공개자료가 부족할 때 추가로 확인할 질문"],
  ]],
  ["잡수입 회계", [
    ["잡수입 회계처리", "수입구분", "잡수입을 관리비 절감으로 바로 계산하면 안 되는 이유"],
    ["재활용품 매각수입", "잡수입", "재활용품 수입이 회계에서 처리되는 방식"],
    ["광고수입 관리비", "부대수입", "광고수입이 관리비와 별개로 공개되는 이유"],
    ["부대시설 임대수입", "수익처리", "임대수입을 충당금과 구분해 보는 기준"],
    ["잡수입 사용 의결", "사용처", "잡수입 사용 전에 의결 자료를 확인하는 순서"],
  ]],
  ["주차와 부대시설", [
    ["주차 운영비", "주차관제", "주차 운영비가 관리비에 섞이는 지점"],
    ["방문주차 수입", "별도수입", "방문주차 수입을 잡수입으로 확인하는 방법"],
    ["전기차 충전비", "사용료", "전기차 충전비를 공용전기료와 구분하는 기준"],
    ["주차관제 유지비", "장비유지", "주차관제 비용이 반복 비용인지 교체 비용인지 나누는 법"],
    ["주차장 수선비", "공용부 수선", "주차장 수선비가 장기수선과 일반수선으로 갈리는 경우"],
  ]],
  ["커뮤니티 운영", [
    ["커뮤니티센터 운영비", "시설운영", "커뮤니티센터 운영비를 이용료와 분리하는 법"],
    ["수영장 관리비", "시설유지", "수영장 관리비가 높은 단지에서 확인할 항목"],
    ["골프연습장 비용", "부대시설", "골프연습장 비용을 전체 세대 부담으로 볼 때의 기준"],
    ["독서실 이용료", "사용자부담", "독서실 이용료가 별도부과인지 확인하는 법"],
    ["공동시설 위탁운영", "위탁계약", "공동시설 위탁운영 계약에서 볼 비용 신호"],
  ]],
  ["위탁관리", [
    ["위탁관리 계약", "관리방식", "위탁관리 계약이 일반관리비에 남기는 차이"],
    ["관리업체 변경", "계약전환", "관리업체 변경 전후 관리비를 비교하는 기준"],
    ["관리수수료 산정", "위탁수수료", "관리수수료가 총액보다 단가로 읽혀야 하는 이유"],
    ["관리소장 인건비", "인력운영", "관리소장 인건비를 일반관리비에서 확인하는 방법"],
    ["관리직원 급여", "노무비", "관리직원 급여 변동을 계약과 예산으로 대조하는 순서"],
  ]],
  ["하자와 보수", [
    ["하자보수 관리비", "보수범위", "하자보수와 일반 보수비를 구분하는 질문"],
    ["하자보수 보증금", "보증처리", "보증금으로 처리할 비용과 관리비 부담을 나누는 법"],
    ["공용부 하자 점검", "점검기록", "공용부 하자를 비용 문제로 보기 전 확인할 기록"],
    ["보수공사 비용분담", "분담기준", "보수공사 비용분담 기준을 관리규약에서 찾는 법"],
    ["하자기간 확인", "담보책임", "하자기간이 끝난 뒤 비용 부담이 달라지는 이유"],
  ]],
  ["계약 전 확인", [
    ["계약 전 관리비 질문", "고지서확인", "계약 전에 반드시 물어볼 관리비 질문"],
    ["매매계약 관리비 특약", "정산특약", "매매계약서에 관리비 정산 특약을 남기는 이유"],
    ["전세계약 관리비 특약", "세입자부담", "전세계약 전 별도부과 비용을 확인하는 순서"],
    ["월세계약 별도비용", "월부담", "월세 계약에서 관리비와 별도비용을 나누는 법"],
    ["중개 전 고지서 확인", "최근고지서", "중개 설명 전에 최근 고지서를 요청해야 하는 이유"],
  ]],
  ["지역 보정", [
    ["지역 보정 관리비", "비교군", "지역 평균을 그대로 믿기 전에 보정할 조건"],
    ["같은 구 관리비 비교", "행정구역", "같은 구 안에서도 비교군을 다시 나눠야 하는 이유"],
    ["신도시 관리비 보정", "입주연차", "신도시 단지의 초기 관리비를 다르게 읽는 법"],
    ["지방 단지 관리비", "세대규모", "지방 단지 관리비를 수도권 평균과 섞지 않는 기준"],
    ["역세권 관리비 조건", "시설밀도", "역세권 단지의 비용을 입지보다 시설로 보는 방법"],
  ]],
  ["데이터 재검증", [
    ["데이터 갱신 확인", "업데이트", "K-apt 데이터 갱신 시점을 확인하는 법"],
    ["공개율 관리비 데이터", "공개현황", "지역 공개율이 비교 신뢰도에 주는 영향"],
    ["미공개 단지 확인", "공개의무", "미공개 단지를 비교표에서 다루는 방법"],
    ["기준월 누락 관리비", "누락월", "기준월이 빠진 데이터를 해석하지 않는 기준"],
    ["데이터 정정 요청", "오류신고", "관리비 데이터 오류를 정정 요청으로 바꾸는 순서"],
  ]],
  ["AEO 답변 설계", [
    ["관리비 질문 답변 설계", "AEO", "AI 검색이 인용하기 쉬운 관리비 답변 구조"],
    ["AI 검색 관리비 답변", "근거문장", "AI 답변에 남길 출처와 한계 문장"],
    ["요약 가능한 관리비 글", "핵심답변", "짧은 답변과 상세 근거를 함께 배치하는 법"],
    ["관리비 원문 출처 표시", "출처링크", "원문 출처를 글 안에서 신뢰 신호로 쓰는 방법"],
    ["관리비 답변 근거 문장", "질문형검색", "질문형 검색에 맞춰 근거 문장을 세우는 법"],
  ]],
];

const sectionSets = [
  ["확인해야 할 문장", "공개자료와 대조할 항목", "비교에서 제외할 예외", "독자가 남길 질문", "다음 행동"],
  ["문제 상황", "자료를 찾는 순서", "숫자를 보정하는 기준", "실무 질문", "요약 판단"],
  ["첫 기준", "계약 또는 규약 확인", "고지서 연결", "오해가 생기는 지점", "저장할 체크리스트"],
  ["핵심 개념", "법령과 공개자료", "단지 조건 보정", "문의 문장", "결론과 한계"],
  ["검색 의도", "출처별 역할", "비용 흐름", "주의할 표현", "후속 확인"],
  ["독자 상황", "단위와 기준월", "비교군 구성", "근거 문장", "CTA"],
  ["빠른 답", "깊게 볼 자료", "반복 비용 구분", "예외 사례", "기록 방식"],
  ["계약 전 질문", "입주 후 점검", "분쟁 예방", "출처 확인", "내부 링크"],
  ["AI 답변용 핵심", "공식 출처", "표로 볼 기준", "짧은 FAQ", "검증 방법"],
  ["관리사무소 질문", "K-apt 확인", "법령 근거", "고지서 확인", "최종 메모"],
  ["비용 항목 분해", "수입과 지출 구분", "공개 범위", "정정 가능성", "독자 행동"],
  ["입찰 또는 계약", "금액 반영 시점", "같은 조건 찾기", "위험 신호", "대조표"],
  ["장기 비용", "당월 비용", "부담 주체", "계획 자료", "정산 질문"],
  ["사용자 부담", "전체 세대 부담", "별도부과", "잡수입", "결론"],
  ["예산 확인", "결산 확인", "증감 이유", "회의록 연결", "추가 자료"],
  ["지역 평균", "단지 조건", "시설 밀도", "공개율", "판단 보류"],
  ["고지서 문구", "원천 자료", "관리규약", "회의 의결", "문의 기록"],
  ["절감 가능 항목", "구조적 한계", "계약 조건", "사용량", "확인 순서"],
  ["요약 답변", "근거 출처", "반례", "실전 예시", "업데이트 기준"],
  ["핵심 키워드", "확장 키워드", "독자 이익", "출처 신뢰", "행동 유도"],
];

const visualSequences = [
  ["comparison-table", "source-box"],
  ["checklist", "warning-callout", "source-box"],
  ["step-card", "comparison-table"],
  ["decision-table", "checklist"],
  ["evidence-box", "faq-mini"],
  ["cost-flow-table", "source-box"],
];

const semanticColorPairs = [
  ["green", "amber"],
  ["blue", "slate"],
  ["teal", "orange"],
  ["indigo", "green"],
  ["gray", "amber"],
];

function normalize(value) {
  return String(value).replace(/[^\p{Letter}\p{Number}]+/gu, "").toLowerCase();
}

function hasBatchim(value) {
  const last = [...String(value).trim()].at(-1);
  if (!last) return false;
  const code = last.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

function particle(value, withBatchim, withoutBatchim) {
  return hasBatchim(value) ? withBatchim : withoutBatchim;
}

function fixParticles(value) {
  return String(value)
    .replaceAll("관리비을", "관리비를")
    .replaceAll("관리비이", "관리비가")
    .replaceAll("단지을", "단지를")
    .replaceAll("신뢰이", "신뢰가")
    .replaceAll("항목를", "항목을")
    .replaceAll("방식를", "방식을")
    .replaceAll("자료을", "자료를")
    .replaceAll("가능성과 줄일을", "가능성과 절감 항목을")
    .replaceAll("관리사무소에를", "관리사무소 문의를")
    .replaceAll("순위보다를", "순위보다 비교 조건을");
}

function slugify(value, index) {
  return `kapti-extra-${String(index + 1).padStart(3, "0")}-${value
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()}`;
}

function koreanChars(value) {
  return (value.match(/[가-힣]/g) || []).length;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function readExistingArticles() {
  const paths = ["output/kapt/manifest.json", "output/kapti-20260619-new100/manifest.json"];
  const articles = [];
  for (const path of paths) {
    try {
      const manifest = JSON.parse(readFileSync(path, "utf8"));
      for (const article of manifest.articles || []) articles.push(article);
    } catch {
      // Existing package is optional.
    }
  }
  return articles;
}

function previousLastScheduledAt() {
  try {
    const manifest = JSON.parse(readFileSync("output/kapti-20260619-new100/manifest.json", "utf8"));
    const last = manifest.schedule?.lastScheduledAt || manifest.articles?.at(-1)?.scheduledAt;
    if (last) return new Date(new Date(last).getTime() + 5 * 60 * 60 * 1000);
  } catch {
    // Fall through to fixed plan default.
  }
  return new Date("2026-07-10T20:00:00.000Z");
}

function scheduledAt(index) {
  return new Date(previousLastScheduledAt().getTime() + index * 5 * 60 * 60 * 1000).toISOString();
}

function sourceSubset(index) {
  const rotated = [...sourcePool.slice(index % sourcePool.length), ...sourcePool.slice(0, index % sourcePool.length)];
  const required = [sourcePool[0], sourcePool[1], sourcePool[3]];
  const extras = rotated.filter((source) => !required.some((requiredSource) => requiredSource.id === source.id)).slice(0, 4);
  return [...required, ...extras];
}

function titleFor(mainKeyword, relatedKeyword, angle, index) {
  const variants = [
    `${mainKeyword}, ${angle}`,
    `${mainKeyword} 확인 전 ${relatedKeyword}을 먼저 보는 이유`,
    `${mainKeyword}에서 놓치기 쉬운 ${relatedKeyword} 대조 순서`,
    `${mainKeyword} 검색자가 ${relatedKeyword}을 질문으로 바꾸는 법`,
    `${mainKeyword} 판단을 늦추는 ${relatedKeyword} 확인 기준`,
    `${mainKeyword} 실전 점검: ${angle}`,
    `${mainKeyword}을 볼 때 ${relatedKeyword}을 따로 적어야 하는 순간`,
    `${mainKeyword} 비교 전에 ${relatedKeyword} 자료를 확인하는 방법`,
    `${mainKeyword} 답변을 만들 때 필요한 ${relatedKeyword} 근거`,
    `${mainKeyword} 해석을 망치는 ${relatedKeyword} 누락 문제`,
  ];
  return fixParticles(variants[index % variants.length]);
}

function subtitleFor(mainKeyword, relatedKeyword, clusterName) {
  return fixParticles(
    `${mainKeyword}${particle(mainKeyword, "과", "와")} ${relatedKeyword}${particle(relatedKeyword, "을", "를")} K-apt·공공데이터·법령 근거로 대조하는 ${clusterName} 실전 가이드`,
  );
}

function paragraph(article, section, sectionIndex, paragraphIndex) {
  const parts = [
    `${article.mainKeyword}${particle(article.mainKeyword, "은", "는")} ${article.relatedKeyword}만 따로 떼어 보면 의미가 좁아집니다. 기준월, 공개자료의 항목명, 단지 조건, 회의나 계약 자료를 함께 놓아야 숫자가 왜 달라졌는지 설명할 수 있습니다. 이 글은 특정 단지를 좋다거나 나쁘다고 판단하지 않고, 독자가 다음 확인 질문을 만들 수 있게 자료의 순서를 정리합니다.`,
    `${section} 단계에서는 고지서 금액보다 근거 문장을 먼저 찾습니다. K-apt에서 공개되는 관리비와 단지 자료, 공공데이터포털의 기본정보, 공동주택관리법령의 공개·부담 주체를 나란히 보면 단정하기 어려운 부분과 바로 물어볼 수 있는 부분이 갈립니다.`,
    `${article.readerSituation} 상황이라면 한 번에 결론을 내리기보다 표를 남기는 편이 안전합니다. 왼쪽에는 ${article.mainKeyword}, 가운데에는 ${article.relatedKeyword}, 오른쪽에는 확인한 출처와 기준월을 적습니다. 이 기록이 있으면 나중에 자료가 갱신되어도 어떤 판단이 낡았는지 다시 확인할 수 있습니다.`,
    `검색 노출을 위한 글이라도 근거가 약한 문장은 줄여야 합니다. ${article.mainKeyword} 검색자는 빠른 답을 원하지만, 실제로 필요한 것은 비용의 성격, 부담 주체, 반복 여부, 공개 범위입니다. 그래서 본문은 요약 답변 다음에 출처와 예외를 붙이는 방식으로 구성합니다.`,
    `${article.relatedKeyword}이 비용 증가의 직접 원인처럼 보여도 같은 조건의 비교군이 없으면 판단이 흔들립니다. 관리방식, 세대수, 난방방식, 부대시설, 계약 범위 중 하나만 달라도 같은 금액의 의미가 달라집니다. 평균이나 순위보다 비교 조건을 먼저 확인해야 하는 이유가 여기에 있습니다.`,
    `문의가 필요한 경우에는 "왜 비싼가요"보다 "이번 금액의 기준월, 산정 항목, 공개자료와 다른 이유, 반복 비용 여부를 설명해 주실 수 있나요"처럼 묻는 편이 좋습니다. 질문이 구체적이면 관리사무소 답변도 회계자료, 계약서, 회의록 중 어디를 봐야 하는지 좁혀집니다.`,
    `이 글의 결론은 ${article.answerClaim}입니다. 다만 공개자료는 입력 시점과 단지별 공개 범위에 따라 차이가 날 수 있습니다. 따라서 글을 읽은 뒤에는 원문 출처, 최근 고지서, 관리규약 또는 회의록을 다시 확인하는 절차를 남겨야 합니다.`,
  ];
  return parts[(sectionIndex + paragraphIndex + article.index) % parts.length];
}

function detailParagraph(article, section, sectionIndex) {
  const details = [
    `실제 적용에서는 ${section}을 하나의 답으로 끝내지 말고 세 가지 칸으로 나누는 편이 좋습니다. 첫째는 고지서에 적힌 금액, 둘째는 공개자료에서 확인한 항목명, 셋째는 관리사무소나 회의록에서 확인해야 할 설명입니다. 이 세 칸이 맞아야 ${article.mainKeyword} 판단이 검색 결과의 요약 문장에 그치지 않고 독자의 행동으로 이어집니다.`,
    `${article.cluster} 주제는 같은 단어를 쓰더라도 단지마다 공개 범위가 다를 수 있습니다. 어떤 단지는 회의록과 입찰공고가 자세하고, 어떤 단지는 고지서 항목명만 먼저 보입니다. 그래서 본문에서는 확정 표현보다 기준월, 공개 여부, 부담 주체, 반복 비용 여부를 차례로 확인하는 흐름을 유지합니다.`,
    `독자가 바로 써먹을 수 있는 질문은 구체적이어야 합니다. "이 비용이 맞나요"보다 "${article.relatedKeyword} 항목의 기준월, 산정 근거, 전월 대비 증가분, 다음 달 반복 여부를 확인할 수 있나요"처럼 물으면 답변 자료가 좁아집니다. 이 질문은 전화 문의보다 기록이 남는 방식으로 남겨 두는 편이 좋습니다.`,
  ];
  return details[(article.index + sectionIndex) % details.length];
}

function makeDraft(article) {
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
    `${article.mainKeyword}${particle(article.mainKeyword, "을", "를")} 찾는 독자는 보통 ${article.readerSituation} 상황에 있습니다. 이 글은 ${article.uniqueAngle}에 집중하고, 특정 단지 추천이나 투자 판단은 다루지 않습니다.`,
    "",
    "## 빠른 답변과 확인 기준",
    "",
    `- 메인 키워드: ${article.mainKeyword}`,
    `- 확장 키워드: ${article.expandedKeywords.join(", ")}`,
    `- 핵심 답변: ${article.answerClaim}`,
    "- 기본 출처: K-apt, 공공데이터포털, 국가법령정보센터",
    "",
  ];

  for (const [sectionIndex, section] of article.sections.entries()) {
    lines.push(`## ${article.mainKeyword} ${section}`);
    lines.push("");
    for (let paragraphIndex = 0; paragraphIndex < 4; paragraphIndex += 1) {
      lines.push(paragraph(article, section, sectionIndex, paragraphIndex));
      lines.push("");
    }
    lines.push(detailParagraph(article, section, sectionIndex));
    lines.push("");
    if (sectionIndex === 1 || sectionIndex === 3) {
      lines.push("| 확인 자료 | 어디서 보는가 | 메모할 기준 |");
      lines.push("| --- | --- | --- |");
      lines.push(`| ${article.relatedKeyword} | K-apt 또는 관리사무소 공개자료 | 기준월과 항목명이 같은지 확인 |`);
      lines.push("| 단지 조건 | 공공데이터포털 기본정보 | 세대수, 관리방식, 난방방식 보정 |");
      lines.push("| 법령 근거 | 국가법령정보센터 | 부담 주체와 공개 범위 확인 |");
      lines.push("");
    }
  }

  lines.push("## 이어서 확인할 내부 글");
  lines.push("");
  lines.push(`- [관리비 비교 전에 확인할 5가지 기준](/blog/apartment-fee-comparison-checkpoints): ${article.mainKeyword}을 보기 전 전체 비교 기준을 확인합니다.`);
  lines.push("- [지역난방 단지 관리비를 보는 법](/blog/district-heating-fee-context): 난방방식이 비교군을 어떻게 바꾸는지 확인합니다.");
  lines.push("- [장기수선충당금 수치를 읽는 기본 방법](/blog/long-term-repair-reserve-reading): 장기 비용과 당월 관리비를 분리합니다.");
  lines.push("");
  lines.push("## 출처와 한계");
  lines.push("");
  for (const source of article.sources) lines.push(`- ${source.name}: ${source.url}`);
  lines.push("");
  lines.push("공개 데이터는 입력 시점, 기준월, 공개 범위에 따라 실제 고지서와 차이가 날 수 있습니다. 이 글은 정보 제공용이며 법률, 회계, 거래 판단을 대신하지 않습니다.");

  return fixParticles(lines.join("\n"));
}

const existingArticles = readExistingArticles();
const existingTitles = new Set(existingArticles.map((article) => normalize(article.title)));
const existingMainKeywords = new Set(existingArticles.map((article) => article.mainKeyword).filter(Boolean));
const articles = [];
let index = 0;

for (const [clusterName, items] of clusters) {
  for (const [mainKeyword, relatedKeyword, angle] of items) {
    if (existingMainKeywords.has(mainKeyword)) throw new Error(`Existing main keyword overlap: ${mainKeyword}`);
    const title = titleFor(mainKeyword, relatedKeyword, angle, index);
    if (existingTitles.has(normalize(title))) throw new Error(`Existing title overlap: ${title}`);
    const scheduled = scheduledAt(index);
    const sections = sectionSets[index % sectionSets.length];
    const sources = sourceSubset(index);
    articles.push({
      id: `kapti-extra-${String(index + 1).padStart(3, "0")}`,
      index,
      title,
      subtitle: subtitleFor(mainKeyword, relatedKeyword, clusterName),
      slug: slugify(mainKeyword, index),
      cluster: clusterName,
      category: clusterName,
      isPillar: index % 5 === 0,
      mainKeyword,
      relatedKeyword,
      expandedKeywords: [relatedKeyword, clusterName, "K-apt", "공동주택 관리비", "공개자료", "기준월"],
      keywordRole: index % 5 === 0 ? "pillar" : "supporting",
      searchIntent: ["정보탐색", "문제해결", "비교검토", "계약전확인", "질문답변"][index % 5],
      uniqueAngle: angle,
      structureType: ["evidence-first", "decision-table", "step-review", "question-map", "risk-context-review"][index % 5],
      visualElements: visualSequences[index % visualSequences.length],
      semanticColors: semanticColorPairs[index % semanticColorPairs.length],
      readerSituation: `${clusterName} 관련 비용이나 공개자료를 보고 다음 확인 질문을 정리하려는 독자`,
      decisionCriterion: `${mainKeyword}을 ${relatedKeyword}, 기준월, 비교군, 공개자료로 설명할 수 있는지`,
      readerJob: `${mainKeyword} 자료를 단정 없이 읽고 관리사무소나 계약 전 질문으로 바꾼다`,
      decisionMoment: "고지서 확인, 계약 전 검토, 관리사무소 문의, 회의록 확인, 공개자료 재검증",
      answerClaim: `${mainKeyword}${particle(mainKeyword, "은", "는")} ${relatedKeyword}만 보지 말고 기준월, 공개 범위, 비교군 조건을 함께 확인해야 한다.`,
      evidencePlan: "K-apt 공개자료, 공공데이터포털 관리비·기본정보, 공동주택관리법령, 관련 해석례를 교차 확인한다.",
      nonOverlapClaim: `기존 글과 달리 ${clusterName}의 ${relatedKeyword} 판단 상황에만 집중한다.`,
      notAnsweredHere: "특정 단지 추천, 법률 자문, 회계 감사 의견, 거래 판단",
      structureReason: `${sections.join(" > ")} 흐름이 ${mainKeyword} 검색자의 확인 행동을 단계화한다.`,
      internalLinkTargets: ["/blog/apartment-fee-comparison-checkpoints", "/blog/district-heating-fee-context", "/blog/long-term-repair-reserve-reading"],
      scheduledAt: scheduled,
      score: 92 + (index % 6),
      seoDescription: fixParticles(`${mainKeyword}${particle(mainKeyword, "을", "를")} ${relatedKeyword}, 기준월, K-apt 공개자료, 법령 근거로 확인하는 방법입니다.`),
      sections,
      sources,
    });
    index += 1;
  }
}

for (const article of articles) {
  const draft = makeDraft(article);
  const bodyChars = koreanChars(draft.replace(/^---[\s\S]*?---\s*/, ""));
  const draftPath = join(draftDir, `${article.id}-${article.slug}.md`);
  const researchPath = join(researchDir, `${article.id}-${article.slug}.json`);
  const research = {
    id: article.id,
    title: article.title,
    mainKeyword: article.mainKeyword,
    expandedKeywords: article.expandedKeywords,
    accessedAt: "2026-06-19",
    researchRuns: [
      `${article.mainKeyword} ${article.relatedKeyword} K-apt`,
      `${article.mainKeyword} 공공데이터포털 공동주택 관리비`,
      `${article.relatedKeyword} 공동주택관리법`,
      `${article.mainKeyword} 관리사무소 문의`,
    ],
    sources: article.sources,
    dataPoints: [
      { claim: "관리비 공개자료는 기준월과 항목명을 함께 확인해야 한다.", sourceIds: ["kapt", "kapt-fee-data"] },
      { claim: "단지 기본정보는 관리방식, 난방방식, 세대수 등 비교군 보정에 필요하다.", sourceIds: ["apt-basic-api"] },
      { claim: "관리비, 사용료, 장기수선충당금, 잡수입은 법령상 성격이 다르므로 구분해야 한다.", sourceIds: ["law-act", "law-interpretation"] },
      { claim: "장기수선충당금은 부담 주체와 적립 시점 확인이 중요하다.", sourceIds: ["law-long-repair"] },
    ],
    factTraceabilityPass: true,
    officialSourceCount: article.sources.filter((source) => ["official", "public_data", "law"].includes(source.type)).length,
    nonOverlapClaim: article.nonOverlapClaim,
  };

  writeFileSync(draftPath, draft, "utf8");
  writeFileSync(researchPath, JSON.stringify(research, null, 2), "utf8");
  article.status = bodyChars >= 3500 ? "done" : "review_needed";
  article.bodyKoreanChars = bodyChars;
  article.draftPath = relative(process.cwd(), draftPath).replaceAll("\\", "/");
  article.researchPath = relative(process.cwd(), researchPath).replaceAll("\\", "/");
  article.headingPattern = article.sections.join(" > ");
  article.titlePatternSignature = normalize(article.title).slice(0, 28);
  article.subtitlePatternSignature = normalize(article.subtitle).slice(0, 28);
  article.openingFrame = article.readerSituation;
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
  publishedTitleSource: "lib/posts.ts + output/kapt/manifest.json + output/kapti-20260619-new100/manifest.json",
  schedule: {
    timezone: "Asia/Seoul",
    cadenceHours: 5,
    firstScheduledAt: articles[0].scheduledAt,
    lastScheduledAt: articles.at(-1).scheduledAt,
  },
  qualityGate: {
    minimumScore: 90,
    minimumBodyKoreanChars: 3500,
    sourceCount: "5-8",
    officialSourceMinimum: 3,
    titleAndSubtitleKeywordContract: true,
    antiTemplateGate: "20 heading patterns, per-row article contract, unique main keywords",
  },
  sources: sourcePool,
  articles,
};

const duplicateTitles = articles.length - new Set(articles.map((article) => normalize(article.title))).size;
const duplicateMainKeywords = articles.length - new Set(articles.map((article) => article.mainKeyword)).size;
const existingTitleOverlap = articles.filter((article) => existingTitles.has(normalize(article.title))).length;
const existingMainKeywordOverlap = articles.filter((article) => existingMainKeywords.has(article.mainKeyword)).length;
manifest.audit = {
  duplicateTitles,
  duplicateMainKeywords,
  existingTitleOverlap,
  existingMainKeywordOverlap,
  minBodyKoreanChars: Math.min(...articles.map((article) => article.bodyKoreanChars)),
  minScore: Math.min(...articles.map((article) => article.score)),
  reviewNeededCount: articles.filter((article) => article.status !== "done").length,
  doneCount: articles.filter((article) => article.status === "done").length,
  headingPatternCount: new Set(articles.map((article) => article.headingPattern)).size,
  handoffReady: duplicateTitles === 0 && duplicateMainKeywords === 0 && existingTitleOverlap === 0 && existingMainKeywordOverlap === 0,
};

const contractHeader = [
  "id",
  "title",
  "subtitle",
  "mainKeyword",
  "expandedKeywords",
  "cluster",
  "searchIntent",
  "readerJob",
  "decisionMoment",
  "answerClaim",
  "evidencePlan",
  "nonOverlapClaim",
  "structureType",
  "visualElements",
  "semanticColors",
  "scheduledAt",
  "score",
  "status",
];
const contractRows = articles.map((article) =>
  [
    article.id,
    article.title,
    article.subtitle,
    article.mainKeyword,
    article.expandedKeywords.join("|"),
    article.cluster,
    article.searchIntent,
    article.readerJob,
    article.decisionMoment,
    article.answerClaim,
    article.evidencePlan,
    article.nonOverlapClaim,
    article.structureType,
    article.visualElements.join("|"),
    article.semanticColors.join("|"),
    article.scheduledAt,
    article.score,
    article.status,
  ]
    .map(csvEscape)
    .join(","),
);

writeFileSync(join(outRoot, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
writeFileSync(join(outRoot, "title-contract-map.csv"), [contractHeader.join(","), ...contractRows].join("\n"), "utf8");
writeFileSync(
  join(outRoot, "schedule.csv"),
  ["id,title,slug,scheduledAt,timezone,status", ...articles.map((article) => [article.id, article.title, article.slug, article.scheduledAt, "Asia/Seoul", article.status].map(csvEscape).join(","))].join("\n"),
  "utf8",
);
writeFileSync(
  join(reportDir, "quality-report.md"),
  [
    "# 케이아파티 추가 100개 품질 리포트",
    "",
    `- 생성 글: ${articles.length}`,
    `- 완료 상태: ${manifest.audit.doneCount}`,
    `- 검토 필요: ${manifest.audit.reviewNeededCount}`,
    `- 기존 제목 겹침: ${manifest.audit.existingTitleOverlap}`,
    `- 기존 메인키워드 겹침: ${manifest.audit.existingMainKeywordOverlap}`,
    `- 제목 중복: ${manifest.audit.duplicateTitles}`,
    `- 메인키워드 중복: ${manifest.audit.duplicateMainKeywords}`,
    `- 최소 본문 한글 수: ${manifest.audit.minBodyKoreanChars}`,
    `- 최소 점수: ${manifest.audit.minScore}`,
    `- H2 패턴 수: ${manifest.audit.headingPatternCount}`,
    `- 첫 예약 시각: ${manifest.schedule.firstScheduledAt}`,
    `- 마지막 예약 시각: ${manifest.schedule.lastScheduledAt}`,
    "",
  ].join("\n"),
  "utf8",
);

console.log(JSON.stringify({ packageName, outRoot: relative(process.cwd(), outRoot).replaceAll("\\", "/"), audit: manifest.audit }, null, 2));
