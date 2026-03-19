export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "Menu" });
  }
  //on charge les images
  preload() {
    this.load.image("menu_fond", "src/assets/Menu_conversation.png");
    this.load.image("imageBoutonPlay", "src/assets/Bouton_jouer.png");
    this.load.image("imageBoutonExit", "src/assets/Bouton_quitter.png");
    this.load.image("imagejeu", "src/assets/JLAB_07.png");
  }

  create() {

   this.sound.stopByKey("son_rodeur");
   // on place les éléments de fond
    this.add
      .image(0, 0, "menu_fond")
      .setOrigin(0)
      .setDepth(0);

    //on ajoute un bouton de clic, nommé bouton_play
    this.add
        .image(400, 200, "imagejeu").setScale(0.75)

    var bouton_play = this.add.image(675, 450, "imageBoutonPlay").setDepth(1).setScale(0.5);
   
    //=========================================================
    //on rend le bouton interratif
    bouton_play.setInteractive({ hitArea: new Phaser.Geom.Rectangle(0, 0, bouton_play.width, bouton_play.height), hitAreaCallback: Phaser.Geom.Rectangle.Contains });

    

    //Cas ou la souris passe sur le bouton play
    bouton_play.on("pointerover", () => {
    bouton_play.setScale(0.55); //  légèrement plus grand
    });

    bouton_play.on("pointerout", () => {
    bouton_play.setScale(0.5); //  retour à la taille normale
    });


    //Cas ou la sourris clique sur le bouton play :
    // on lance le niveau 1
    bouton_play.on("pointerup", () => {
      this.scene.start("selection");
    });
    //on ajoute un bouton de clic, nommé bouton_exit
    var bouton_exit = this.add.image(125, 450, "imageBoutonExit").setDepth(1).setScale(0.5);
   
    //=========================================================
    //on rend le bouton interratif
    bouton_exit.setInteractive({ hitArea: new Phaser.Geom.Rectangle(0, 0, bouton_exit.width, bouton_exit.height), hitAreaCallback: Phaser.Geom.Rectangle.Contains });

    //Cas ou la souris passe sur le bouton exit
    bouton_exit.on("pointerover", () => {
    bouton_exit.setScale(0.55); //  légèrement plus grand
    });

    bouton_exit.on("pointerout", () => {
    bouton_exit.setScale(0.5); //  retour à la taille normale
    });


    //Cas ou la sourris clique sur le bouton exit :
    // on ferme le jeu
    bouton_exit.on("pointerup", () => {
      this.game.destroy();
      window.close();
    });
  }
} 