import selection from "./js/selection.js"; 
import niveau1 from "./js/niveau1.js"; 
import Salle01 from "./js/Salle01.js";
import Couloir1 from "./js/Couloir1.js";
import Couloir2 from "./js/Couloir2.js";
import Couloir3 from "./js/Couloir3.js";
import BossZone from "./js/BossZone.js";
import Menu from "./js/Menu.js";


var config = {
  type: Phaser.AUTO,
  width: 800, // largeur en pixels
  height: 600, // hauteur en pixels
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 0 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [Menu,selection,niveau1,Salle01,Couloir1,Couloir2,Couloir3,BossZone]  // liste des scenes du jeu : ici une seule scene : selection
};


// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("Menu"); // lancement de la scene selection
  