import Logo from "./Logo";

const feats = [
  {
    title: "이벤트 & 특강",
    desc: "온라인·오프라인 모임에 바로 신청하고 구독해두기",
    icon: <><path d="M3 8l9-5 9 5-9 5z" /><path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" /></>,
  },
  {
    title: "내 수업 관리",
    desc: "듣는 동안엔 공지·자료·과제·일정, 끝난 뒤엔 취업·다음 세션 정보까지",
    icon: <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" /></>,
  },
  {
    title: "자유수다 & 멘토링",
    desc: "기수 상관없이 편하게 묻고 답하는 사람들",
    icon: <><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></>,
  },
];

export default function AuthBrandPanel() {
  return (
    <div className="authbrand">
      <div className="abtop">
        <Logo />
        <b>아르키</b>
      </div>
      <h2>AI 마케팅 수료생들이 계속 이어지는 곳</h2>
      <div className="feats">
        {feats.map((f) => (
          <div className="feat" key={f.title}>
            <span className="aico"><svg className="ico" viewBox="0 0 24 24">{f.icon}</svg></span>
            <div><b>{f.title}</b><small>{f.desc}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}
