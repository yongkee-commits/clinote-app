import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";

export function PrivacyScreen() {
  const Content = (
    <div className="pb-24 lg:pb-6">
      <div className="px-5 py-6 bg-card border-b border-border">
        <p className="text-[12px] text-text2 tracking-[-0.2px] leading-relaxed">
          최종 수정일: 2026년 2월 21일
        </p>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* 제1조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제1조 (개인정보의 수집 목적)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              회사는 다음의 목적을 위하여 개인정보를 수집하고 있습니다:
            </p>
            <div className="pl-3 space-y-2">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">1. 회원 관리</p>
                <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3">
                  회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인, 불만처리 등 민원처리
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">2. 서비스 제공</p>
                <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3">
                  AI 기반 리뷰 답변 생성, 문자 메시지 생성, 병원 정보 관리, 서비스 이용 기록 저장
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">3. 마케팅 및 광고 활용</p>
                <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3">
                  신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 접속 빈도 파악, 회원의 서비스 이용에 대한 통계
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 제2조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제2조 (수집하는 개인정보 항목)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있니다:
            </p>
            <div className="pl-3 space-y-3">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-2">필수항목</p>
                <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
                  <li>이름, 이메일, 전화번호</li>
                  <li>병원명, 병원 주소, 사업자등록번호</li>
                  <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                </ul>
              </div>
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-2">선택항목</p>
                <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
                  <li>프로필 사진</li>
                  <li>마케팅 수신 동의</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 제3조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제3조 (개인정보의 보유 및 이용기간)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
            </p>
            <div className="pl-3 space-y-3">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-2">회원 탈퇴 시</p>
                <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
                  <li>보존 항목: 이메일, 전화번호, 서비스 이용 기록</li>
                  <li>보존 근거: 불량 이용자의 재가입 방지, 명예훼손 등 권리침해 분쟁 및 수사협조</li>
                  <li>보존 기간: 1년</li>
                </ul>
              </div>
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-2">관련 법령에 의한 정보보유 사유</p>
                <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                  <li>표시/광고에 관한 기록: 6개월 (전자상거래법)</li>
                  <li>세법이 규정하는 모든 거래에 관한 장부 및 증빙서류: 5년 (국세기본법)</li>
                  <li>전자금융거래에 관한 기록: 5년 (전자금융거래법)</li>
                  <li>서비스 방문기록: 3개월 (통신비밀보호법)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 제4조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제4조 (개인정보의 파기절차 및 방법)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다:
            </p>
            <div className="pl-3 space-y-2">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">1. 파기절차</p>
                <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3">
                  회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">2. 파기방법</p>
                <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
                  <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다</li>
                  <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 제5조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제5조 (개인정보의 제3자 제공)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
              <li>이용자들이 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </div>
        </section>

        {/* 제6조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제6조 (개인정보 처리의 위탁)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다:
            </p>
            <div className="bg-card border border-border rounded-lg p-4 mt-3">
              <div className="space-y-3">
                <div>
                  <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">수탁업체</p>
                  <p className="text-[13px] text-text2 tracking-[-0.2px]">Amazon Web Services (AWS)</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">위탁업무 내용</p>
                  <p className="text-[13px] text-text2 tracking-[-0.2px]">클라우드 서버 제공 및 데이터 보관</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 제7조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제7조 (이용자의 권리와 의무)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 회사의 개인정보 처리에 동의하지 않는 경우 동의를 거부하거나 가입해지(회원탈퇴)를 요청할 수 있습니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 이용자는 개인정보를 최신의 상태로 유지해야 하며, 이용자의 부정확한 정보 입력으로 발생하는 문제의 책임은 이용자 자신에게 있습니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              3. 타인의 개인정보를 도용한 회원가입의 경우 이용자 자격을 상실하거나 관련 ���인정보호 법령에 의해 처벌받을 수 있습니다.
            </p>
          </div>
        </section>

        {/* 제8조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제8조 (개인정보 자동 수집 장치의 설치/운영 및 거부)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              3. 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
            </p>
          </div>
        </section>

        {/* 제9조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제9조 (개인정보 보호책임자)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
            </p>
            <div className="bg-card border border-border rounded-lg p-4 mt-3">
              <div className="space-y-3">
                <div>
                  <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">개인정보 보호책임자</p>
                  <p className="text-[13px] text-text2 tracking-[-0.2px]">이름: 이민경</p>
                  <p className="text-[13px] text-text2 tracking-[-0.2px]">직책: 대표</p>
                  <p className="text-[13px] text-text2 tracking-[-0.2px]">이메일: designbleach@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 제10조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제10조 (개인정보의 안전성 확보조치)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
            </p>
            <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>개인정보를 저장하는 데이터베이스 시스템에 대한 접근권한의 부여·변경·말소를 통한 개인정보에 대한 접근통제</li>
              <li>침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제</li>
              <li>개인정보의 암호화</li>
              <li>해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위한 보안프로그램 설치</li>
            </ul>
          </div>
        </section>

        {/* 제11조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제11조 (개인정보처리방침의 변경)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 다만, 개인정보의 수집 및 활용, 제3자 제공 등과 같이 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.
            </p>
          </div>
        </section>

        {/* 제12조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제12조 (권익침해 구제방법)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
              <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
              <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
              <li>대검찰청: 1301 (www.spo.go.kr)</li>
              <li>경찰청: 182 (ecrm.cyber.go.kr)</li>
            </ul>
          </div>
        </section>

        {/* 부칙 */}
        <section className="pt-4 border-t border-border">
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">부칙</h2>
          <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed mb-6">
            본 개인정보처리방침은 2026년 2월 21일부터 시행합니다.
          </p>
        </section>

        {/* 사업자 정보 */}
        <section className="pt-4 border-t border-border">
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">사업자 정보</h2>
          <div className="space-y-2">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              <span className="font-medium text-text">상호:</span> 유브이더블유
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              <span className="font-medium text-text">대표자:</span> 이민경
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              <span className="font-medium text-text">사업자등록번호:</span> 123-45-03602
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              <span className="font-medium text-text">이메일:</span> designbleach@gmail.com
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              <span className="font-medium text-text">업종:</span> 정보통신업
            </p>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileLayout title="개인정보처리방침" showSettings={false} showBack={true}>
          {Content}
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <DesktopLayout>
          <div className="p-6">
            <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
              개인정보처리방침
            </h1>
            {Content}
          </div>
        </DesktopLayout>
      </div>
    </>
  );
}