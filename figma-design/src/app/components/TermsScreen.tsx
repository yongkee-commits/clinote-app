import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";

export function TermsScreen() {
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
            제1조 (목적)
          </h2>
          <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
            본 약관은 유브이더블유(이하 "회사")가 제공하는 AI 기반 리뷰 답변 및 문자 생성 자동화 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        {/* 제2조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제2조 (정의)
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">1. "서비스"</p>
              <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3">
                회사가 제공하는 AI 기반 리뷰 답변 생성, 문자 메시지 생성 및 관련 부가 서비스를 의미합니다.
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">2. "이용자"</p>
              <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3">
                본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium tracking-[-0.2px] mb-1">3. "회원"</p>
              <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3">
                회사와 서비스 이용 계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 제3조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제3조 (약관의 효력 및 변경)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 약관이 변경되는 경우 지체 없이 이를 공지합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              3. 회원이 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 이용 계약을 해지할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 제4조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제4조 (서비스의 제공 및 변경)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
              <li>AI 기반 리뷰 답변 자동 생성</li>
              <li>AI 기반 문자 메시지 자동 생성</li>
              <li>템플릿 기반 빠른 답변/문자 생성</li>
              <li>생성 이력 관리</li>
              <li>병원 정보 관리</li>
            </ul>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 회사는 서비스의 내용을 변경할 경우 그 사유 및 변경 내용을 회원에게 통지합니다.
            </p>
          </div>
        </section>

        {/* 제5조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제5조 (서비스의 중단)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사는 다음 각 호에 해당하는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
              <li>서비스용 설비의 보수, 점검, 교체 시</li>
              <li>정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우</li>
              <li>기타 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우</li>
            </ul>
          </div>
        </section>

        {/* 제6조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제6조 (회원가입)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 이용자는 회사가 정한 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
            </p>
            <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
              <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
              <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
            </ul>
          </div>
        </section>

        {/* 제7조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제7조 (이용 요금)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 서비스의 이용은 유료를 원칙으로 하며, 회사가 제공하는 서비스의 이용 요금은 서비스별 안내 페이지에 명시된 바에 따릅니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 회사는 필요한 경우 서비스의 요금을 변경할 수 있으며, 요금이 변경되는 경우 변경 7일 전까지 공지합니다.
            </p>
          </div>
        </section>

        {/* 제8조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제8조 (환불 정책)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 결제 후 7일 이내 서비스를 사용하지 않은 경우 100% 환불이 가능합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 서비스 이용 후에는 이용 기간을 일할 계산하여 환불합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              3. 회원의 귀책사유로 인한 환불은 불가합니다.
            </p>
          </div>
        </section>

        {/* 제9조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제9조 (회원의 의무)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              회원은 다음 행위를 하여서는 안 됩니다:
            </p>
            <ul className="list-disc list-inside text-[13px] text-text2 tracking-[-0.2px] leading-relaxed pl-3 space-y-1">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ul>
          </div>
        </section>

        {/* 제10조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제10조 (회사의 의무)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사는 관련 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보 보호를 위해 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.
            </p>
          </div>
        </section>

        {/* 제11조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제11조 (저작권의 귀속)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 회원이 서비스를 통해 생성한 컨텐츠에 대한 저작권은 회원에게 귀속되며, 회사는 이를 서비스 개선 및 AI 학습 목적으로만 사용할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 제12조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제12조 (면책 조항)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              3. 회사는 AI가 생성한 컨텐츠의 정확성, 완전성, 적합성에 대해 보증하지 않으며, 이로 인한 손해에 대해 책임을 지지 않습니다.
            </p>
          </div>
        </section>

        {/* 제13조 */}
        <section>
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">
            제13조 (분쟁 해결)
          </h2>
          <div className="space-y-3">
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              1. 회사와 회원은 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.
            </p>
            <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed">
              2. 제1항의 노력에도 불구하고 분쟁이 해결되지 않은 경우, 관할 법원은 민사소송법에 따라 정합니다.
            </p>
          </div>
        </section>

        {/* 부칙 */}
        <section className="pt-4 border-t border-border">
          <h2 className="text-[16px] font-bold tracking-[-0.3px] mb-3">부칙</h2>
          <p className="text-[13px] text-text2 tracking-[-0.2px] leading-relaxed mb-6">
            본 약관은 2026년 2월 21일부터 시행합니다.
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
        <MobileLayout title="이용약관" showSettings={false} showBack={true}>
          {Content}
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <DesktopLayout>
          <div className="p-6">
            <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
              이용약관
            </h1>
            {Content}
          </div>
        </DesktopLayout>
      </div>
    </>
  );
}