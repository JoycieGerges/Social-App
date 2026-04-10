import { Outlet, Navigate } from "react-router-dom";
import UserDataCard from "../components/ui/Sidebar";
import FollowSuggest from "../components/ui/Suggested Friends";
import Navbar from "../components/NavBar/NavBar";

export default function HomePage() {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />

      <section className="mx-auto max-w-7xl  sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <aside className="hidden lg:block lg:col-span-3 sticky top-20">
            <UserDataCard />
          </aside>

          <main className="col-span-1 lg:col-span-6 space-y-6">
            <Outlet />
          </main>

          <aside className="hidden lg:block lg:col-span-3 sticky top-20">
            <FollowSuggest />
          </aside>
        </div>
      </section>
    </div>
  );
}
