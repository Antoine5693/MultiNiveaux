class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "menu" });
  }
  //on charge les images
  preload() {
    this.load.image("menu_fond", "...");
    this.load.image("imageBoutonPlay", "...");
  }

  create() {
   // on place les éléments de fond
    this.add
      .image(0, 0, "menu_fond")
      .setOrigin(0)
      .setDepth(0);

    //on ajoute un bouton de clic, nommé bouton_play
    var bouton_play = this.add.image(300, 450, "imageBoutonPlay").setDepth(1);
   
    //=========================================================
    //on rend le bouton interratif
    bouton_play.setInteractive();

    //Cas ou la souris passe sur le bouton play
    bouton_play.on("pointerover", () => {
    });
    
    //Cas ou la souris ne passe plus sur le bouton play
    bouton_play.on("pointerout", () => {
    });


    //Cas ou la sourris clique sur le bouton play :
    // on lance le niveau 1
    bouton_play.on("pointerup", () => {
      this.scene.start("niveau 1");
    });
  }
} 