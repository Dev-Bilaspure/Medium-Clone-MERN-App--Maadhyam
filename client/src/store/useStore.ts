import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { AXIOS_ERROR } from "@/utils/errorTypes";
import { debug_mode } from "@/debug-controller";
import { SERVER_ORIGIN } from "@/constants";

const ORIGIN = SERVER_ORIGIN;
axios.defaults.withCredentials = true;
export const useStore = create<State, [["zustand/immer", never]]>(
  immer((set, get) => ({
    data: {
      authenticatedUser: null,
    },
    actions: {
      setAuthenticatedUser: (user) => {
        set((state) => {
          state.data.authenticatedUser = user;
        });
      },
      auth: {
        initializeUser: async () => {
          try {
            const response = await axios.get(`${ORIGIN}/api/auth/me`);
            if (response.data.success) {
              set((state) => {
                state.data.authenticatedUser = response.data.user;
              });
            } else {
              set((state) => {
                state.data.authenticatedUser = null;
              });
            }
            return response.data;
          } catch (error) {
            debug_mode && console.log(error);
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        loginUser: async ({ email, password }) => {
          try {
            const response = await axios.post(`${ORIGIN}/api/auth/login`, {
              email,
              password,
            });
            if (response.data.success) {
              // Cookies.set("token", response.data.token);
              await get().actions.auth.initializeUser();
            }
            console.log(response);
            return response.data;
          } catch (error) {
            debug_mode && console.log(error);
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        logoutUser: async () => {
          try {
            const response = await axios.get(`${ORIGIN}/api/auth/logout`);
            if (response.data.success) {
              set((state) => {
                state.data.authenticatedUser = null;
              });
            }
            console.log(response.data);
            return response.data;
          } catch (error) {
            debug_mode && console.log(error);
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        signupUser: async ({ firstName, lastName, email, password }) => {
          const response = await axios.post(`${ORIGIN}/api/auth/signup`, {
            firstName,
            lastName,
            email,
            password,
          });
          if (response.data.success) {
            await get().actions.auth.initializeUser();
          }
          return response.data;
        },
        checkUsernameAvailability: async (username) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/auth/usernameavailability/${username}`
            );
            return response.data;
          } catch (error) {
            debug_mode && console.log(error);
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
      },
      user: {
        getUserByUsername: async (username) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/users/username/${username}`
            );
            if (response.data.success) {
              const { success, user, message } = response.data;
              return { success, user, message };
            } else {
              return response.data;
            }
          } catch (error) {
            debug_mode && console.log(error);
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        updateUser: async (userInfo) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.put(
              `${ORIGIN}/api/users/${userId}`,
              userInfo
            );
            if (response.data.success) {
              set((state) => {
                state.data.authenticatedUser = response.data.user;
              });
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        followAUser: async (userIdToFollow) => {
          try {
            const response = await axios.put(
              `${ORIGIN}/api/users/follow/${get().data.authenticatedUser._id}`,
              { userIdToFollow }
            );
            if (response.data.success) {
              set((state) => {
                state.data.authenticatedUser = response.data.user;
              });
              const { success, user, message } = response.data;
              return { success, user, message };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        unfollowAUser: async (userIdToUnfollow) => {
          try {
            const response = await axios.put(
              `${ORIGIN}/api/users/unfollow/${
                get().data.authenticatedUser._id
              }`,
              { userIdToUnfollow }
            );
            if (response.data.success) {
              set((state) => {
                state.data.authenticatedUser = response.data.user;
              });
              const { success, user, message } = response.data;
              return { success, user, message };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getUserById: async (userId) => {
          try {
            const response = await axios.get(`${ORIGIN}/api/users/${userId}`);
            if (response.data.success) {
              const { success, user, message } = response.data;
              return { success, user, message };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getUsersFollowers: async (userId) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/users/followers/${userId}`
            );
            if (response.data.success) {
              const { success, users, message } = response.data;
              return { success, users, message };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getUsersFollowing: async (userId) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/users/followings/${userId}`
            );
            if (response.data.success) {
              const { success, message, users } = response.data;
              return { success, message, users };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getSuggestedUsers: async () => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/users/users/suggestions`
            );
            if (response.data.success) {
              const { success, message, users } = response.data;
              return { success, message, users };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        bookmarkAPost: async (postId) => {
          try {
            const response = await axios.put(
              `${ORIGIN}/api/users/bookmark/${
                get().data.authenticatedUser._id
              }`,
              { postId }
            );
            if (response.data.success) {
              set((state) => {
                state.data.authenticatedUser = response.data.user;
              });
              const { success, message, user } = response.data;
              return { success, message, user };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        unbookmarkAPost: async (postId) => {
          try {
            const response = await axios.put(
              `${ORIGIN}/api/users/unbookmark/${
                get().data.authenticatedUser._id
              }`,
              { postId }
            );
            if (response.data.success) {
              set((state) => {
                state.data.authenticatedUser = response.data.user;
              });
              const { success, message, user } = response.data;
              return { success, message, user };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getUsersBookmarkedPosts: async () => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.get(
              `${ORIGIN}/api/users/bookmarked-posts/${userId}`
            );
            if (response.data.success) {
              const { success, message, posts } = response.data;
              return { success, message, posts };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
      },
      post: {
        getNonPublishedPostsByUserId: async (userId) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/posts/unpublished/${userId}`
            );
            if (response.data.success) {
              const { success, message, posts } = response.data;
              return { success, message, posts };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              errorType: AXIOS_ERROR,
              error,
            };
          }
        },
        updatePost: async (postInfo) => {
          try {
            const authorId = get().data.authenticatedUser._id;
            const { postId, ...otherPostInfo } = postInfo;
            const response = await axios.put(`${ORIGIN}/api/posts/${postId}`, {
              authorId,
              ...otherPostInfo,
            });
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            return response.data;
          } catch (error) {
            debug_mode && console.log(error);
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        publishPost: async (postId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.put(
              `${ORIGIN}/api/posts/publish/${postId}`,
              { userId }
            );
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        unPublishPost: async (postId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.put(
              `${ORIGIN}/api/posts/unpublish/${postId}`,
              { userId }
            );
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getPostsByUserId: async (userId) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/posts/user/${userId}`
            );
            if (response.data.success) {
              const { success, message, posts } = response.data;
              return { success, message, posts };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getPostsByTag: async (tag) => {
          try {
            const response = await axios.get(`${ORIGIN}/api/posts/tag/${tag}`);
            if (response.data.success) {
              const { success, message, posts } = response.data;
              return { success, message, posts };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        deletePost: async (postId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.delete(
              `${ORIGIN}/api/posts/${postId}/${userId}`
            );
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getAllPosts: async ({ pageno, pagesize }) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/posts?pageno=${pageno}&pagesize=${pagesize}`
            );
            if (response.data.success) {
              const { success, message, posts, totalPosts } = response.data;
              return { success, message, posts, totalPosts };
            }
            if (debug_mode) console.log({ res: response });

            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getPostById: async (postId) => {
          try {
            const response = await axios.get(`${ORIGIN}/api/posts/${postId}`);
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            return response.data;
          } catch (error) {
            debug_mode && console.log(error);
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        likeAPost: async (postId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.put(
              `${ORIGIN}/api/posts/like/${postId}`,
              { userId }
            );
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        unlikeAPost: async (postId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.put(
              `${ORIGIN}/api/posts/unlike/${postId}`,
              { userId }
            );
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getUsersLikedPosts: async () => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.get(
              `${ORIGIN}/api/posts/liked-posts/${userId}`
            );
            if (response.data.success) {
              const { success, message, posts } = response.data;
              return { success, message, posts };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },

        // dump ==============================

        /*
        createPost: async (postInfo) => {
          const storedToken = Cookies.get("token");
          if (storedToken) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${storedToken}`;
            const authorId = get().data.authenticatedUser._id;
            const response = await axios.post(`${ORIGIN}/api/posts`, {
              authorId,
              ...postInfo,
            });
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            const { success, message } = response.data;
            return { success, message };
          }
          return { success: false, message: "Token not found" };
        },
        updatePost: async (postInfo) => {
          const storedToken = Cookies.get("token");
          if (storedToken) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${storedToken}`;
            const { postId, ...otherInfo } = postInfo;
            const response = await axios.put(
              `${ORIGIN}/api/posts/${postId}`,
              otherInfo
            );
            if (response.data.success) {
              const { success, message, post } = response.data;
              return { success, message, post };
            }
            const { success, message } = response.data;
            return { success, message };
          }
          return { success: false, message: "Token not found" };
        },
        */
      },
      comment: {
        createComment: async (commentInfo) => {
          try {
            const authorId = get().data.authenticatedUser._id;
            const response = await axios.post(`${ORIGIN}/api/comments`, {
              authorId,
              ...commentInfo,
            });
            if (response.data.success) {
              const { success, message, comment } = response.data;
              return { success, message, comment };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        deleteComment: async (commentId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.delete(
              `${ORIGIN}/api/comments/${commentId}/${userId}`
            );
            if (response.data.success) {
              const { success, message, comment } = response.data;
              return { success, message, comment };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        updateComment: async (commentInfo) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const { commentId, content } = commentInfo;
            const response = await axios.put(
              `${ORIGIN}/api/comments/${commentId}`,
              { userId, content }
            );
            if (response.data.success) {
              const { success, message, comment } = response.data;
              return { success, message, comment };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        likeAComment: async (commentId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.put(
              `${ORIGIN}/api/comments/like/${commentId}`,
              { userId }
            );
            if (response.data.success) {
              const { success, message, comment } = response.data;
              return { success, message, comment };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        unlikeAComment: async (commentId) => {
          try {
            const userId = get().data.authenticatedUser._id;
            const response = await axios.put(
              `${ORIGIN}/api/comments/unlike/${commentId}`,
              { userId }
            );
            if (response.data.success) {
              const { success, message, comment } = response.data;
              return { success, message, comment };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
        getPostComments: async (postId) => {
          try {
            const response = await axios.get(
              `${ORIGIN}/api/comments/post/${postId}`
            );
            if (response.data.success) {
              const { success, message, comments } = response.data;
              return { success, message, comments };
            }
            return response.data;
          } catch (error) {
            return {
              success: false,
              message: "Axios error",
              error,
              errorType: AXIOS_ERROR,
            };
          }
        },
      },
    },
  }))
);
