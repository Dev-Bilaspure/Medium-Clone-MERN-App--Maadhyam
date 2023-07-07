import HomeBanner from "@/components/secondary/HomeBanner";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BlogPosts from "../../components/secondary/BlogPosts";
import Suggestions from "../../components/secondary/Suggestions";
import { twMerge } from "tailwind-merge";
import TagsTabs from "../../components/secondary/TagsTabs";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import FetchingDataLoader from "@/components/primary/FetchingDataLoader";
import { Link, useNavigate } from "react-router-dom";
import WritingTips from "@/components/secondary/ShortCards/WritingTips";
import SEO from "@/components/primary/SEO";

const Home = (props) => {
  const {
    data: { authenticatedUser },
    actions: {
      post: { getAllPosts },
    },
  } = useStore();
  const [posts, setPosts] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      try {
        const response = await getAllPosts();
        if (response.success) {
          setPosts(response.posts);
        }
        debug_mode && console.log(response);
      } catch (error) {
        debug_mode && console.log(error);
      }
      setIsFetching(false);
    })();
  }, []);

  return (
    <div className={twMerge(`mb-20 w-full`, props.className)}>
      <SEO options={{ title: "Maadhyam" }} />
      <HomeBanner className={`${authenticatedUser ? "hidden" : "block"}`} />
      <div className="flex w-full flex-row  sm:flex-col sm:space-y-10 mb-40">
        <div className="w-2/3 px-[100px] pt-[0px] sm:pt-0 md:px-[40px] sm:w-full sm:px-5">
          {isFetching ? (
            <div className={`flex justify-center ${!authenticatedUser ? 'mt-10 sm:mt-5' : "mt-20 sm:mt-10"}`}>
              <FetchingDataLoader />
            </div>
          ) : (
            <BlogPosts
              posts={posts}
              isFetching={isFetching}
              setPosts={setPosts}
              className="mt-10"
              noPostsMessage="No posts yet"
            />
          )}
        </div>
        <div className="h-screen  w-1/3 space-y-5 border-l border-gray px-10 pl-10 sm:w-full sm:border-none sm:px-5">
          <div className="mt-10 flex flex-col pt-[20px]">
            <WritingTips />
            <Suggestions />
            <TagsTabs />
            <div className="mt-5 pr-20 sm:pr-0">
              <p className="text-[16px] font-medium">Bookmark</p>
              <p className="mt-2 text-[14px] text-[#757575]">
                Click the{" "}
                <i className="fa-regular fa-bookmark mx-1 text-[17px]"></i> any
                story to easily add it to your reading list or a custom list
                that you can share.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
