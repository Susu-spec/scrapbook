export type CloudinaryImageTransform =
  | "w_400,q_auto,f_auto"
  | "w_800,q_auto,f_auto"
  | "w_1200,q_auto,f_auto"
  | "w_1600,q_90,f_auto"
  | (string & {});

export type CloudinaryVideoTransform =
  | "q_auto,f_auto"
  | "w_800,q_auto,f_auto"
  | "w_1200,q_auto,f_auto"
  | (string & {});




export type Aspect = "tall" | "square" | "wide";

export const aspectClass: Record<Aspect, string> = {
  tall:   "aspect-[3/4]",
  square: "aspect-square",
  wide:   "aspect-[4/3]",
};

interface MediaBase {
  id:      number;
  caption: string;
  aspect:  Aspect;
  path:    string;
}

export interface PhotoItem extends MediaBase {
  type:        "image";
  /** Full-res src for the lightbox. Defaults to w_1600 if omitted. */
  lightboxSrc?: string;
}

export interface VideoItem extends MediaBase {
  type:       "video";
  /** Poster image shown before the video plays (optional but recommended) */
  poster?:    string;
  /** Loop the video. Defaults to true. */
  loop?:      boolean;
}

export type MediaItem = PhotoItem | VideoItem;


export const isPhoto = (item: MediaItem): item is PhotoItem => item.type === "image";
export const isVideo = (item: MediaItem): item is VideoItem => item.type === "video";
