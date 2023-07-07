import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/secondary/Navbar";
import Home from "./pages/Home";
import Authentication from "./pages/Auth";
import React, { useEffect, useState } from "react";
import Blog from "./pages/Blog";
import { useStore } from "./store/useStore";
import TestingImageUpload from "./pages/TestingImageUpload";
import TagPosts from "./pages/TagPosts";
import LikedPosts from "./pages/LikedPosts";
import BookmarkedPosts from "./pages/BookmarkedPosts";
import Settings from "./pages/Settings";
import SplashScreen from "./pages/SplashScreen";
import TestingQuill from "./pages/TestingQuill/TestingQuill";
import Write from "./pages/Write";
import UserProfile from "./pages/UserProfile";
import UserFFs from "./pages/UserProfile/UserFFs";
import NotFound from "./pages/NotFound";
import MyStories from "./pages/MyStories";

const RoutesList = () => {
  const {
    data: { authenticatedUser },
  } = useStore();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Authentication />} />
      <Route path="/signup" element={<Authentication />} />
      <Route path="/blog/:postId" element={<Blog />} />
      <Route path="/testing" element={<TestingImageUpload />} />
      <Route path="/tag/:tag" element={<TagPosts />} />
      <Route
        path="/me/settings"
        element={!authenticatedUser ? <Navigate to="/login" /> : <Settings />}
      />
      <Route
        path="/me/mystories"
        element={!authenticatedUser ? <Navigate to="/login" /> : <MyStories />}
      />
      <Route
        path="/me/mystories/drafts"
        element={!authenticatedUser ? <Navigate to="/login" /> : <MyStories />}
      />
      <Route
        path="/me/mystories/published"
        element={!authenticatedUser ? <Navigate to="/login" /> : <MyStories />}
      />
      <Route path="/testingquill" element={<TestingQuill />} />
      <Route path="/write" element={<Write />} />
      <Route path="/edit/:postId" element={<Write />} />
      <Route path="/:username" element={<UserProfile />} />
      <Route path="/:username/followers" element={<UserFFs />} />
      <Route path="/:username/followings" element={<UserFFs />} />
      <Route
        path="/me"
        element={
          !authenticatedUser ? (
            <Navigate to="/login" />
          ) : (
            <Navigate to={`/${authenticatedUser.username}`} />
          )
        }
      />
      <Route
        path="/me/liked"
        element={!authenticatedUser ? <Navigate to="/login" /> : <LikedPosts />}
      />
      <Route
        path="/me/bookmarks"
        element={
          !authenticatedUser ? <Navigate to="/login" /> : <BookmarkedPosts />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  const {
    data: { authenticatedUser },
    actions: {
      auth: { initializeUser },
    },
  } = useStore();

  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      if (authenticatedUser) return;
      setIsFetchingUser(true);
      await initializeUser();
      setIsFetchingUser(false);
    })();
  }, []);

  return (
    <div className={!isFetchingUser ? "mt-[65px] sm:mt-[57px]" : ""}>
      <HelmetProvider>
        <BrowserRouter>
          <Navbar />
          {isFetchingUser ? <SplashScreen /> : <RoutesList />}
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
