"use client";

import React, { useState, useEffect } from "react";
import { useUser, SignIn, SignOutButton } from "@clerk/nextjs";
import {
  User as UserIcon,
  Mail,
  Calendar,
  LogOut,
  ShieldCheck,
  Video,
  Settings,
  Users,
  Image as ImageIcon,
  Edit3,
  Heart,
  Plus,
  PlusCircle,
  CheckCircle,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Card from "@/components/Card";

const PRESET_GRADIENTS = [
  { id: "red-violet", name: "Crimson Eclipse", class: "from-red-600 via-rose-700 to-violet-800" },
  { id: "emerald-teal", name: "Northern Lights", class: "from-emerald-500 via-teal-600 to-cyan-700" },
  { id: "indigo-purple", name: "Midnight Sky", class: "from-indigo-600 via-purple-700 to-pink-600" },
  { id: "amber-orange", name: "Solar Flare", class: "from-amber-500 via-orange-600 to-red-600" },
  { id: "slate-zinc", name: "Cyberpunk Charcoal", class: "from-zinc-700 via-neutral-800 to-stone-950" }
];

const UserProfilePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("posts"); // posts, followers, following, edit
  
  // Customization State
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [gradientId, setGradientId] = useState("red-violet");
  const [userPosts, setUserPosts] = useState([]);
  
  // Followers & Following state
  const [followers, setFollowers] = useState([
    { id: 1, name: "AlphaStream", username: "alphastream", avatar: "/avatar1.png" },
    { id: 2, name: "NeonGamer", username: "neongamer", avatar: "/avatar2.png" },
    { id: 3, name: "Starlight_X", username: "starlightx", avatar: "/avatar3.png" }
  ]);
  const [following, setFollowing] = useState([
    { id: 4, name: "CyberCore", username: "cybercore", avatar: "/avatar4.png" },
    { id: 5, name: "PixiePixel", username: "pixiepixel", avatar: "/avatar5.png" }
  ]);

  // Modal State for new post
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostImg, setNewPostImg] = useState("");
  const [newPostDuration, setNewPostDuration] = useState("10:00");

  // Load customizations & local posts from localStorage
  useEffect(() => {
    if (isSignedIn && user) {
      const savedName = localStorage.getItem(`profile_name_${user.id}`);
      const savedBio = localStorage.getItem(`profile_bio_${user.id}`);
      const savedGradient = localStorage.getItem(`profile_gradient_${user.id}`);
      const savedPosts = localStorage.getItem(`profile_posts_${user.id}`);

      if (savedName) setDisplayName(savedName);
      else setDisplayName(user.fullName || "");

      if (savedBio) setBio(savedBio);
      else setBio("Sharing my passion for video entertainment on Bhaichara.");

      if (savedGradient) setGradientId(savedGradient);

      if (savedPosts) {
        setUserPosts(JSON.parse(savedPosts));
      } else {
        // Default Mock Posts
        const defaultPosts = [
          {
            _id: "user-mock-1",
            id: "user-mock-1",
            title: "Super High Quality HD Stream Tour 2026",
            img_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60",
            duration: "12:35",
            videoId: "U001",
            extracted_media: { direct_videos: [] }
          },
          {
            _id: "user-mock-2",
            id: "user-mock-2",
            title: "Aesthetic Sunset Beats & Ambient Visuals",
            img_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=60",
            duration: "08:12",
            videoId: "U002",
            extracted_media: { direct_videos: [] }
          }
        ];
        setUserPosts(defaultPosts);
        localStorage.setItem(`profile_posts_${user.id}`, JSON.stringify(defaultPosts));
      }
    }
  }, [isSignedIn, user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    localStorage.setItem(`profile_name_${user.id}`, displayName);
    localStorage.setItem(`profile_bio_${user.id}`, bio);
    localStorage.setItem(`profile_gradient_${user.id}`, gradientId);
    alert("Profile customization saved successfully!");
    setActiveTab("posts");
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost = {
      _id: `user-post-${Date.now()}`,
      id: `user-post-${Date.now()}`,
      title: newPostTitle,
      img_url: newPostImg.trim() || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60",
      duration: newPostDuration || "05:00",
      videoId: `UP${Math.floor(100 + Math.random() * 900)}`,
      extracted_media: { direct_videos: [] }
    };

    const updated = [newPost, ...userPosts];
    setUserPosts(updated);
    if (user) {
      localStorage.setItem(`profile_posts_${user.id}`, JSON.stringify(updated));
    }
    
    setNewPostTitle("");
    setNewPostImg("");
    setNewPostDuration("10:00");
    setShowAddPostModal(false);
  };

  const handleUnfollow = (id) => {
    setFollowing(following.filter(item => item.id !== id));
  };

  const handleRemoveFollower = (id) => {
    setFollowers(followers.filter(item => item.id !== id));
  };

  const activeGradient = PRESET_GRADIENTS.find(g => g.id === gradientId) || PRESET_GRADIENTS[0];

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-red-600 border-neutral-800 rounded-full animate-spin"></div>
          <p className="text-neutral-400 font-medium">Loading profile...</p>
        </div>
      </main>
    );
  }

  // SIGN IN REQUIRED PAGE
  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white py-12 px-4">
        <div className="text-center max-w-md mb-8">
          <h1 className="text-3xl font-extrabold uppercase tracking-wide text-white mb-2">
            Bhaichara Profile
          </h1>
          <p className="text-neutral-400 text-sm">
            Sign in to upload custom media, track your followers, and customize your profile dashboard.
          </p>
        </div>
        
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl flex justify-center">
          <SignIn routing="hash" />
        </div>
      </main>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Recently";

  return (
    <main className="min-h-screen bg-black md:pt-8 pt-4 pb-24  md:px-0 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Banner with configurable gradient */}
        <div className={`relative h-44 sm:h-56 rounded-3xl bg-linear-to-r ${activeGradient.class} overflow-hidden shadow-lg border border-neutral-800`}>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-2xs"></div>
          
          <button 
            onClick={() => setActiveTab("edit")}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-neutral-700/50 text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
          >
            <Sparkles size={12} />
            <span>Customize</span>
          </button>
        </div>

        {/* Profile Info Header */}
        <div className="relative px-6 pb-6 -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-5 justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-black bg-neutral-900 shadow-2xl shrink-0">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <UserIcon size={44} />
                </div>
              )}
            </div>
            
            <div className="mb-2 space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {displayName}
                </h2>
                <ShieldCheck size={20} className="text-red-500" />
              </div>
              <p className="text-neutral-400 font-medium text-sm flex items-center gap-2 justify-center sm:justify-start">
                <span>@{user.username || "user"}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                <span>Member since {memberSince}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => setShowAddPostModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg transition cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Post Media</span>
            </button>
            
            <SignOutButton redirectUrl="/">
              <button className="flex items-center justify-center p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition cursor-pointer">
                <LogOut size={16} />
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* Bio Section */}
        <div className="px-6 py-4 bg-neutral-900/30 border border-neutral-800/80 rounded-2xl mb-8">
          <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-500 mb-1">Bio</h3>
          <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
            {bio}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md rounded-2xl mb-8 py-4 text-center">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`space-y-0.5 cursor-pointer ${activeTab === "posts" ? "text-red-500" : "text-neutral-400 hover:text-white"}`}
          >
            <span className="block text-2xl font-black">{userPosts.length}</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Posts</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("followers")}
            className={`space-y-0.5 cursor-pointer border-x border-neutral-800/80 ${activeTab === "followers" ? "text-red-500" : "text-neutral-400 hover:text-white"}`}
          >
            <span className="block text-2xl font-black">{followers.length}</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Followers</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("following")}
            className={`space-y-0.5 cursor-pointer ${activeTab === "following" ? "text-red-500" : "text-neutral-400 hover:text-white"}`}
          >
            <span className="block text-2xl font-black">{following.length}</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Following</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800/80 mb-6 gap-6 px-2">
          {["posts", "followers", "following", "edit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold tracking-wide uppercase transition cursor-pointer relative ${
                activeTab === tab ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {tab === "edit" ? "Customize" : tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Panels */}
        <div className="px-2">
          {/* POSTS TAB */}
          {activeTab === "posts" && (
            <div>
              {userPosts.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900/10 border border-dashed border-neutral-800 rounded-2xl">
                  <Video size={40} className="mx-auto text-neutral-600 mb-4" />
                  <h4 className="text-lg font-bold">No media uploaded yet</h4>
                  <p className="text-neutral-500 text-sm mt-1 mb-4">Upload custom video feeds to get started.</p>
                  <button 
                    onClick={() => setShowAddPostModal(true)}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 text-xs font-bold transition cursor-pointer"
                  >
                    Post First Video
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {userPosts.map((post) => (
                    <Card key={post.id} data={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FOLLOWERS TAB */}
          {activeTab === "followers" && (
            <div className="max-w-md mx-auto space-y-3">
              {followers.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">No followers yet.</div>
              ) : (
                followers.map(follower => (
                  <div key={follower.id} className="flex items-center justify-between p-3.5 bg-neutral-900/40 border border-neutral-850 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-red-500 border border-neutral-700">
                        {follower.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{follower.name}</h4>
                        <p className="text-xs text-neutral-400">@{follower.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFollower(follower.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-850 hover:bg-red-950/20 hover:text-red-500 hover:border-red-950 text-xs font-semibold transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* FOLLOWING TAB */}
          {activeTab === "following" && (
            <div className="max-w-md mx-auto space-y-3">
              {following.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">Not following anyone yet.</div>
              ) : (
                following.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3.5 bg-neutral-900/40 border border-neutral-850 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-violet-500 border border-neutral-700">
                        {user.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{user.name}</h4>
                        <p className="text-xs text-neutral-400">@{user.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUnfollow(user.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-850 hover:bg-red-950/20 hover:text-red-500 hover:border-red-950 text-xs font-semibold transition cursor-pointer"
                    >
                      Unfollow
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CUSTOMIZE TAB */}
          {activeTab === "edit" && (
            <div className="max-w-2xl mx-auto bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-6">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-1">Customize Profile</h3>
                  <p className="text-neutral-400 text-xs">These customization settings are preserved locally.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-bold tracking-wider text-neutral-400">Display Name</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display Name"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-white outline-none focus:border-red-600 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-bold tracking-wider text-neutral-400">Bio Description</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Write a custom bio description..."
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-white outline-none focus:border-red-600 text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">Banner Theme Gradient</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      {PRESET_GRADIENTS.map((gradient) => (
                        <button
                          key={gradient.id}
                          type="button"
                          onClick={() => setGradientId(gradient.id)}
                          className={`p-3 rounded-xl border flex flex-col gap-2 text-left cursor-pointer transition ${
                            gradientId === gradient.id 
                              ? "border-red-600 bg-neutral-900" 
                              : "border-neutral-850 bg-neutral-950/60 hover:bg-neutral-900/60"
                          }`}
                        >
                          <div className={`h-6 w-full rounded-md bg-linear-to-r ${gradient.class}`}></div>
                          <span className="text-xs font-medium text-neutral-300">{gradient.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-850 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setActiveTab("posts")}
                    className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ADD POST MODAL */}
        {showAddPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Video size={18} className="text-red-500" />
                  <span>Post New Media</span>
                </h3>
                <button 
                  onClick={() => setShowAddPostModal(false)}
                  className="text-neutral-500 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddPost} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400">Video Title</label>
                  <input 
                    type="text"
                    required
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter video title..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 outline-none focus:border-red-600 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400">Thumbnail Image URL (Optional)</label>
                  <input 
                    type="url"
                    value={newPostImg}
                    onChange={(e) => setNewPostImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 outline-none focus:border-red-600 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400">Duration (MM:SS)</label>
                  <input 
                    type="text"
                    value={newPostDuration}
                    onChange={(e) => setNewPostDuration(e.target.value)}
                    placeholder="10:00"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 outline-none focus:border-red-600 text-sm text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddPostModal(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Post Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserProfilePage;
