import React, { useState, useEffect } from "react";
import {
  MdNotificationsActive,
  MdDoneAll,
  MdOutlineNotificationsPaused,
  MdCheck,
} from "react-icons/md";
import { fetchNotifications } from "../../Javascript/getAllNotification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetchNotifications()
      .then((res) => {
        setNotifications(res.data.data.notifications);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const displayedNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  };

  const getNotificationText = (notif) => {
    const actorName = notif.actor?.name || "Someone";
    switch (notif.type) {
      case "comment_post":
        return `${actorName} commented on your post: "${notif.entity?.topComment?.content || ""}"`;
      case "like_post":
        return `${actorName} liked your post`;
      case "follow":
        return `${actorName} started following you`;
      default:
        return `${actorName} interacted with your content`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
  
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdNotificationsActive className="text-blue-500" size={28} />
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            You have{" "}
            <span className="text-blue-600 font-bold">
              {unreadCount} unread
            </span>{" "}
            messages
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <MdDoneAll size={16} />
          Mark all as read
        </button>
      </div>

   
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
            filter === "all"
              ? "bg-white text-blue-600 shadow-md"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            filter === "unread"
              ? "bg-white text-blue-600 shadow-md"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          UNREAD
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

  
      <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse">
            Loading notifications...
          </div>
        ) : displayedNotifications.length > 0 ? (
          displayedNotifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-5 border-b border-slate-50 flex items-center justify-between transition-all group ${
                !notif.isRead ? "bg-blue-50/40" : "bg-white"
              }`}
            >
              <div className="flex gap-4 items-start">
      
                <img
                  src={notif.actor?.photo}
                  alt={notif.actor?.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                />

                <div className="space-y-1">
                  <p
                    className={`text-sm leading-relaxed ${!notif.isRead ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}`}
                  >
                    {getNotificationText(notif)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {new Date(notif.createdAt).toLocaleDateString()}{" "}
                    </span>
                    {!notif.isRead && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 rounded font-bold uppercase">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>

         
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="p-2 text-blue-500 hover:bg-white rounded-full transition-all shadow-sm bg-blue-50"
                  >
                    <MdCheck size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdOutlineNotificationsPaused
                size={40}
                className="text-slate-300"
              />
            </div>
            <p className="text-slate-400 font-black text-sm uppercase tracking-widest">
              {filter === "unread" ? "Zero unread alerts" : "Inbox is empty"}
            </p>
          </div>
        )}
      </div>

      <p className="text-center text-slate-300 text-[10px] mt-8 font-bold uppercase tracking-tighter">
        Notifications are updated in real-time
      </p>
    </div>
  );
}
