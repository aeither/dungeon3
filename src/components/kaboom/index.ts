import { SetUserAnchor } from "@/hooks/anchor";
import { KaboomCtx } from "kaboom";
import { OLDMAN, OLDMAN2, OLDMAN3 } from "../../utils/constants";
import { Game } from "./game";
import { Home } from "./home";

export const loadKaboom = (k: KaboomCtx, setUserAnchor: SetUserAnchor) => {
  const { go, loadSpriteAtlas, loadSound, loadSprite, play, scene } = k;

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

  loadSound("coin", "/assets/sounds/coin.wav");
  loadSound("hit", "/assets/sounds/hit.mp3");
  loadSound("wooosh", "/assets/sounds/wooosh.mp3");
  loadSound("kill", "/assets/sounds/kill.wav");

  loadSound("dungeon", "/assets/sounds/dungeon.ogg");
  const music = play("dungeon", {
    volume: 0.2,
    loop: true,
  });

  scene("home", () => Home(k));

  scene("game", () => Game(k, setUserAnchor));

  function start() {
    // Start with the "game" scene, with initial parameters
    go("home", {});
  }
  start();
};
