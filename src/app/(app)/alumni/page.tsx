import { redirect } from "next/navigation";

// 취업정보는 프로젝트(/projects)로 바뀌었습니다. 예전 링크를 위해 남겨둡니다.
export default function AlumniPage() {
  redirect("/projects");
}
