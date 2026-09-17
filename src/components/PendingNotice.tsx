import { findCohort } from "@/lib/curriculum";

// 운영자 승인 전까지 수강생에게 보여주는 안내 화면.
export default function PendingNotice({
  name,
  email,
  cohortId,
  status,
}: {
  name: string;
  email: string;
  cohortId: string | null;
  status: "pending" | "rejected";
}) {
  const cohort = cohortId ? findCohort(cohortId) : null;
  const rejected = status === "rejected";

  return (
    <div className="card" style={{ padding: 40, maxWidth: 560, margin: "40px auto", textAlign: "center" }}>
      <div className={"pending-badge" + (rejected ? " no" : "")}>
        {rejected ? "가입 반려됨" : "승인 대기 중"}
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "16px 0 10px" }}>
        {rejected ? `${name}님, 가입이 반려됐어요` : `${name}님, 가입 신청이 접수됐어요`}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
        {rejected ? (
          <>수강생 명단에서 확인되지 않았어요.<br />잘못된 경우 운영팀에 문의해주세요.</>
        ) : (
          <>운영팀이 수강생 명단과 대조한 뒤 승인해드립니다.<br />승인되면 과정 공지·자료·일정이 바로 열려요.</>
        )}
      </p>

      <div className="signup-done" style={{ textAlign: "left", marginTop: 26 }}>
        <div><span>신청 과정</span><b>{cohort?.label ?? "미배정"}</b></div>
        {cohort && <div><span>교육 기간</span><b>{cohort.period}</b></div>}
        <div><span>이메일</span><b>{email}</b></div>
      </div>
    </div>
  );
}
