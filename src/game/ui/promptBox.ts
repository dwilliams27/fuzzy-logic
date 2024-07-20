import { CoreMessage } from "ai";

export default class PromptBox extends Phaser.GameObjects.Container {
  currentRawPrompt: string;
  

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, messages: CoreMessage[]) {
    super(scene, x, y);
    scene.add.existing(this);

    // Create a mask
    const shape = this.scene.make.graphics();
    shape.fillStyle(0xffffff);
    shape.beginPath();
    shape.fillRect(0, 0, width, height);
    const mask = shape.createGeometryMask();

    this.setMask(mask);

    // Add text blocks to the container
    this.curHeight = 0;
    messages.forEach(message => {
        const text = this.scene.add.text(0, this.curHeight, message.content as string, { wordWrap: { width: width - 20 } });
        this.add(text);
        this.curHeight += text.height + 10; // Adjust spacing between text blocks
    });

    this.setSize(width, height);
    this.setInteractive();

    // Scroll variables
    this.scrollY = 0;

    // Add event listener for the wheel event
    this.scene.input.on('wheel', (pointer: any, gameObjects: any, deltaX: any, deltaY: number, deltaZ: any) => {
      this.onWheel(deltaY);
    });
  }

  onWheel(deltaY: number) {
    // Adjust the scrollY value based on the wheel delta
    this.scrollY -= deltaY;

    // Clamp scrolling to the content size
    const maxScrollY = 0;
    const minScrollY = -this.height;
    this.scrollY = Phaser.Math.Clamp(this.scrollY, minScrollY, maxScrollY);

    this.y = this.scrollY;
  }

  postMessage(message: CoreMessage) {
    this.messages.push(message);

    // Add the new message to the container
    const text = this.scene.add.text(30, this.curHeight, message.content as string, { font: '16px Arial', color: '#ff0000', wordWrap: { width: this.width - 100 } });
    this.add(text);
    this.curHeight += text.height + 10;
  }
}
