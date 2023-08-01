import HomeBanner from "@/components/secondary/HomeBanner";
import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 5;

const Home = (props) => {
  const [posts, setPosts] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(10000);

  const {
    data: { authenticatedUser },
    actions: {
      post: { getAllPosts },
    },
  } = useStore();

  const fetchAllPost = async () => {
    setIsFetching(true);
    // setPage(Math.ceil(posts.length / PAGE_SIZE) + 1);
    const response = await getAllPosts({ pageno: page, pagesize: PAGE_SIZE });
    if (response.success && Array.isArray(response.posts)) {
      setPosts([...posts, ...response.posts]);
      response.totalPosts && setTotalPosts(response.totalPosts);
      setPage(page + 1);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchAllPost();
  }, []);

  return (
    <div className={twMerge(`mb-20 w-full`, props.className)}>
      <SEO options={{ title: "Maadhyam" }} />
      <HomeBanner className={`${authenticatedUser ? "hidden" : "block"}`} />
      <div className={"mb-40 flex w-full  flex-row sm:flex-col sm:space-y-10 "}>
        <div
          className={`w-2/3 border-r border-gray px-[100px] pt-[0px] md:px-[40px] sm:w-full sm:border-none sm:px-5 sm:pt-0 ${
            !authenticatedUser ? "mt-5" : ""
          }`}
        >
          {/* {isFetching ? (
            <div
              className={`flex justify-center ${
                !authenticatedUser ? "mt-10 sm:mt-5" : "mt-20 sm:mt-10"
              }`}
            >
              {posts.length === 0 ? (
                <FetchingDataLoader />
              ) : (
                <CircularProgress color="inherit" size={30} />
              )}
            </div>
          ) : (
            <BlogPosts
              posts={posts}
              isFetching={isFetching}
              setPosts={setPosts}
              className="mt-10"
              noPostsMessage="No posts yet"
            />
          )} */}
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchAllPost}
            hasMore={totalPosts > posts.length}
            loader={
              posts.length > 0 ? (
                <div className="flex justify-center overflow-hidden">
                  <CircularProgress color="inherit" size={30} />
                </div>
              ) : (
                ""
              )
            }
          >
            {posts.length === 0 && isFetching ? (
              <div className="mt-10 flex justify-center overflow-hidden">
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
          </InfiniteScroll>
        </div>
        <div className="h-screen  w-1/3 space-y-5 px-10 pl-10 sm:w-full sm:border-none sm:px-5">
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
