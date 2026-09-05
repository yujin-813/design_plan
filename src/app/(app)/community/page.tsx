import { Suspense } from "react";
import { getPosts } from "@/lib/data";
import NewPostForm from "@/components/NewPostForm";
import CommunityFeed from "@/components/CommunityFeed";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const posts = await getPosts();
  return (
    <>
      <div className="phead">
        <div><h1>자유수다</h1><p>기수 상관없이 편하게 떠드는 곳. 잡담부터 정보공유까지 뭐든 좋아요.</p></div>
        <NewPostForm />
      </div>
      <Suspense>
        <CommunityFeed posts={posts} />
      </Suspense>
    </>
  );
}
