import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Video from "yet-another-react-lightbox/plugins/video";
import { cdnImage, cdnVideo } from "./helpers";
import { type MediaItem, isPhoto, isVideo } from "./types"
import { MEDIA } from "./media";
import gothicIcon from "./assets/gothic_icon_large.svg";

function useTypewriter(text: string, speed = 55, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
 
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
 
  return { displayed, done };
}
 
function sortedMedia(items: MediaItem[]): MediaItem[] {
  const wedding = items.filter(i => i.caption.toLowerCase().startsWith("wedding"));
  const rest    = items.filter(i => !i.caption.toLowerCase().startsWith("wedding"));
  const mid     = Math.floor(rest.length / 2);
  return [...rest.slice(0, mid), ...wedding, ...rest.slice(mid)];
}
 
const SORTED = sortedMedia(MEDIA);
 
function buildSlides(items: MediaItem[]) {
  return items.map((item) => {
    if (isVideo(item)) {
      return {
        type: "video" as const,
        title: item.caption,
        sources: [{ src: cdnVideo(item.path), type: "video/mp4" }],
        poster: item.poster,
        autoPlay: true,
        loop: item.loop ?? true,
      };
    }
    return {
      src: cdnImage(item.path, "w_1600,q_90,f_auto"),
      title: item.caption,
      description: "",
    };
  });
}
 
const aspectClass: Record<string, string> = {
  tall:   "aspect-[3/4]",
  square: "aspect-square",
  wide:   "aspect-[4/3]",
};

function PhotoCard({
  item,
  onOpen,
}: {
  item: MediaItem;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
 
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden cursor-zoom-in"
      style={{ borderRadius: 2 }}
    >
      {isPhoto(item) ? (
        <img
          src={cdnImage(item.path)}
          alt={item.caption}
          onLoad={() => setLoaded(true)}
          className={`w-full block object-cover ${aspectClass[item.aspect]}`}
          style={{
            transform:  hovered ? "scale(1.04)" : "scale(1)",
            filter:     hovered ? "brightness(0.75)" : "brightness(1)",
            opacity:    loaded ? 1 : 0,
            transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease, opacity 0.4s ease",
          }}
        />
      ) : (
        <video
          src={cdnVideo(item.path)}
          poster={isVideo(item) ? item.poster : undefined}
          onLoadedData={() => setLoaded(true)}
          className={`w-full block object-cover ${aspectClass[item.aspect]}`}
          style={{
            opacity:    loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
          autoPlay
          loop={isVideo(item) ? (item.loop ?? true) : true}
          muted
          playsInline
        />
      )}
 
      <div
        className="absolute inset-x-0 bottom-0 pt-8 px-3 pb-3 bg-linear-to-t from-black/60 to-transparent"
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <span className="font-mono text-[10px] text-white/80 tracking-widest uppercase italic">
          {item.caption}
        </span>
      </div>
 
      {isVideo(item) && (
        <div
          className="absolute top-2 right-2"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          <span className="font-mono text-[9px] tracking-widest uppercase text-white/60 bg-black/40 px-1.5 py-0.5">
            video
          </span>
        </div>
      )}
    </div>
  );
}
 
export default function PhotoPortfolio() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const { displayed, done } = useTypewriter("photographs and videos");
  const slides = buildSlides(SORTED);
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
 
  return (
    <>
      <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e4]">
 
        <div className="flex flex-col gap-2.5 items-center text-center px-6 pt-20 pb-10" style={{ animation: "slideUp 0.6s ease both" }}>
          <img
            src={gothicIcon}
            alt=""
            aria-hidden="true"
            className="w-40 sm:w-56"
            style={{ opacity: done ? 0.9 : 0, transition: "opacity 1s ease 0.6s" }}
          />
          <a
            href="https://www.instagram.com/susu.haus_/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-[0.08em] text-white/30 hover:text-white/70 transition-colors duration-200 no-underline"
          >
            @susu.haus
          </a>
          <p className="font-mono text-[10px] tracking-[0.14em] text-white/25">
            open journal · visual archive · {new Date().getFullYear()}
          </p>
          <h1 className="font-serif text-[clamp(26px,4.5vw,38px)] font-normal italic leading-[1.15] max-w-lg min-h-[1.5em] mt-5">
            {displayed}
            {!done && (
              <span className="cursor-blink inline-block w-[0.5] h-[0.85em] bg-[#e8e8e4] ml-1 align-middle" />
            )}
          </h1>
          <p
            className="font-mono text-[11px] text-white/25 tracking-wide leading-loose"
            style={{ opacity: done ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}
          >
            streets, stills, strangers. places i&rsquo;ve been, things i&rsquo;ve noticed.
          </p>
        </div>
 
        <div className="flex items-center gap-4 px-6 pb-5 font-mono text-[10px] tracking-widest uppercase text-white/20 max-w-4xl mx-auto w-full">
          <span>recent</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span>{SORTED.length} shots</span>
        </div>
 
        <div className="relative">
          <div
            className="max-w-4xl mx-auto px-4 pb-16 [column-count:2] sm:[column-count:3]"
            style={{ columnGap: "8px", animation: "slideUp 0.7s ease 0.1s both" }}
          >
            {SORTED.map((item, i) => (
              <div key={item.id} style={{ breakInside: "avoid", marginBottom: "8px" }}>
                <PhotoCard item={item} onOpen={() => setLightboxIndex(i)} />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40" style={{ background: "linear-gradient(to right, #0c0c0c, transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40" style={{ background: "linear-gradient(to left, #0c0c0c, transparent)" }} />
        </div>
 
        <footer className="border-t border-white/5 px-6 py-6 flex justify-between items-center max-w-4xl mx-auto">
          <span className="font-serif italic text-[13px] text-white/20">check back next month</span>
          <span className="font-mono text-[10px] text-white/15 tracking-widest">
            © {new Date().getFullYear()} Suwayba
          </span>
        </footer>
      </div>
 
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom, Captions, Video]}
        animation={{ fade: 300, swipe: 300 }}
        captions={{ showToggle: false, descriptionTextAlign: "center" }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
      />
    </>
  );
}