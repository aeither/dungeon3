import { KaboomCtx } from "kaboom";
import { Home } from "./home";
import { Game } from "./game";
import { OLDMAN, OLDMAN2, OLDMAN3 } from "./constants";

export const loadKaboom = (
  k: KaboomCtx
  // initUserAnchor: () => Promise<void>
) => {
  const { go, loadSpriteAtlas, loadSound, loadSprite, center, scene } = k;

  /**
   * Load Sprites and Sounds
   */
  loadSpriteAtlas("/assets/dungeon.png", "/assets/dungeon.json");
  loadSprite(OLDMAN, "/assets/OldMan/SeparateAnim/Idle.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 3,
      },
    },
  });
  loadSprite(OLDMAN2, "/assets/OldMan2/SeparateAnim/Idle.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 3,
      },
    },
  });
  loadSprite(OLDMAN3, "/assets/OldMan3/SeparateAnim/Idle.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 3,
      },
    },
  });

  // add([health()])

  loadSound("coin", "/assets/sounds/coin.wav");
  loadSound("hit", "/assets/sounds/hit.mp3");
  loadSound("wooosh", "/assets/sounds/wooosh.mp3");
  loadSound("kill", "/assets/sounds/kill.wav");

  scene("home", () => Home(k));

  scene("game", () => Game(k));

  function start() {
    // Start with the "game" scene, with initial parameters
    go("home", {});
  }
  start();
};
