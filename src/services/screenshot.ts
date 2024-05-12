import { Scene } from "phaser";

export class ScreenshotService {
  static captureScreenshot(scene: Scene) {
    // Get the canvas Phaser is rendering to
    const canvas = scene.sys.game.canvas;
  
    // Convert canvas content to a data URL (base64 encoded PNG image)
    const imageDataUrl = canvas.toDataURL('image/png');
  
    return imageDataUrl;
  }
}
