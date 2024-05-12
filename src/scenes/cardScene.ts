export class CardScene extends Phaser.Scene {
  constructor() {
      super({ key: 'CardScene' });
  }

  preload() {
      // Load an image for the card. Assume the image is named 'card.png' and located in the 'assets' folder.
      this.load.image('card', 'assets/card.png');
  }

  create() {
      // Create a card sprite at a position (100, 100).
      const card = this.add.sprite(100, 100, 'card');

      // Enable input and make the card draggable.
      card.setInteractive({ useHandCursor: true });
      this.input.setDraggable(card);

      // Add drag events.
      this.input.on('dragstart', (pointer: any, gameObject: any) => {
          this.children.bringToTop(gameObject);
      });

      this.input.on('drag', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
          gameObject.x = dragX;
          gameObject.y = dragY;
      });
  }
}
