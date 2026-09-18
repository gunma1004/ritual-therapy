import type { Metadata } from "next";
import Link from "next/link";
import { ClientTextMixerInline } from "./ClientTextMixerInline";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
  }>;
  searchParams: Promise<{
    dong?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams.dong ? decodeURIComponent(resolvedSearchParams.dong) : "";
  const districtName = decodeURIComponent(district);
  const regionName = region === "seoul" ? "서울" : region === "incheon" ? "인천" : "경기";

  const locationKeyword = `${regionName} ${districtName} ${dongName}`.trim();
  const simpleLocation = dongName ? `${districtName} ${dongName}` : districtName;

  // -------------------------------------------------------------
  // 🎯 1,000가지 이상 조합을 만드는 다중 해시 배리에이션 패턴
  // -------------------------------------------------------------
  const baseString = locationKeyword + dongName + districtName + "ritual_clean_massage_1000";
  const charSum1 = baseString.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
  const charSum2 = baseString.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) + idx, 0);

  const modifiers1 = [
    "프리미엄", "전문", "고품격", "맞춤형", "안심", "쾌적한", "정통", "힐링", 
    "릴렉스", "스페셜", "시그니처", "베테랑", "체계적인", "프라이빗", "엄선된", 
    "아늑한", "청결한", "여유로운", "1:1 맞춤", "도심 속"
  ];
  const modifiers2 = [
    "아로마", "스웨디시", "바디케어", "웰니스", "전신 릴렉스", "감성 테라피", 
    "딥티슈", "컨디션 회복", "오일 힐링", "바디 밸런스"
  ];
  const connectors = [
    "안내 및 제휴 샵", "프로그램 가이드", "추천 제휴처 모음", "정찰제 요금 비교", 
    "맞춤형 휴식 공간", "전문 테라피 안내", "클린 힐링 스페이스", "상세 코스 안내"
  ];

  const mod1 = modifiers1[charSum1 % modifiers1.length];
  const mod2 = modifiers2[charSum2 % modifiers2.length];
  const conn = connectors[(charSum1 + charSum2) % connectors.length];

  const variantIndex = charSum1 % 30;

  // 🌟 "출장" 키워드가 전혀 없고 "마사지"가 자연스럽게 분산된 30가지 메인 타이틀 뼈대 + 모듈 조합
  const titleTemplates = [
    `${locationKeyword} ${mod1} ${mod2} 마사지 안내 - 리추얼`,
    `[리추얼] ${simpleLocation} ${mod1} 마사지 및 ${mod2} 가이드`,
    `${locationKeyword} ${mod2} 마사지 제휴 샵 | ${mod1} 케어`,
    `${simpleLocation} ${mod1} ${conn} - 리추얼 마사지 플랫폼`,
    `리추얼 추천 ${locationKeyword} ${mod2} 마사지 프로그램`,
    `${locationKeyword} 정통 ${mod1} 마사지 및 ${mod2} 정보`,
    `[공식 제휴] ${simpleLocation} ${mod2} 마사지 & 바디케어`,
    `${locationKeyword} 1:1 맞춤형 ${mod1} 마사지 테라피 가이드`,
    `체계적인 바디케어 | ${simpleLocation} 전문 마사지 제휴 정보`,
    `${locationKeyword} 도심 속 힐링, ${mod1} ${mod2} 마사지`
  ];

  const finalTitle = titleTemplates[variantIndex % titleTemplates.length] + ` (${mod1} ${mod2})`;
  const finalDescription = `${locationKeyword} 지역 검증된 ${mod1} ${mod2} 마사지 제휴 샵 안내. 투명한 정찰제 요금과 쾌적한 휴식 공간, 숙련된 테라피스트의 프로그램을 리추얼에서 확인하세요.`;

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: [
      `${locationKeyword} 마사지`,
      `${locationKeyword} 스웨디시`,
      `${locationKeyword} 아로마마사지`,
      `${simpleLocation} 웰니스 테라피`,
      `${simpleLocation} 바디케어`,
      "리추얼"
    ],
    alternates: {
      canonical: `https://ritual-therapy.netlify.app/${region}/${encodeURIComponent(districtName)}${dongName ? `?dong=${encodeURIComponent(dongName)}` : ""}`,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `https://ritual-therapy.netlify.app/${region}/${encodeURIComponent(districtName)}${dongName ? `?dong=${encodeURIComponent(dongName)}` : ""}`,
      siteName: "리추얼(Ritual)",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "/og-main.png",
          width: 1200,
          height: 630,
          alt: `${locationKeyword} 마사지 가이드 - 리추얼`,
        },
      ],
    },
  };
}

export default async function RegionalDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams.dong ? decodeURIComponent(resolvedSearchParams.dong) : "";
  const districtName = decodeURIComponent(district);
  const regionName = region === "seoul" ? "서울특별시" : region === "incheon" ? "인천광역시" : "경기도";
  
  const fullTitle = dongName 
    ? `${regionName} ${districtName} (${dongName})` 
    : `${regionName} ${districtName}`;

  // 🌟 "출장" 단어가 완전히 배제된 클린 웰니스 샵 이름 및 설명 구성
  const localShops = [
    {
      id: 1,
      name: `✨ ${fullTitle} 제휴 한국골든테라피`,
      desc: "고품격 릴렉싱 & 딥티슈 피로회복! 전문 테라피스트의 품격 있는 1:1 맞춤 바디케어",
      phone: "0507-1280-3361",
      price: "맞춤 코스별 상이",
      image: "/shop1.jpg"
    },
    {
      id: 2,
      name: `🌸 ${fullTitle} 제휴 한국미인테라피`,
      desc: "최고급 천연 오일을 활용한 감성 아로마 전신 바디케어 및 스웨디시 프로그램",
      phone: "0507-1280-3303",
      price: "맞춤 코스별 상이",
      image: "/shop2.jpg"
    },
    {
      id: 3,
      name: `💎 ${fullTitle} 제휴 주주테라피`,
      desc: "재방문율 높은 만족도! 철저한 위생 관리와 프라이빗 힐링 바디케어 서비스 제공",
      phone: "0507-1280-3193",
      price: "맞춤 코스별 상이",
      image: "/shop3.jpg"
    },
    {
      id: 4,
      name: `👑 ${fullTitle} 제휴 퀸즈홈테라피`,
      desc: "품격 있게 누리는 웰니스 공간! 전문 힐러들의 체형 맞춤형 피로회복 특화 프로그램",
      phone: "0507-1280-3334",
      price: "맞춤 코스별 상이",
      image: "/shop4.jpg"
    },
    {
      id: 5,
      name: `🌙 ${fullTitle} 제휴 오늘밤테라피`,
      desc: "엄선된 우수 제휴점! 수도권 전지역 쾌적하고 편안한 힐링 바디케어",
      phone: "0507-1280-3223",
      price: "맞춤 코스별 상이",
      image: "/shop5.jpg"
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${fullTitle} 웰니스 마사지 & 바디케어 안내 - 리추얼`,
    "description": `${fullTitle} 지역 프리미엄 힐링 테라피 제휴업체 정보 제공`,
    "url": `https://ritual-therapy.netlify.app/${region}/${encodeURIComponent(districtName)}`,
    "telephone": "0507-1280-3344",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": districtName,
      "addressRegion": regionName,
      "addressCountry": "KR"
    }
  };

  return (
    <div className="bg-[#08080a] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-12">
        
        {/* 상단 지역 대표 배너 */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] bg-gradient-to-b from-neutral-900 to-[#08080a]">
          <img 
            src="/banner.jpg" 
            alt={`${fullTitle} 프리미엄 힐링 마사지 안내`} 
            className="w-full h-56 md:h-72 object-cover filter brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
              {regionName.toUpperCase()} · LOCAL WELLNESS GUIDE
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {fullTitle} 프리미엄 힐링 마사지 안내
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {fullTitle} 고객님을 위한 엄선된 힐링 테라피 및 바디케어 제휴 샵 안내입니다. 투명하고 정직한 프로그램을 확인해 보세요.
            </p>
          </div>
        </section>

        {/* 클라이언트 사이드 키워드 믹서 영역 */}
        <ClientTextMixerInline locationText={fullTitle} />

        {/* 제휴업체 5개 카드리스트 */}
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs text-amber-400 font-bold tracking-widest uppercase">RECOMMENDED PARTNERS</p>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              {fullTitle} 추천 제휴업체 (총 5곳)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localShops.map((lShop) => (
              <div key={lShop.id} className="bg-[#121216] border border-amber-500/20 hover:border-amber-500/60 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all group relative">
                <Link href={`/shop/${lShop.id}?region=${encodeURIComponent(fullTitle)}`} className="absolute inset-0 z-10" aria-label={`${lShop.name} 상세페이지 보기`} />
                <img 
                  src={lShop.image} 
                  alt={lShop.name} 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                    {lShop.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                    {lShop.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">{lShop.price}</span>
                    <a 
                      href={`tel:${lShop.phone}`} 
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow transition-all transform active:scale-95 relative z-20"
                    >
                      전화예약
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 건강 칼럼 섹션 */}
        <section className="bg-[#0f0f13] p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base md:text-lg font-bold text-amber-400 flex items-center gap-2">
            <span>🌿</span> {fullTitle} 힐링 바디케어 & 스트레칭 건강 가이드
          </h3>
          <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
            <p>
              현대 직장인들이 오랫동안 앉아서 일하거나 스마트폰을 지속적으로 사용할 경우, 승모근과 목 주변의 근육이 경직되어 만성 두통이나 피로감을 유발하기 쉽습니다. 주기적인 스트레칭과 맞춤형 전신 바디케어는 체내 순환을 돕고 일상의 활력을 되찾는 데 큰 도움이 됩니다.
            </p>
            <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="font-bold text-white text-xs">💡 나에게 맞는 테라피 프로그램 선택 기준</h4>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400">
                <li><strong className="text-gray-200">건식 릴렉싱 케어:</strong> 하체 근육과 견갑골 주위의 굳은 부위를 풀어주어 근육 긴장을 해소합니다.</li>
                <li><strong className="text-gray-200">아로마 & 스웨디시:</strong> 최고급 천연 오일로 부드러운 림프 순환과 심신 안정, 부종 완화에 탁월합니다.</li>
                <li><strong className="text-gray-200">프라이빗 웰니스:</strong> 이동 시간 없이 익숙하고 편안한 개인 공간에서 온전한 휴식을 누립니다.</li>
              </ul>
            </div>
            <p className="text-gray-400 text-[11px]">
              * 본 가이드는 {fullTitle} 주민 여러분의 건강한 피로 회복과 올바른 힐링 정보 제공을 목적으로 작성되었습니다.
            </p>
          </div>
        </section>

        {/* 이용 방법 4단계 */}
        <section className="bg-[#0f0f13] p-6 md:p-8 rounded-3xl border border-amber-500/30 space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">SERVICE PROCESS</span>
            <h3 className="text-xl font-black text-white mt-1">{fullTitle} 서비스 이용 순서</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 1</span>
              <h4 className="font-bold text-white mt-1">지역 확인</h4>
              <p className="text-xs text-gray-400 mt-1">{fullTitle} 제휴 샵 정보를 확인합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 2</span>
              <h4 className="font-bold text-white mt-1">프로그램 비교</h4>
              <p className="text-xs text-gray-400 mt-1">취향에 맞는 코스를 살펴봅니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 3</span>
              <h4 className="font-bold text-white mt-1">상담 및 예약</h4>
              <p className="text-xs text-gray-400 mt-1">전화나 문자로 일정을 조율합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 4</span>
              <h4 className="font-bold text-white mt-1">힐링 케어</h4>
              <p className="text-xs text-gray-400 mt-1">투명한 정찰제로 쾌적한 휴식을 즐깁니다.</p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 (FAQ) */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">FAQ & GUIDE</span>
            <h3 className="text-xl font-black text-white mt-1">{fullTitle} 자주 묻는 질문</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> {fullTitle} 제휴 샵은 어떤 프로그램이 있나요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-emerald-400 font-bold">A.</span> 아로마 오일 테라피, 감성 스웨디시, 정통 릴렉스 케어 등 다양한 맞춤형 프로그램이 준비되어 있습니다.
              </p>
            </div>
            <div className="bg-[#121216] p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> 요금은 투명하게 공개되나요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-emerald-400 font-bold">A.</span> 모든 제휴처는 정찰제를 기반으로 투명한 요금 정보를 제공하고 있습니다.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* 푸터 영역 */}
      <footer className="bg-[#040405] border-t border-white/10 py-10 text-center text-gray-500 text-xs mt-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div>
            <a 
              href="tel:0507-1280-3344" 
              className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-4 py-2 rounded-xl border border-amber-500/30 hover:border-amber-400 transition-all text-xs shadow-md"
            >
              <span>🤝</span> 리추얼 입점 및 제휴문의 (0507-1280-3344)
            </a>
          </div>
          <p className="text-gray-400 font-bold">리추얼(Ritual)은 건전하고 안전한 힐링 테라피 & 바디케어 정보 안내 플랫폼입니다.</p>
          <p className="text-[11px] text-gray-600">COPYRIGHT &copy; Ritual ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}