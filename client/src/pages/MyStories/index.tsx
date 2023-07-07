import Suggestions from "@/components/secondary/Suggestions";
import TagsTabs from "@/components/secondary/TagsTabs";
import { useStore } from "@/store/useStore";
import { convertNumberToShortFormat, getTimeAgo } from "@/utils/helperMethods";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { convert } from "html-to-text";
import _, { set } from "lodash";
import BlogOptionsMenu from "@/components/secondary/BlogOptionMenu";
import { debug_mode } from "@/debug-controller";
import FetchingDataLoader from "@/components/primary/FetchingDataLoader";
import SEO from "@/components/primary/SEO";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const MyStories = () => {
  const [publishedPosts, setPublishedPosts] = useState<any>([]);
  const [draftPosts, setDraftPosts] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [value, setValue] = React.useState(0);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  debug_mode && console.log(pathname.split("/")[3]);

  const {
    data: { authenticatedUser },
    actions: {
      post: { getNonPublishedPostsByUserId, getPostsByUserId },
    },
  } = useStore();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(`/me/mystories/${newValue === 0 ? "published" : "drafts"}`);
  };

  useEffect(() => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }

    if (pathname.split("/")[3] === "drafts") {
      setValue(1);
    }
    if (pathname.split("/")[3] === "published") {
      setValue(0);
    }
  }, [pathname]);

  useEffect(() => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }

    (async () => {
      setIsFetching(true);
      try {
        const response = await getPostsByUserId(authenticatedUser._id);
        if (response.success) {
          setPublishedPosts(response.posts);
        }
        debug_mode && console.log(response);
      } catch (error) {
        debug_mode && console.log(error);
      }
      try {
        const response = await getNonPublishedPostsByUserId(
          authenticatedUser._id
        );
        if (response.success) {
          setDraftPosts(response.posts);
        }
        debug_mode && console.log(response);
      } catch (error) {
        debug_mode && console.log(error);
      }
      setIsFetching(false);
    })();
  }, []);
  return (
    <div className="flex w-full flex-row  sm:flex-col sm:space-y-10">
      <SEO options={{ title: "Your Stories" }} />
      <div className="mt-7 w-2/3 px-[100px] pt-[20px] md:px-[40px] sm:w-full sm:px-5 ">
        <div className="flex h-fit space-x-10 ">
          <p className="item-center flex justify-center font-outfit text-[40px] sm:text-[28px]">
            Your stories
          </p>
          <div className="h-[50px] pt-[17px] sm:h-[35px] sm:pt-[10px]">
            <Button
              variant="contained"
              color="success"
              style={{
                textTransform: "none",
                borderRadius: 50,
                height: "100%",
                padding: 12,
                boxShadow: "none",
              }}
              onClick={() => navigate("/write")}
            >
              <p className="text-[13px] sm:text-[12px]">Write story</p>
            </Button>
          </div>
        </div>
        <div className="mt-10">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab
                label={`Published (${publishedPosts?.length || 0})`}
                style={{ textTransform: "none" }}
                {...a11yProps(0)}
              />
              <Tab
                label={`Drafts (${draftPosts?.length || 0})`}
                style={{ textTransform: "none" }}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="flex flex-col space-y-10 pt-4">
              {isFetching ? (
                <div className="flex justify-center">
                  <FetchingDataLoader />
                </div>
              ) : publishedPosts?.length === 0 ? (
                <div className="flex justify-center text-[14px] text-[#757575]">
                  Published posts will appear here.
                </div>
              ) : (
                publishedPosts.map((post) => {
                  return (
                    <div className="">
                      <Post
                        post={post}
                        setPosts={setPublishedPosts}
                        tabValue={value}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className="flex flex-col space-y-10  pt-4">
              {isFetching ? (
                <div className="flex justify-center">
                  <FetchingDataLoader />
                </div>
              ) : draftPosts?.length === 0 ? (
                <div className="flex justify-center text-[14px] text-[#757575]">
                  Draft posts will appear here.
                </div>
              ) : (
                draftPosts.map((post) => {
                  return (
                    <div className="">
                      <Post
                        post={post}
                        setPosts={setDraftPosts}
                        tabValue={value}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </CustomTabPanel>
        </div>
      </div>
      <div className="h-screen w-1/3 space-y-5 border-l border-gray px-10 pl-10 sm:w-full sm:border-none sm:px-5">
        <div className="mt-10 flex flex-col pt-[20px]">
          <TagsTabs />
          <div className="mt-5">
            <Suggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className="pt-4 sm:pt-3"
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Post = ({ post, setPosts, tabValue }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const {
    data: { authenticatedUser },
  } = useStore();

  const navigate = useNavigate();

  return (
    <div>
      <div className="flex font-sans text-[13px] font-medium text-[#757575] sm:text-[12px]">
        {getTimeAgo(post?.createdAt)}
        <div className="ml-[7px] mt-[9px] h-[2px] w-[2.5px] bg-[#757575]"></div>
        <span className="ml-[7px]  font-medium text-[#757575]">{`${post.views} views`}</span>
      </div>
      <div className="flex max-h-[126px] min-h-[126px] space-x-10 md:space-x-7 sm:space-x-4">
        <div
          className={`flex ${
            post.image?.length ? "w-2/3" : "w-full"
          } flex-col space-y-2 `}
        >
          <div className="flex h-full flex-col space-y-1">
            <Link to={`/${tabValue === 0 ? "blog" : "edit"}/${post._id}`}>
              <p className="font-outfit text-[19px] line-clamp-2 sm:text-[17px]">
                {post.title}
              </p>
            </Link>
            <Link to={`${tabValue === 0 ? "blog" : "edit"}`}>
              <p
                className="font-sans text-[14px] line-clamp-2 sm:text-[12px]"
                style={{ textTransform: "none" }}
              >
                {_.startCase(_.toLower(convert(post.description)))}
              </p>
            </Link>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-row space-x-7">
              <div className="flex flex-row space-x-1 ">
                <p className="mt-1 items-center justify-center font-sans text-[13px]">
                  {convertNumberToShortFormat(likesCount)} likes
                </p>
              </div>
            </div>
            {authenticatedUser && authenticatedUser._id === post.authorId && (
              <div className="item-center flex cursor-pointer justify-center">
                <BlogOptionsMenu
                  postId={post._id}
                  setPosts={setPosts}
                  post={post}
                />
              </div>
            )}
          </div>
        </div>
        {post.image?.length > 0 && (
          <div className="w-1/3">
            <Link to={`${tabValue === 0 ? "blog" : "edit"}`}>
              <img
                src={post.image}
                className="h-full w-full cursor-pointer object-cover "
              />
            </Link>
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-row flex-wrap space-x-2 sm:mt-3">
        {post?.tags?.map((tag) => {
          return (
            <div className="cursor-default rounded-full border border-[#E6E6E6] bg-[#E8E8E8] px-[8px] py-[1px] text-[11px] sm:px-[5px] sm:text-[10px]">
              {tag}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MyStories;
