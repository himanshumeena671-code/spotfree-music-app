import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface RecentItem {
  id: number;
  title: string;
  subtitle: string;
  coverUrl: string | null;
  color: string;
}

export interface PlaylistCard {
  id: number;
  title: string;
  desc: string;
  coverUrl: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  plays: string;
}

export interface CurrentSong {
  title: string;
  artist: string;
  coverUrl: string;
  durationSec: number;
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
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1.5.866l7-4a1 1 0 0 0 0-1.732l-7-4zM9 2a1 1 0 0 0-1 1v18a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75V15.25a.75.75 0 0 1-1.5 0V8.75H1a.75.75 0 0 1 0-1.5h6.25V1a.75.75 0 0 1 1.5 0v6.25H14.5a.75.75 0 0 1 .75.75z" />
  </svg>
);

const HeartIcon = ({ filled, size = 20 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#1db954" : "none"} stroke={filled ? "#1db954" : "currentColor"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShuffleIcon = ({ active }: { active?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? "#1db954" : "currentColor"}>
    <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15 5.5l-1.849-4.578zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5zM7.5 10.723l.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06L15 10.5l-1.849 4.078a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.937z" />
  </svg>
);

const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
  </svg>
);

const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const RepeatIcon = ({ active }: { active?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? "#1db954" : "currentColor"}>
    <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" />
  </svg>
);

const VolumeIcon = ({ level }: { level: number }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    {level === 0 ? (
      <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.27 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 1 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06zM10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.781-.781l5.8-3.35v1.3c.45-.313.961-.53 1.5-.694V1.5z" />
    ) : level < 50 ? (
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8L2.817 6.15zm8.683 4.21v-4.29a2.247 2.247 0 0 1 0 4.29z" />
    ) : (
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8L2.817 6.15zm8.683 6.87V2.98a5.47 5.47 0 0 1 0 10.04z" />
    )}
  </svg>
);

const QueueIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zM3.5 2.5a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.064 10.229a.75.75 0 0 1 0 1.06L3.457 13.896h1.543a.75.75 0 0 1 0 1.5H1a.75.75 0 0 1-.75-.75V10.5a.75.75 0 0 1 1.5 0v1.543L3.003 9.169a.75.75 0 0 1 1.06 1.06zM10.5 1a.75.75 0 0 0 0 1.5h1.543L9.17 5.286a.75.75 0 0 0 1.06 1.06l2.77-2.769V5.12a.75.75 0 0 0 1.5 0V1a.75.75 0 0 0-.75-.75H10.5z" />
  </svg>
);

const PlaySmallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */

function Skeleton({ w, h, rounded = "rounded-md" }: { w: string; h: string; rounded?: string }) {
  return (
    <div
      className={`${rounded} ${w} ${h} animate-pulse`}
      style={{ background: "#282828" }}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl p-3" style={{ background: "#181818" }}>
      <Skeleton w="w-full" h="h-40" rounded="rounded-lg" />
      <div className="mt-3 mb-1">
        <Skeleton w="w-3/4" h="h-3" />
      </div>
      <Skeleton w="w-1/2" h="h-3" />
    </div>
  );
}

function RecentSkeleton() {
  return (
    <div
      className="flex items-center gap-3 rounded-md overflow-hidden"
      style={{ background: "rgba(255,255,255,0.1)", height: 56 }}
    >
      <Skeleton w="w-14" h="h-14" rounded="rounded-none" />
      <Skeleton w="w-32" h="h-3" rounded="rounded" />
    </div>
  );
}

function TrackRowSkeleton({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <div className="w-5 flex justify-center">
        <span className="text-sm" style={{ color: "#535353" }}>{index + 1}</span>
      </div>
      <Skeleton w="w-10" h="h-10" rounded="rounded" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton w="w-40" h="h-3" />
        <Skeleton w="w-24" h="h-2.5" />
      </div>
      <div className="hidden md:block flex-1">
        <Skeleton w="w-28" h="h-3" />
      </div>
      <Skeleton w="w-12" h="h-2.5" rounded="rounded" />
      <Skeleton w="w-8" h="h-2.5" rounded="rounded" />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function Sidebar({
  activeNav,
  setActiveNav,
  playlists,
  loading,
}: {
  activeNav: string;
  setActiveNav: (s: string) => void;
  playlists: string[];
  loading: boolean;
}) {
  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "search", label: "Search", icon: SearchIcon },
    { id: "library", label: "Your Library", icon: LibraryIcon },
  ];

  return (
    <aside className="flex flex-col h-full" style={{ background: "#000", width: 240, minWidth: 240 }}>
      {/* Logo */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#1db954" />
            <path d="M7.67 16.17a.75.75 0 0 0 1.03.25c2.84-1.73 6.41-2.12 10.62-1.16a.75.75 0 1 0 .33-1.46c-4.57-1.03-8.48-.59-11.73 1.34a.75.75 0 0 0-.25 1.03zm-1.4-3.2a.94.94 0 0 0 1.29.31c3.45-2.1 8.7-2.71 12.8-1.49a.94.94 0 0 0 .54-1.8c-4.6-1.38-10.37-.71-14.32 1.68a.94.94 0 0 0-.31 1.3zM6 9.5a1.12 1.12 0 0 0 1.54.37c3.86-2.35 10.23-2.64 14.26-.85a1.12 1.12 0 1 0 .93-2.04c-4.56-2.07-12.1-1.76-16.36.89A1.12 1.12 0 0 0 6 9.5z" fill="black" />
          </svg>
          <span className="text-white font-bold text-xl tracking-tight">SpotFree</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 mb-6">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className="flex items-center gap-4 w-full px-3 py-2.5 rounded-md text-sm font-semibold transition-colors duration-150"
            style={{
              color: activeNav === id ? "#fff" : "#b3b3b3",
              background: activeNav === id ? "rgba(255,255,255,0.1)" : "transparent",
            }}
            onMouseEnter={e => { if (activeNav !== id) (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            onMouseLeave={e => { if (activeNav !== id) (e.currentTarget as HTMLButtonElement).style.color = "#b3b3b3"; }}
          >
            <Icon active={activeNav === id} />
            {label}
          </button>
        ))}
      </nav>

      {/* Create playlist */}
      <div className="px-6 mb-3">
        <button
          className="flex items-center gap-2 text-sm font-semibold transition-colors duration-150"
          style={{ color: "#b3b3b3" }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#b3b3b3")}
        >
          <span className="flex items-center justify-center rounded-sm" style={{ background: "#b3b3b3", width: 24, height: 24, color: "#000" }}>
            <PlusIcon />
          </span>
          Create Playlist
        </button>
      </div>

      {/* Liked Songs */}
      <div className="px-3 mb-4">
        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors duration-150"
          style={{ color: "#b3b3b3" }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#b3b3b3")}
        >
          <span className="flex items-center justify-center rounded-sm flex-shrink-0" style={{ background: "linear-gradient(135deg,#4b0082,#00f)", width: 32, height: 32 }}>
            <HeartIcon filled size={16} />
          </span>
          <div className="text-left">
            <div className="text-white font-medium text-sm">Liked Songs</div>
            <div className="text-xs" style={{ color: "#b3b3b3" }}>Playlist</div>
          </div>
        </button>
      </div>

      <div className="mx-6 mb-4" style={{ height: 1, background: "#282828" }} />

      {/* Playlist list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-3 py-1.5">
                <Skeleton w="w-full" h="h-3" rounded="rounded" />
              </div>
            ))
          : playlists.map((pl, i) => (
              <button
                key={i}
                className="block w-full text-left px-3 py-1.5 text-sm rounded transition-colors duration-150"
                style={{ color: "#b3b3b3" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#b3b3b3")}
              >
                {pl}
              </button>
            ))}
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
      <span className="font-semibold text-sm text-white flex-1">{item.title}</span>
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
}: {
  data: AppData;
  loading: boolean;
  isPlaying: boolean;
  playingTrackId: number | null;
  onTrackPlay: (id: number) => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main className="flex-1 overflow-y-auto" style={{ background: "#121212" }}>
      {/* Hero */}
      <div
        className="relative px-8 pt-8 pb-6"
        style={{ background: "linear-gradient(180deg,rgba(29,185,84,0.35) 0%,rgba(29,185,84,0.1) 50%,#121212 100%)" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {[
              "M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z",
              "M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z",
            ].map((d, i) => (
              <button key={i} className="flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.7)", width: 32, height: 32, color: i === 0 ? "#fff" : "#b3b3b3" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d={d} /></svg>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-full px-2 py-1" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="rounded-full flex items-center justify-center text-xs font-bold" style={{ width: 28, height: 28, background: "#1db954", color: "#000" }}>
              {data.userInitials || "?"}
            </div>
            <span className="text-sm font-semibold text-white pr-1">{data.userDisplayName || "Guest"}</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-5">{greeting}</h1>

        {/* Recently Played */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <RecentSkeleton key={i} />)
            : data.recentlyPlayed.map(item => (
                <RecentCard key={item.id} item={item} onPlay={() => onTrackPlay(item.id)} />
              ))}
        </div>
      </div>

      <div className="px-8 pb-6">
        {/* Made For You */}
        <Section title="Made For You" loading={loading} skeletonCount={5}>
          {data.madeForYou.map(item => (
            <AlbumCard key={item.id} item={item} onPlay={() => onTrackPlay(item.id)} />
          ))}
        </Section>

        {/* Top Charts */}
        <Section title="Top Charts" loading={loading} skeletonCount={5}>
          {data.topCharts.map(item => (
            <AlbumCard key={item.id} item={item} onPlay={() => onTrackPlay(item.id)} />
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
                  onPlay={() => onTrackPlay(track.id)}
                />
              ))}
        </section>
      </div>
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

function SeeAllBtn() {
  return (
    <button
      className="text-xs font-bold uppercase tracking-widest transition-colors duration-150"
      style={{ color: "#b3b3b3" }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#b3b3b3")}
    >
      See all
    </button>
  );
}

function PlayerBar({ song }: { song: CurrentSong | null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(72);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const duration = song?.durationSec ?? 0;
  const currentTime = (progress / 100) * duration;

  useEffect(() => {
    if (isPlaying && duration > 0) {
      intervalRef.current = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 100 / duration / 10));
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, duration]);

  const progressPct = `${progress}%`;
  const volumePct = `${volume}%`;

  return (
    <footer
      className="flex items-center justify-between px-4 flex-shrink-0"
      style={{ height: 90, background: "#181818", borderTop: "1px solid #282828" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3" style={{ width: 280, minWidth: 180 }}>
        {song ? (
          <>
            <div className="rounded overflow-hidden flex-shrink-0 shadow-lg" style={{ width: 56, height: 56, background: "#282828" }}>
              <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">{song.title}</div>
              <div className="text-xs truncate" style={{ color: "#b3b3b3" }}>{song.artist}</div>
            </div>
            <button className="flex-shrink-0 transition-transform duration-150 hover:scale-110" onClick={() => setIsLiked(l => !l)} style={{ color: isLiked ? "#1db954" : "#b3b3b3" }}>
              <HeartIcon filled={isLiked} size={20} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <Skeleton w="w-14" h="h-14" rounded="rounded" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton w="w-28" h="h-3" />
              <Skeleton w="w-20" h="h-2.5" />
            </div>
          </div>
        )}
      </div>

      {/* Center */}
      <div className="flex flex-col items-center gap-2 flex-1" style={{ maxWidth: 600 }}>
        <div className="flex items-center gap-5">
          <button className="transition-opacity duration-150" style={{ color: isShuffle ? "#1db954" : "#b3b3b3", opacity: isShuffle ? 1 : 0.7 }} onClick={() => setIsShuffle(s => !s)}>
            <ShuffleIcon active={isShuffle} />
          </button>
          <button className="text-white transition-opacity duration-150" style={{ opacity: 0.7 }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}>
            <PrevIcon />
          </button>
          <button
            className="flex items-center justify-center rounded-full text-black transition-transform duration-150 hover:scale-105"
            style={{ background: "#fff", width: 36, height: 36 }}
            onClick={() => setIsPlaying(p => !p)}
            disabled={!song}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="text-white transition-opacity duration-150" style={{ opacity: 0.7 }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}>
            <NextIcon />
          </button>
          <button className="transition-opacity duration-150" style={{ color: isRepeat ? "#1db954" : "#b3b3b3", opacity: isRepeat ? 1 : 0.7 }} onClick={() => setIsRepeat(r => !r)}>
            <RepeatIcon active={isRepeat} />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs tabular-nums flex-shrink-0" style={{ color: "#b3b3b3", minWidth: 34, textAlign: "right" }}>
            {fmt(currentTime)}
          </span>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full progress-green"
              style={{ "--progress-pct": progressPct } as React.CSSProperties}
              disabled={!song}
            />
          </div>
          <span className="text-xs tabular-nums flex-shrink-0" style={{ color: "#b3b3b3", minWidth: 34 }}>
            {fmt(duration)}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 justify-end" style={{ width: 280, minWidth: 180 }}>
        <button className="transition-opacity duration-150" style={{ color: "#b3b3b3", opacity: 0.7 }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}>
          <QueueIcon />
        </button>
        <button className="transition-opacity duration-150" style={{ color: "#b3b3b3", opacity: 0.7 }} onClick={() => setVolume(v => v === 0 ? 72 : 0)} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}>
          <VolumeIcon level={volume} />
        </button>
        <div className="w-24">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-full progress-white"
            style={{ "--progress-pct": volumePct } as React.CSSProperties}
          />
        </div>
        <button className="transition-opacity duration-150" style={{ color: "#b3b3b3", opacity: 0.7 }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}>
          <FullscreenIcon />
        </button>
      </div>
    </footer>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────────── */

const EMPTY_DATA: AppData = {
  recentlyPlayed: [],
  madeForYou: [],
  topCharts: [],
  trendingTracks: [],
  currentSong: null,
  userDisplayName: "",
  userInitials: "",
};

export default function App() {
  const [activeNav, setActiveNav] = useState("home");
  const [data, setData] = useState<AppData>(EMPTY_DATA);
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

  // Wire your backend here — replace with real API calls
  useEffect(() => {
    // Example:
    // Promise.all([
    //   fetch("/api/home").then(r => r.json()),
    //   fetch("/api/playlists").then(r => r.json()),
    // ]).then(([homeData, playlistData]) => {
    //   setData(homeData);
    //   setPlaylists(playlistData);
    //   setLoading(false);
    // });

    // Remove this timeout once your API is connected:
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleTrackPlay = useCallback((id: number) => {
    setPlayingTrackId(id);
    setIsPlaying(true);
  }, []);

  return (
    <div className="flex flex-col" style={{ height: "100vh", background: "#121212", overflow: "hidden" }}>
      <div className="flex flex-1 min-h-0">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} playlists={playlists} loading={loading} />
        <MainContent
          data={data}
          loading={loading}
          isPlaying={isPlaying}
          playingTrackId={playingTrackId}
          onTrackPlay={handleTrackPlay}
        />
      </div>
      <PlayerBar song={data.currentSong} />
    </div>
  );
}
