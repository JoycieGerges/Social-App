import React from "react";
import {
  createBrowserRouter,
  Navigate,
  NavLink,
  Outlet,
} from "react-router-dom";
import MainLayout from "../HomePage/HomePage";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import NotFound from "./NotFound/NotFound";
import AuthLayOut from "../AuthPage/AuthPage";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import Settings from "./Settings/Settings";
import Navbar from "../components/NavBar/NavBar";
import MyPosts from "./MyPosts/MyPosts";
import Comunity from "./ComunityPosts/Comunity";
import PostDetails from "./PostDetails/PostDetails";
import SavedPosts from "./SavedPosts/SavedPosts";
import Notifications from "./Notifications/Notifications";
import { FaArrowLeft } from "react-icons/fa";

const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");
  return token ? <Outlet /> : <Navigate to="/auth" />;
};

const PublicRoute = () => {
  const token = localStorage.getItem("userToken");
  return token ? <Navigate to="/" /> : <Outlet />;
};

const PageWrapper = ({ children, showBackButton = false }) => (
  <div className="min-h-screen bg-[#f0f2f5]">
    <Navbar />
    <section className="mx-auto max-w-6xl px-4 py-6">
      {showBackButton && (
        <NavLink to={"/"}>
          <div className="flex flex-row items-center gap-2 text-white mb-4 bg-[#00298D] border border-gray-700 hover:bg-gray-800 rounded-lg w-max px-3 py-1.5 transition-colors">
            <FaArrowLeft />
            <h2 className="leading-none">Back</h2>
          </div>
        </NavLink>
      )}
      {children}
    </section>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "settings", element: <Settings /> },
          {
            path: "Saved",
            element: (
              <div className="min-h-screen bg-[#f0f2f5] px-4 py-6 max-w-6xl mx-auto">
                <SavedPosts />
              </div>
            ),
          },
          {
            path: "Comunity",
            element: (
              <div className="min-h-screen bg-[#f0f2f5] px-4 py-6 max-w-6xl mx-auto">
                <Comunity />
              </div>
            ),
          },
          {
            path: "MyPosts",
            element: (
              <div className="min-h-screen bg-[#f0f2f5] px-4 py-6 max-w-6xl mx-auto">
                <MyPosts />
              </div>
            ),
          },
        ],
      },
      {
        path: "profile",
        element: (
          <PageWrapper>
            <Profile />
          </PageWrapper>
        ),
      },
      {
        path: "notifications",
        element: (
          <PageWrapper>
            <Notifications />
          </PageWrapper>
        ),
      },
      {
        path: "PostDetails/:id",
        element: (
          <PageWrapper showBackButton={true}>
            <PostDetails />
          </PageWrapper>
        ),
      },
    ],
  },

  {
    path: "auth",
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayOut />,
        children: [
          { index: true, element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
