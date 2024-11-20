import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export function convertJSONToFormData(body: object) {
  const formData = new FormData();
  Object.entries(body).forEach((_entry) => {
    if (typeof _entry[1] === "object") formData.append(_entry[0], _entry[1][0]);
    else formData.append(_entry[0], _entry[1]);
  });
  return formData;
}
export const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: any
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Set the canvas size to the cropped area size
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // Draw the image on the canvas with the cropping region
  ctx.drawImage(
    image,
    croppedAreaPixels.x, // x coordinate of the crop start
    croppedAreaPixels.y, // y coordinate of the crop start
    croppedAreaPixels.width, // width of the crop area
    croppedAreaPixels.height, // height of the crop area
    0, // place cropped image at x = 0 in the canvas
    0, // place cropped image at y = 0 in the canvas
    croppedAreaPixels.width, // scale width of the canvas to match crop area
    croppedAreaPixels.height // scale height of the canvas to match crop area
  );

  // Return the cropped image as a blob URL
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        resolve(url); // Return the URL of the cropped image
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    }, "image/jpeg");
  });
};

// Helper function to load the image
const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.setAttribute("crossOrigin", "anonymous"); // Needed to avoid CORS issues
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};
