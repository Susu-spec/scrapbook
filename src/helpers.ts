import type { CloudinaryImageTransform, CloudinaryVideoTransform } from "./types";

const CLOUD_NAME = "dgafp4dx4";

export const cdnImage = (
  path: string,
  transform: CloudinaryImageTransform = "w_800,q_auto,f_auto"
): string =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${path}`;

export const cdnVideo = (
  path: string,
  transform: CloudinaryVideoTransform = "q_auto,f_auto"
): string =>
  `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transform}/${path}`;