import { Suspense } from "react";
import { getPosts } from "@/lib/data";
import NewPostForm from "@/components/NewPostForm";
import CommunityFeed from "@/components/CommunityFeed";
import { getCurrentUser, isApproved } from "@/lib/currentUser";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const posts = await getPosts();
  const user = getCurrentUser();
  const writer = !user ? "guest" : isApproved(user) ? "ok" : "pending";
  return (
    <>
      <div className="phead">
        <div><h1>자유수다</h1><p>기수 상관없이 편하게 떠드는 곳. 잡담부터 정보공유까지 뭐든 좋아요.</p></div>
        <NewPostForm writer={writer} />
      </div>
      <Suspense>
        <CommunityFeed posts={posts} />
      </Suspense>
    </>
  );
}
