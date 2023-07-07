interface State {
  data: {
    authenticatedUser: any;
  };
  actions: {
    setAuthenticatedUser: (user: any) => void;
    auth: {
      initializeUser: () => Promise<{
        success: boolean;
        message: string;
        error?: any;
        errorType?: string;
      }>;
      loginUser: ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => Promise<{
        success: boolean;
        message: string;
        error?: any;
        errorType?: string;
      }>;
      logoutUser: () => void;
      signupUser: ({
        firstName,
        lastName,
        email,
        password,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }) => Promise<{
        success: boolean;
        message: string;
        error?: any;
        errorType?: string;
      }>;
    };

    user: {
      getUserByUsername: (username: string) => Promise<{
        success: boolean;
        message: string;
        user?: any;
        error?: any;
        errorType?: string;
      }>;
      updateUser: ({
        firstName,
        lastName,
        password,
        username,
        bio,
        profilePicture,
      }: {
        firstName?: string;
        lastName?: string;
        password?: string;
        username?: string;
        bio?: string;
        profilePicture?: string;
      }) => Promise<{
        success: boolean;
        message: string;
        user?: any;
        error?: any;
        errorType?: string;
      }>;
      followAUser: (userIdToFollow: string) => Promise<{
        success: boolean;
        message: string;
        user?: any;
        error?: any;
        errorType?: string;
      }>;
      getUserById: (userId: string) => Promise<{
        success: boolean;
        message: string;
        user?: any;
        error?: any;
        errorType?: string;
      }>;
      getUsersFollowers: (userId: string) => Promise<{
        success: boolean;
        message: string;
        users?: any[];
        error?: any;
        errorType?: string;
      }>;
      getUsersFollowing: (userId: string) => Promise<{
        success: boolean;
        message: string;
        users?: any[];
        error?: any;
        errorType?: string;
      }>;
      getSuggestedUsers: () => Promise<{
        success: boolean;
        message: string;
        users?: any[];
        error?: any;
        errorType?: string;
      }>;
      unfollowAUser: (userIdToUnfollow: string) => Promise<{
        success: boolean;
        message: string;
        user?: any;
        error?: any;
        errorType?: string;
      }>;
      bookmarkAPost: (postId: string) => Promise<{
        success: boolean;
        message: string;
        user?: any;
        error?: any;
        errorType?: string;
      }>;
      unbookmarkAPost: (postId: string) => Promise<{
        success: boolean;
        message: string;
        user?: any;
        error?: any;
        errorType?: string;
      }>;
      getUsersBookmarkedPosts: () => Promise<{
        success: boolean;
        message: string;
        posts?: any[];
        error?: any;
        errorType?: string;
      }>;
    };

    post: {
      getNonPublishedPostsByUserId: (userId: string) => Promise<{
        success: boolean;
        message: string;
        posts?: any[];
        error?: any;
        errorType?: string;
      }>
      updatePost: ({
        postId,
        isPublished,
        isCommentsEnabled,
        tags
      }: {
        postId: string,
        isPublished: boolean,
        isCommentsEnabled: boolean,
        tags: string[]
      }) => Promise<{
        success: boolean;
        message: string;
        post?: any;
        error?: any;
        errorType?: string;
      }>;
      publishPost: (
        postId: string
      ) => Promise<{
        success: boolean;
        message: string;
        post?: any;
        error?: any;
        errorType?: string;
      }>;
      unPublishPost: (
        postId: string
      ) => Promise<{
        success: boolean;
        message: string;
        post?: any;
        error?: any;
        errorType?: string;
      }>;
      deletePost: (
        postId: string
      ) => Promise<{
        success: boolean;
        message: string;
        post?: any;
        error?: any;
        errorType?: string;
      }>;
      getAllPosts: () => Promise<{
        success: boolean;
        message: string;
        posts?: any[];
        error?: any;
        errorType?: string;
      }>;
      getPostsByUserId: (
        userId: string
      ) => Promise<{
        success: boolean;
        message: string;
        posts?: any[];
        error?: any;
        errorType?: string;
      }>;
      getPostsByTag: (tag: string) => Promise<{
        success: boolean;
        message: string;
        posts?: any[];
        error?: any;
        errorType?: string;
      }>;
      getPostById: (
        postId: string
      ) => Promise<{
        success: boolean;
        message: string;
        post?: any;
        error?: any;
        errorType?: string;
      }>;
      likeAPost: (
        postId: string
      ) => Promise<{
        success: boolean;
        message: string;
        post?: any;
        error?: any;
        errorType?: string;
      }>;
      unlikeAPost: (
        postId: string
      ) => Promise<{
        success: boolean;
        message: string;
        post?: any;
        error?: any;
        errorType?: string;
      }>;
      getUsersLikedPosts: () => Promise<{
        success: boolean;
        message: string;
        posts?: any[];
        error?: any;
        errorType?: string;
      }>;

      // dump===========================
      /*
      createPost: ({
        image,
        tags,
        title,
        description,
        isPublished,
      }: {
        image: string;
        tags: string[];
        title: string;
        description: string;
        isPublished: boolean;
      }) => Promise<{ success: boolean; message: string; post?: any }>;
      updatePost: ({
        title,
        description,
        image,
        tags,
        isPublished,
        userId,
        postId,
      }: {
        title?: string;
        description?: string;
        image?: string;
        tags?: string[];
        isPublished?: boolean;
        userId: string;
        postId: string;
      }) => Promise<{ success: boolean; message: string; post?: any }>;
      
      */
    };

    comment: {
      getPostComments: (
        postId: string
      ) => Promise<{
        success: boolean;
        message: string;
        comments?: any[];
        error?: any;
        errorType?: string;
      }>;
      createComment: ({
        postId,
        content,
      }: {
        postId: string;
        content: string;
      }) => Promise<{
        success: boolean;
        message: string;
        comment?: any;
        error?: any;
        errorType?: string;
      }>;
      likeAComment: (
        commentId: string
      ) => Promise<{
        success: boolean;
        message: string;
        comment?: any;
        error?: any;
        errorType?: string;
      }>;
      unlikeAComment: (
        commentId: string
      ) => Promise<{
        success: boolean;
        message: string;
        comment?: any;
        error?: any;
        errorType?: string;
      }>;
      deleteComment: (
        commentId: string
      ) => Promise<{
        success: boolean;
        message: string;
        comment?: any;
        error?: any;
        errorType?: string;
      }>;
      updateComment: ({
        commentId,
        content,
      }: {
        commentId: string;
        content: string;
      }) => Promise<{
        success: boolean;
        message: string;
        comment?: any;
        error?: any;
        errorType?: string;
      }>;
    };
  };
}
