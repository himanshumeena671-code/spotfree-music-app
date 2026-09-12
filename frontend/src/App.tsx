import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface RecentItem {
  id: number;
  title: string;
  subtitle: string;
  coverUrl: string | null;
  color: string;
  url?: string;
}

export interface PlaylistCard {
  id: number;
  title: string;
  desc: string;
  coverUrl: string;
  searchQuery?: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  duration_sec?: number;
  coverUrl: string;
  plays: string;
  url: string;
}

export interface CurrentSong {
  title: string;
  artist: string;
  coverUrl: string;
  durationSec: number;
  url: string;
}

export interface AppData {
  recentlyPlayed: RecentItem[];
  madeForYou: PlaylistCard[];
  topCharts: PlaylistCard[];
  trendingTracks: Track[];
  currentSong: CurrentSong | null;
  userDisplayName: string;
  userInitials: string;
}

/* ─── Icons ─────────────────────────────────────────────────────────────────── */

const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "white" : "currentColor"}>
    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6h7V20H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33A2 2 0 0 1 22 7.577V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
  </svg>
);

const SearchIcon = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "white" : "currentColor"}>
    <path d="M10.533 1.279c-5.18 0-9.407 4.927-8.32 10.453a9.27 9.27 0 0 0 7.48 7.338c2.498.48 4.95-.16 6.87-1.62L19.32 20.2c.374.374.98.374 1.353 0s.375-.978 0-1.353l-2.758-2.75a8.7 8.7 0 0 0 1.63-6.697 9.27 9.27 0 0 0-8.012-8.12zm-6.4 9.607a7.27 7.27 0 0 1 14.547 0 7.27 7.27 0 0 1-14.546 0z" />
  </svg>
);

const LibraryIcon = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "white" : "currentColor"}>
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134a1 1 0 0 0-1 0l-6 3.464a1 1 0 0 0 0 1.732l6 3.464a1 1 0 0 0 1 0l6-3.464a1 1 0 0 0 0-1.732l-6-3.464zM9.5 9.464V19a1 1 0 1 0 2 0V9.464l-1-.577-1 .577zm8 0V19a1 1 0 1 0 2 0V9.464l-1-.577-1 .577z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.29 1.71a1 1 0 0 1 1.42 0l5 5a1 1 0 0 1 0 1.42l-5 5a1 1 0 1 1-1.42-1.42L13.58 8l-3.29-3.29a1 1 0 0 1 0-1.42zM2 7.25h11.25a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1 0-1.5z" />
  </svg>
);

const PlaySmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
    <path d="M3 2v12l10-6z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 2v12l10-6z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 2h3v12H3zm7 0h3v12h-3z" />
  </svg>
);

const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.74a.7.7 0 0 1 1.05.6v11.78a.7.7 0 0 1-1.05.6L4 8.65V13.8a.7.7 0 0 1-1.4 0V1.7A.7.7 0 0 1 3.3 1z" />
  </svg>
);

const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.11A.7.7 0 0 0 1 1.71v11.78a.7.7 0 0 0 1.05.6L12 8.65V13.8a.7.7 0 0 0 1.4 0V1.7a.7.7 0 0 0-.7-.7z" />
  </svg>
);

const ShuffleIcon = ({ active }: { active?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? "#1db954" : "currentColor"}>
    <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.11 3H11.1a5.25 5.25 0 0 0-4.5 2.627L5.085 8.16A3.75 3.75 0 0 1 1.9 10H1.25a.75.75 0 0 0 0 1.5h.65a5.25 5.25 0 0 0 4.5-2.627l1.515-2.533A3.75 3.75 0 0 1 11.1 4h2.01l-1.02 1.018a.75.75 0 0 0 1.06 1.06L15.75 3.25 13.15.922zM1.25 5.5a.75.75 0 0 0 0 1.5h.65a3.75 3.75 0 0 1 3.185 1.763l.87 1.455a5.25 5.25 0 0 0 4.5 2.627h2.01l-1.02-1.018a.75.75 0 0 1 1.06-1.06l2.6 2.6-2.6 2.6a.75.75 0 0 1-1.06-1.06l1.02-1.018H11.6a6.75 6.75 0 0 1-5.785-3.377l-.87-1.455A5.25 5.25 0 0 0 1.9 7h-.65z" />
  </svg>
);

const RepeatIcon = ({ active }: { active?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? "#1db954" : "currentColor"}>
    <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.03 1.03a.75.75 0 0 1-1.06 1.06l-2.3-2.3a.75.75 0 0 1 0-1.06l2.3-2.3a.75.75 0 1 1 1.06 1.06l-1.03 1.03h2.44a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" />
  </svg>
);

const VolumeIcon = ({ level }: { level: number }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    {level === 0 ? (
      <path d="M13.86 5.47a.75.75 0 0 0-1.06 0l-1.5 1.5-1.5-1.5a.75.75 0 0 0-1.06 1.06l1.5 1.5-1.5 1.5a.75.75 0 1 0 1.06 1.06l1.5-1.5 1.5 1.5a.75.75 0 0 0 1.06-1.06l-1.5-1.5 1.5-1.5a.75.75 0 0 0 0-1.06zM2.5 5.5a.5.5 0 0 1 .5-.5h2.293L8.5 2.207a.5.5 0 0 1 .85.353v10.88a.5.5 0 0 1-.85.353L5.293 11H3a.5.5 0 0 1-.5-.5v-5z" />
    ) : (
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13.1a.75.75 0 0 1-1.125.65l-6.25-4.05H1.75A1.75 1.75 0 0 1 0 9.5v-3A1.75 1.75 0 0 1 1.75 4.8h.866l6.25-4.05a.75.75 0 0 1 .875.1zM2.25 6.3v3.4a.25.25 0 0 0 .25.25h1.22l4.78 3.1V2.95L3.72 6.05H2.5a.25.25 0 0 0-.25.25zm9.322 4.47a.75.75 0 0 0 1.06-1.06 2.5 2.5 0 0 0 0-3.52.75.75 0 1 0-1.06 1.06 1 1 0 0 1 0 1.42.75.75 0 0 0 0 1.06z" />
    )}
  </svg>
);

const HeartIcon = ({ filled, size = 16 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={filled ? "#1db954" : "currentColor"}>
    <path d="M1.69 2A4.58 4.58 0 0 1 8 2.02 4.58 4.58 0 0 1 14.31 2c2.28 0 4.19 1.91 4.19 4.19 0 3.25-4.33 6.95-9.15 10.51a1.2 1.2 0 0 1-1.41 0C3.18 13.14-.15 9.44-.15 6.19C-.15 3.91 1.76 2 4.04 2h-2.35z" />
  </svg>
);

const QueueIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v1.5H1V3.5z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.5 4.5V2.5h2V1h-3.5v3.5h1.5zm11 0V1H10V2.5h2.5v2h1.5zm0 9h-1.5v2H10V15h3.5v-3.5h-1.5zm-11 0h2V15H1v-3.5h1.5v2z" />
  </svg>
);

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */

function Skeleton({ w, h, rounded = "rounded" }: { w: string; h: string; rounded?: string }) {
  return <div className={`${w} ${h} ${rounded} animate-pulse`} style={{ background: "#282828" }} />;
}

function RecentSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
      <Skeleton w="w-14" h="h-14" rounded="rounded-l-md" />
      <Skeleton w="w-32" h="h-3" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl p-3" style={{ background: "#181818" }}>
      <Skeleton w="w-full" h="h-40" rounded="rounded-lg" />
      <div className="mt-3 flex flex-col gap-2">
        <Skeleton w="w-3/4" h="h-3.5" />
        <Skeleton w="w-1/2" h="h-3" />
      </div>
    </div>
  );
}

function TrackRowSkeleton({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <span className="w-5 text-center text-xs" style={{ color: "#b3b3b3" }}>{index + 1}</span>
      <Skeleton w="w-10" h="h-10" rounded="rounded" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton w="w-48" h="h-3.5" />
        <Skeleton w="w-24" h="h-3" />
      </div>
      <Skeleton w="w-32" h="h-3" />
      <Skeleton w="w-12" h="h-3" />
    </div>
  );
}

/* ─── Components ─────────────────────────────────────────────────────────────── */

function SeeAllBtn() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      className="text-xs font-bold transition-colors duration-150"
      style={{ color: hovered ? "#fff" : "#b3b3b3" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Show all
    </button>
  );
}

function Sidebar({
  activeNav,
  setActiveNav,
  playlists,
  loading,
  onQuickSearch,
}: {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  playlists: string[];
  loading: boolean;
  onQuickSearch: (query: string) => void;
}) {
  return (
    <aside className="flex flex-col w-64 p-2 gap-2 flex-shrink-0" style={{ background: "#000" }}>
      {/* Top Nav */}
      <div className="flex flex-col gap-1 p-2 rounded-lg" style={{ background: "#121212" }}>
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer mb-2" onClick={() => setActiveNav("home")}>
          <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center text-black font-bold">
            <i className="fa-solid fa-headphones text-sm"></i>
          </div>
          <span className="font-bold text-white tracking-tight">SpotFree</span>
        </div>
        <button
          onClick={() => setActiveNav("home")}
          className="flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors duration-150 text-left w-full"
          style={{ color: activeNav === "home" ? "#fff" : "#b3b3b3", background: activeNav === "home" ? "#282828" : "transparent" }}
        >
          <HomeIcon active={activeNav === "home"} />
          Home
        </button>
        <button
          onClick={() => setActiveNav("search")}
          className="flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors duration-150 text-left w-full"
          style={{ color: activeNav === "search" ? "#fff" : "#b3b3b3", background: activeNav === "search" ? "#282828" : "transparent" }}
        >
          <SearchIcon active={activeNav === "search"} />
          Search
        </button>
      </div>

      {/* Library */}
      <div className="flex flex-col flex-1 p-2 rounded-lg overflow-y-auto" style={{ background: "#121212" }}>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 font-semibold text-sm" style={{ color: "#b3b3b3" }}>
            <LibraryIcon />
            Your Library
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-full transition-colors duration-150 hover:bg-[#282828]" style={{ color: "#b3b3b3" }}>
              <PlusIcon />
            </button>
            <button className="p-1.5 rounded-full transition-colors duration-150 hover:bg-[#282828]" style={{ color: "#b3b3b3" }}>
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        {/* Quick Playlist Suggestions */}
        <div className="mt-3 flex flex-col gap-1">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-spotify-textsub mb-1">Quick Playlists</span>
          <button onClick={() => onQuickSearch("Top Hits 2026")} className="px-3 py-2 text-xs text-left text-[#b3b3b3] hover:text-white hover:bg-[#282828] rounded transition truncate">🔥 Today's Top Hits</button>
          <button onClick={() => onQuickSearch("Lo-Fi Chill Beats")} className="px-3 py-2 text-xs text-left text-[#b3b3b3] hover:text-white hover:bg-[#282828] rounded transition truncate">☕ Lo-Fi Chill Beats</button>
          <button onClick={() => onQuickSearch("Gym Workout Energy")} className="px-3 py-2 text-xs text-left text-[#b3b3b3] hover:text-white hover:bg-[#282828] rounded transition truncate">💪 Gym Workout Energy</button>
          <button onClick={() => onQuickSearch("Bollywood Chartbusters")} className="px-3 py-2 text-xs text-left text-[#b3b3b3] hover:text-white hover:bg-[#282828] rounded transition truncate">✨ Bollywood Chartbusters</button>
        </div>
      </div>
    </aside>
  );
}

function AlbumCard({ item, onPlay }: { item: PlaylistCard; onPlay?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col rounded-xl p-3 cursor-pointer transition-all duration-200"
      style={{ background: hovered ? "#282828" : "#181818", transform: hovered ? "translateY(-2px)" : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      <div className="relative mb-3 rounded-lg overflow-hidden" style={{ background: "#282828", aspectRatio: "1/1" }}>
        <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" style={{ boxShadow: "0 8px 24px rgba(0,0,0,.5)" }} />
        <div
          className="absolute bottom-2 right-2 flex items-center justify-center rounded-full transition-all duration-200"
          style={{ background: "#1db954", width: 40, height: 40, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)", boxShadow: "0 8px 16px rgba(0,0,0,.3)" }}
        >
          <PlaySmallIcon />
        </div>
      </div>
      <div className="text-sm font-semibold text-white truncate mb-0.5">{item.title}</div>
      <div className="text-xs truncate" style={{ color: "#b3b3b3" }}>{item.desc}</div>
    </div>
  );
}

function RecentCard({ item, onPlay }: { item: RecentItem; onPlay?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      className="flex items-center gap-3 rounded-md overflow-hidden text-left w-full transition-all duration-150"
      style={{ background: hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      <div className="rounded-l-md overflow-hidden flex-shrink-0" style={{ width: 56, height: 56 }}>
        {item.coverUrl ? (
          <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: item.color }}>
            <HeartIcon filled size={24} />
          </div>
        )}
      </div>
      <span className="font-semibold text-sm text-white flex-1 truncate">{item.title}</span>
      <div
        className="mr-3 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-150"
        style={{ background: "#1db954", width: 32, height: 32, opacity: hovered ? 1 : 0, transform: hovered ? "scale(1)" : "scale(0.8)" }}
      >
        <PlaySmallIcon />
      </div>
    </button>
  );
}

function TrendingRow({
  track,
  index,
  active,
  onPlay,
}: {
  track: Track;
  index: number;
  active: boolean;
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer"
      style={{ background: hovered ? "rgba(255,255,255,0.07)" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      <div className="w-5 flex items-center justify-center flex-shrink-0">
        {hovered ? (
          <PlaySmallIcon />
        ) : (
          <span className="text-sm font-medium tabular-nums" style={{ color: active ? "#1db954" : "#b3b3b3" }}>
            {active ? "▶" : index + 1}
          </span>
        )}
      </div>
      <div className="rounded overflow-hidden flex-shrink-0" style={{ width: 40, height: 40, background: "#282828" }}>
        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate" style={{ color: active ? "#1db954" : "#fff" }}>{track.title}</div>
        <div className="text-xs truncate" style={{ color: "#b3b3b3" }}>{track.artist}</div>
      </div>
      <div className="hidden md:block flex-1 min-w-0">
        <span className="text-sm truncate" style={{ color: "#b3b3b3" }}>{track.album}</span>
      </div>
      <div className="w-16 text-right">
        <span className="text-xs" style={{ color: "#b3b3b3" }}>{track.plays}</span>
      </div>
      <div className="w-12 text-right">
        <span className="text-sm tabular-nums" style={{ color: "#b3b3b3" }}>{track.duration}</span>
      </div>
    </div>
  );
}

function MainContent({
  data,
  loading,
  isPlaying,
  playingTrackId,
  onTrackPlay,
  activeNav,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  onSearchSubmit,
  onCardClick,
}: {
  data: AppData;
  loading: boolean;
  isPlaying: boolean;
  playingTrackId: number | null;
  onTrackPlay: (track: Track) => void;
  activeNav: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: Track[];
  searchLoading: boolean;
  onSearchSubmit: (q: string) => void;
  onCardClick: (query: string) => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main className="flex-1 overflow-y-auto" style={{ background: "#121212" }}>
      {/* Top Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 backdrop-blur-md" style={{ background: "rgba(18,18,18,0.85)" }}>
        <div className="flex items-center gap-4 flex-1">
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-full bg-black/70 text-white w-8 h-8 hover:scale-105 transition"><i class="fa-solid fa-chevron-left text-xs"></i></button>
            <button className="flex items-center justify-center rounded-full bg-black/70 text-spotify-textsub w-8 h-8 hover:scale-105 transition"><i class="fa-solid fa-chevron-right text-xs"></i></button>
          </div>
          
          {activeNav === "search" && (
            <div className="relative max-w-md w-full ml-4">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-spotify-textsub text-sm"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  onSearchSubmit(e.target.value);
                }}
                placeholder="What do you want to listen to?"
                className="w-full bg-[#2a2a2a] text-white text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white transition"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:scale-105 transition shadow">Explore Premium Free</button>
          <div className="flex items-center gap-2 rounded-full px-2 py-1 bg-black/70">
            <div className="rounded-full flex items-center justify-center text-xs font-bold bg-[#1db954] text-black w-7 h-7">
              {data.userInitials || "U"}
            </div>
          </div>
        </div>
      </div>

      {activeNav === "search" ? (
        <div className="px-8 pb-12 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Search Results</h2>
          {searchLoading ? (
            <div className="text-center py-20 text-spotify-textsub flex flex-col items-center gap-3">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#1db954]"></i>
              <p>Searching YouTube & free music streams...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="flex flex-col gap-1">
              {searchResults.map((track, i) => (
                <TrendingRow
                  key={track.id}
                  track={track}
                  index={i}
                  active={isPlaying && playingTrackId === track.id}
                  onPlay={() => onTrackPlay(track)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-spotify-textsub">
              <p>Type an artist, song, or vibe above to stream instantly.</p>
            </div>
          )}
        </div>
      ) : activeNav === "library" ? (
        <div className="px-8 pb-12 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Library</h2>
          <p className="text-sm text-spotify-textsub">Your saved tracks and recently played music will appear here.</p>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div
            className="relative px-8 pt-4 pb-6"
            style={{ background: "linear-gradient(180deg,rgba(29,185,84,0.35) 0%,rgba(29,185,84,0.1) 50%,#121212 100%)" }}
          >
            <h1 className="text-3xl font-bold text-white mb-5">{greeting}</h1>

            {/* Recently Played */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <RecentSkeleton key={i} />)
                : data.recentlyPlayed.map(item => (
                    <RecentCard key={item.id} item={item} onPlay={() => onCardClick(item.title)} />
                  ))}
            </div>
          </div>

          <div className="px-8 pb-6">
            {/* Made For You */}
            <Section title="Made For You" loading={loading} skeletonCount={5}>
              {data.madeForYou.map(item => (
                <AlbumCard key={item.id} item={item} onPlay={() => onCardClick(item.title)} />
              ))}
            </Section>

            {/* Top Charts */}
            <Section title="Top Charts" loading={loading} skeletonCount={5}>
              {data.topCharts.map(item => (
                <AlbumCard key={item.id} item={item} onPlay={() => onCardClick(item.title)} />
              ))}
            </Section>

            {/* Trending Tracks */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Trending Tracks</h2>
                <SeeAllBtn />
              </div>
              <div className="flex items-center gap-4 px-4 pb-2 mb-1 text-xs font-medium uppercase tracking-widest border-b" style={{ color: "#b3b3b3", borderColor: "#282828" }}>
                <div className="w-5">#</div>
                <div className="w-10" />
                <div className="flex-1">Title</div>
                <div className="hidden md:block flex-1">Album</div>
                <div className="w-16 text-right">Plays</div>
                <div className="w-12 text-right">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="ml-auto">
                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                    <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" />
                  </svg>
                </div>
              </div>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <TrackRowSkeleton key={i} index={i} />)
                : data.trendingTracks.map((track, i) => (
                    <TrendingRow
                      key={track.id}
                      track={track}
                      index={i}
                      active={isPlaying && playingTrackId === track.id}
                      onPlay={() => onTrackPlay(track)}
                    />
                  ))}
            </section>
          </div>
        </>
      )}
    </main>
  );
}

function Section({
  title,
  loading,
  skeletonCount,
  children,
}: {
  title: string;
  loading: boolean;
  skeletonCount: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <SeeAllBtn />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))" }}>
        {loading ? Array.from({ length: skeletonCount }).map((_, i) => <CardSkeleton key={i} />) : children}
      </div>
    </section>
  );
}

function PlayerBar({
  song,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  onNext,
  onPrev,
}: {
  song: CurrentSong | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (val: number) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const fmt = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const progressPct = `${progress}%`;
  const volumePct = `${volume}%`;

  return (
    <footer className="h-24 px-4 flex items-center justify-between flex-shrink-0 z-20 border-t border-neutral-800" style={{ background: "#000" }}>
      {/* Left */}
      <div className="flex items-center gap-3" style={{ width: 280, minWidth: 180 }}>
        {song ? (
          <>
            <div className="rounded overflow-hidden flex-shrink-0 shadow" style={{ width: 56, height: 56, background: "#282828" }}>
              <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">{song.title}</div>
              <div className="text-xs truncate" style={{ color: "#b3b3b3" }}>{song.artist}</div>
            </div>
            <button className="flex-shrink-0 transition-transform duration-150 hover:scale-110" onClick={() => setIsLiked(l => !l)} style={{ color: isLiked ? "#1db954" : "#b3b3b3" }}>
              <HeartIcon filled={isLiked} size={20} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="w-14 h-14 rounded bg-[#282828]" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="w-28 h-3 rounded bg-[#282828]" />
              <div className="w-20 h-2.5 rounded bg-[#282828]" />
            </div>
          </div>
        )}
      </div>

      {/* Center */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
        <div className="flex items-center gap-5">
          <button className="transition-opacity duration-150" style={{ color: isShuffle ? "#1db954" : "#b3b3b3" }} onClick={() => setIsShuffle(s => !s)}>
            <ShuffleIcon active={isShuffle} />
          </button>
          <button className="text-white hover:text-spotify-green transition" onClick={onPrev}>
            <PrevIcon />
          </button>
          <button
            className="flex items-center justify-center rounded-full text-black transition-transform duration-150 hover:scale-105 shadow-md"
            style={{ background: "#fff", width: 36, height: 36 }}
            onClick={onTogglePlay}
            disabled={!song}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="text-white hover:text-spotify-green transition" onClick={onNext}>
            <NextIcon />
          </button>
          <button className="transition-opacity duration-150" style={{ color: isRepeat ? "#1db954" : "#b3b3b3" }} onClick={() => setIsRepeat(r => !r)}>
            <RepeatIcon active={isRepeat} />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full text-xs">
          <span className="tabular-nums" style={{ color: "#b3b3b3", minWidth: 34, textAlign: "right" }}>{fmt(currentTime)}</span>
          <div className="flex-1 relative flex items-center group cursor-pointer">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={e => onSeek(Number(e.target.value))}
              className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-[#1db954]"
            />
          </div>
          <span className="tabular-nums" style={{ color: "#b3b3b3", minWidth: 34 }}>{fmt(duration)}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 justify-end" style={{ width: 280, minWidth: 180 }}>
        <button style={{ color: "#b3b3b3" }}><QueueIcon /></button>
        <button style={{ color: "#b3b3b3" }} onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}>
          <VolumeIcon level={volume} />
        </button>
        <div className="w-24">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-[#1db954]"
          />
        </div>
        <button style={{ color: "#b3b3b3" }}><FullscreenIcon /></button>
      </div>
    </footer>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────────── */

export default function App() {
  const [activeNav, setActiveNav] = useState("home");
  const [data, setData] = useState<AppData>({
    recentlyPlayed: [
      { id: 1, title: "Today's Top Hits", subtitle: "Playlist", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80", color: "#1db954" },
      { id: 2, title: "Lo-Fi Chill Beats", subtitle: "Playlist", coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&q=80", color: "#4f46e5" },
      { id: 3, title: "Gym Workout Energy", subtitle: "Playlist", coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80", color: "#dc2626" },
      { id: 4, title: "Bollywood Chartbusters", subtitle: "Playlist", coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80", color: "#2563eb" },
      { id: 5, title: "Late Night Synthwave", subtitle: "Playlist", coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&q=80", color: "#9333ea" },
      { id: 6, title: "Acoustic Peaceful", subtitle: "Playlist", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80", color: "#059669" },
    ],
    madeForYou: [
      { id: 101, title: "Daily Mix 1", desc: "Arijit Singh, Pritam, Atif Aslam and more", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80" },
      { id: 102, title: "Chill Vibes", desc: "Relaxing lofi and ambient electronic sounds", coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80" },
      { id: 103, title: "Workout Pump", desc: "High energy EDM, hip-hop and phonk beats", coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80" },
      { id: 104, title: "Deep Focus", desc: "Minimal techno and ambient soundscapes", coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80" },
      { id: 105, title: "Synthwave Odyssey", desc: "Retro 80s futuristic cyberpunk beats", coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80" },
    ],
    topCharts: [
      { id: 201, title: "Global Top 50", desc: "The most played tracks right now across the world", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" },
      { id: 202, title: "Viral Hits India", desc: "Viral sensations blowing up the internet today", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80" },
      { id: 203, title: "Top Pop 2026", desc: "Fresh pop anthems and chart-toppers", coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80" },
      { id: 204, title: "Rock Classics", desc: "Legendary guitar riffs and timeless anthems", coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80" },
      { id: 205, title: "Hip Hop Central", desc: "Hard hitting beats and bars", coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80" },
    ],
    trendingTracks: [],
    currentSong: null,
    userDisplayName: "Himanshu",
    userInitials: "H",
  });
  
  const [playlists, setPlaylists] = useState<string[]>(["Top Hits 2026", "Lo-Fi Chill Beats", "Gym Workout Energy", "Bollywood Chartbusters"]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [playlistQueue, setPlaylistQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDur = () => setDuration(audio.duration || 0);
    const onEnded = () => handleNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDur);
    audio.addEventListener("ended", onEnded);

    // Initial load trending tracks
    fetchInitialTrending();

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDur);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const fetchInitialTrending = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/search?q=Top+Hits+2026`);
      const json = await res.json();
      if (json.results) {
        const formatted: Track[] = json.results.map((item: any, idx: number) => ({
          id: idx + 1000,
          title: item.title,
          artist: item.artist,
          album: "SpotFree Release",
          duration: item.duration,
          duration_sec: item.duration_sec,
          coverUrl: item.thumbnail,
          plays: "1,245,890",
          url: item.url,
        }));
        setData(d => ({ ...d, trendingTracks: formatted }));
        setPlaylistQueue(formatted);
      }
    } catch (err) {
      console.error("Failed to load trending tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.results) {
        const formatted: Track[] = json.results.map((item: any, idx: number) => ({
          id: idx + 5000,
          title: item.title,
          artist: item.artist,
          album: "YouTube Music",
          duration: item.duration,
          duration_sec: item.duration_sec,
          coverUrl: item.thumbnail,
          plays: "542,100",
          url: item.url,
        }));
        setSearchResults(formatted);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQuickSearch = async (query: string) => {
    setActiveNav("search");
    setSearchQuery(query);
    await handleSearchSubmit(query);
  };

  const playTrack = async (track: Track) => {
    setPlayingTrackId(track.id);
    setIsPlaying(true);
    setData(d => ({
      ...d,
      currentSong: {
        title: track.title,
        artist: track.artist,
        coverUrl: track.coverUrl,
        durationSec: track.duration_sec || 180,
        url: track.url,
      },
    }));

    try {
      const res = await fetch(`http://localhost:8000/api/stream?url=${encodeURIComponent(track.url)}`);
      const json = await res.json();
      if (json.stream_url && audioRef.current) {
        audioRef.current.src = json.stream_url;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("Failed to stream audio:", err);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.src) {
        audioRef.current.play();
        setIsPlaying(true);
      } else if (playlistQueue.length > 0) {
        playTrack(playlistQueue[0]);
      }
    }
  };

  const handleNext = () => {
    if (playlistQueue.length === 0) return;
    const nextIdx = (currentIndex + 1) % playlistQueue.length;
    setCurrentIndex(nextIdx);
    playTrack(playlistQueue[nextIdx]);
  };

  const handlePrev = () => {
    if (playlistQueue.length === 0) return;
    const prevIdx = (currentIndex - 1 + playlistQueue.length) % playlistQueue.length;
    setCurrentIndex(prevIdx);
    playTrack(playlistQueue[prevIdx]);
  };

  const handleSeek = (val: number) => {
    if (!audioRef.current || !duration) return;
    const newTime = (val / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "100vh", background: "#121212", overflow: "hidden" }}>
      <div className="flex flex-1 min-h-0">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          playlists={playlists}
          loading={loading}
          onQuickSearch={handleQuickSearch}
        />
        <MainContent
          data={data}
          loading={loading}
          isPlaying={isPlaying}
          playingTrackId={playingTrackId}
          onTrackPlay={track => {
            const idx = playlistQueue.findIndex(t => t.id === track.id);
            if (idx !== -1) setCurrentIndex(idx);
            playTrack(track);
          }}
          activeNav={activeNav}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          searchLoading={searchLoading}
          onSearchSubmit={handleSearchSubmit}
          onCardClick={handleQuickSearch}
        />
      </div>
      <PlayerBar
        song={data.currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
