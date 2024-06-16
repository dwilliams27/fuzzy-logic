export class BaseScene extends Phaser.Scene {
  constructor(props: { key: string }) {
    super(props);
  }

  loadBase64Image(base64String: string) {
    let image = new Image();
    image.src = 'data:image/png;base64,' + base64String;
    
    // When the image is loaded, add it to the texture manager and create an image in the scene
    image.onload = () => {
      this.textures.addImage('dynamicImage', image);
      this.add.image(400, 300, 'dynamicImage').setScale(0.5);
    };
  }
}