import { desktopCapturer } from 'electron';
import fs from 'fs';
import { promisify } from 'util';

async function getStream(display: Electron.Display) {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  const source = sources.find((item) => item.display_id === String(display.id));

  if (!source) {
    throw new Error("Can't find display source");
  }

  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // @ts-expect-error
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
        minWidth: display.size.width,
        minHeight: display.size.height,
        maxWidth: display.size.width,
        maxHeight: display.size.height,
      },
    },
  });
}

function getVideo(stream: MediaStream) {
  const video = document.createElement('video');
  video.autoplay = true;

  return new Promise<HTMLVideoElement>((resolve) => {
    video.addEventListener('playing', () => {
      resolve(video);
    });

    video.srcObject = stream;
  });
}

async function getBlob(
  video: HTMLVideoElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(video, x, y, width, height, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });

  if (!blob) {
    throw new Error("Couldn't get blob for video");
  }

  return blob;
}

interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default async function captureScreenshot(
  display: Electron.Display,
  { x, y, width, height }: CropOptions = {
    x: 0,
    y: 0,
    width: display.size.width,
    height: display.size.height,
  }
) {
  const stream = await getStream(display);
  const video = await getVideo(stream);
  const blob = await getBlob(video, x, y, width, height);
  const buffer = Buffer.from(await blob.arrayBuffer());

  await promisify(fs.writeFile)('/Users/steven_hc/Desktop/test.png', buffer);
}
