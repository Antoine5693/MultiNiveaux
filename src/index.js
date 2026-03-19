import selection from "./js/selection.js"; 
import niveau1 from "./js/niveau1.js"; 
import Salle01 from "./js/Salle01.js";
import Salle02 from "./js/Salle02.js";
import Salle03 from "./js/Salle03.js";
import Salle04 from "./js/Salle04.js";
import Salle05 from "./js/Salle05.js";
import Salle06 from "./js/Salle06.js";
import Salle07 from "./js/Salle07.js";
import Salle08 from "./js/Salle08.js";
import Salle09 from "./js/Salle09.js";
import Salle10 from "./js/Salle10.js";
import Salle11 from "./js/Salle11.js";
import Salle12 from "./js/Salle12.js";
import Salle13 from "./js/Salle13.js";
import Salle14 from "./js/Salle14.js";
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
      debug: false // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [Menu,selection,niveau1,Salle01,Couloir1,Couloir2,Couloir3,BossZone,Salle02,Salle03,Salle04,Salle05,Salle06,Salle07,Salle08,Salle09,Salle10,Salle11,Salle12,Salle13,Salle14]  // liste des scenes du jeu : ici une seule scene : selection
};


// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("Menu"); // lancement de la scene selection
  