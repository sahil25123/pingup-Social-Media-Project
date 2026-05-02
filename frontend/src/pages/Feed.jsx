import React, { useEffect, useState } from "react";
import { assets} from "../assets/assets";
import Loading from "../components/Loading";
import StoryBar from "../components/StoryBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { ArrowUpRight, Sparkles, Zap } from "lucide-react";

function Feed() {
  const {getToken}  = useAuth()
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchFeed = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await api.get('/api/post/feed', {headers: {Authorization: `Bearer ${token}`}});

      if(data.success){
        setFeeds(data.posts);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar page-shell xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* {Storied and the post list} */}
      <div className="flex flex-col gap-5">
        <StoryBar />

        {/* Posts */}
          <div className="space-y-6">
            {feeds.length > 0 ? (
              feeds.map((post) => (
                <div 
                  key={post._id}
                  className="transform transition-all duration-300 "
                >
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="section-card glass-surface p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500">Start connecting with others to see posts in your feed!</p>
              </div>
            )}
          </div>
        </div>
      {/* Right sidebar */}
      <aside className="max-xl:hidden sticky top-4 w-[21.5rem] space-y-4">
        <div className="section-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-800 font-semibold">Sponsored</h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-full px-2 py-0.5">
              <Sparkles className="w-3 h-3" />
              Ad
            </span>
          </div>
          <img
            src={assets.sponsored_img}
            alt=""
            className="w-full h-52 object-cover rounded-xl subtle-border"
          />
          <div className="mt-3">
            <p className="text-slate-700 font-semibold text-lg">Email marketing</p>
            <p className="text-slate-500 mt-1 text-[15px] leading-relaxed">
            Supercharge your marketing with a powerful, easy-to-use platform
            built for results.
            </p>
          </div>
          <button className="mt-3 inline-flex items-center gap-1.5 text-sm text-teal-700 font-semibold hover:text-teal-800 transition cursor-pointer">
            Learn more
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <RecentMessages/>
      </aside>
    </div>
  ) : (
    <Loading />
  );
}

export default Feed;
