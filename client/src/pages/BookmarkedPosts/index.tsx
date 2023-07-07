import { tagsArray } from "@/constants";
import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import TagsTabs from "@/components/secondary/TagsTabs";
import BlogPosts from "@/components/secondary/BlogPosts";
import axios from "axios";
import FetchingDataLoader from "@/components/primary/FetchingDataLoader";
import WritingTips from "@/components/secondary/ShortCards/WritingTips";
import SEO from "@/components/primary/SEO";

const BookmarkedPosts = () => {
  const [posts, setPosts] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const {
    actions: {
      user: { getUsersBookmarkedPosts },
    },
    data: { authenticatedUser },
  } = useStore();

  useEffect(() => {
    if (!authenticatedUser) return;
    (async () => {
      setIsFetching(true);
      try {
        const response = await getUsersBookmarkedPosts();
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
    <div className={`flex  w-full flex-row sm:flex-col`}>
      <SEO options={{ title: "Bookmarks" }} />
      <div className=" w-2/3 px-[100px] py-10 md:px-20 sm:w-full sm:px-5  ">
        <div className={` flex h-fit space-x-3  ${!authenticatedUser ? 'pb-10 sm:pb-5 border-b border-[#E6E6E6] mb-10' : " mb-5"}`}>
          <div className="h-[45px] w-[45px] rounded-full bg-[#E6E6E6] text-[25px] sm:h-[33px] sm:w-[33px] sm:text-[20px]">
            <i className="fa-solid fa-bookmark text-[rgb(45, 45, 45)] ml-[13px] mt-[9px]  sm:mt-[8px] sm:ml-[8px]"></i>
          </div>
          <p className="flex items-center justify-center font-sans text-[32px] font-bold sm:text-[25px]">
            {"Bookmarks"}
          </p>
        </div>
        <div>
          {isFetching ? (
            <div className="flex justify-center">
              <FetchingDataLoader />
            </div>
          ) : (
            <BlogPosts posts={posts} setPosts={setPosts} noPostsMessage={"Bookmarked posts will appear here."}/>
          )}
        </div>
      </div>
      <div className="w-1/3 border-l border-gray py-10 px-10 md:px-10 sm:w-full sm:px-5">
        <WritingTips />
        <TagsTabs />
      </div>
    </div>
  );
};

export default BookmarkedPosts;
