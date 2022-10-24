import { KaboomCtx } from "kaboom";
import {
  OLDMAN,
  OLDMAN2,
  OLDMAN3,
  HERO,
  SPEED,
  SWORD,
} from "../../utils/constants";
import { SetUserAnchor } from "@/hooks/anchor";

export const Game = (k: KaboomCtx, setUserAnchor: SetUserAnchor) => {
  const {
    add,
    pos,
    rect,
    color,
    width,
    height,
    origin,
    area,
    destroy,
    onKeyDown,
    text,
    go,
    shake,
    layers,
    layer,
    play,
    wait,
    opacity,
    loadSpriteAtlas,
    loadBean,
    addLevel,
    sprite,
    vec2,
    solid,
    z,
    rotate,
    follow,
    LEFT,
    UP,
    RIGHT,
    DOWN,
    onKeyPress,
    every,
    dt,
    fixed,
    isKeyPressed,
    onKeyRelease,
    rand,
    loadSound,
    loadSprite,
    camPos,
    camScale,
    scale,
    debug,
    scene,
    cursor,
  } = k;

  /**
   * Map
   */
  // floor
  addLevel(
    [
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
      "                                        ",
    ],
    {
      width: 16,
      height: 16,
      " ": () => [sprite("floor", { frame: ~~rand(0, 8) })],
    }
  );
  const map = addLevel(
    [
      "                                        ",
      "tttttttttttttttttttttttttttttttttttttttt",
      "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwd",
      "l                                      r",
      "l    $                                 r",
      "l                                      r",
      "l      ccc    ccc      ccc       ccc   r",
      "l                                      r",
      "l  ccc            ccc       ccc        r",
      "4ttttttttttttttttttttttttttttttttttttt r",
      "ewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww r",
      "l                                      r",
      "l                      c               r",
      "l               ccccccccc              r",
      "l                      c               r",
      "l                                      r",
      "l                                      r",
      "4ttttttttttttttttttttttttttttttttttttttr",
      "ewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwr",
      "l                                      r",
      "l   cccccccccccccccccccccccccccccccc   r",
      "l                                      r",
      "l   cccccccccccccccccccccccccccccccc   r",
      "l                                      r",
      "l                                      r",
      "attttttttttttttttttttttttttttttttttttttb",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    ],
    {
      width: 16,
      height: 16,
      $: () => [sprite("chest"), area(), solid(), { opened: false }, "chest"],
      c: () => [sprite("coin", { anim: "spin" }), area(), "coin"],
      a: () => [sprite("wall_botleft"), area({ width: 4 }), solid()],
      b: () => [
        sprite("wall_botright"),
        area({ width: 4, offset: vec2(12, 0) }),
        solid(),
      ],
      q: () => [sprite("wall_topleft"), area(), solid()],
      4: () => [sprite("wall_topmidleft"), area(), solid()],
      e: () => [sprite("wall_midleft"), area(), solid()],
      d: () => [sprite("wall_topright"), area(), solid()],
      w: () => [sprite("wall"), area(), solid()],
      t: () => [
        sprite("wall_top"),
        area({ height: 4, offset: vec2(0, 12) }),
        solid(),
      ],
      l: () => [sprite("wall_left"), area({ width: 4 }), solid()],
      r: () => [
        sprite("wall_right"),
        area({ width: 4, offset: vec2(12, 0) }),
        solid(),
      ],
    }
  );

  /**
   * Sprites
   */
  const player = add([
    pos(map.getPos(11, 11)),
    sprite(HERO, { anim: "idle" }),
    area({ width: 12, height: 12, offset: vec2(0, 6) }),
    solid(),
    origin("center"),
  ]);

  const sword = add([
    pos(),
    sprite(SWORD),
    origin("bot"),
    rotate(0),
    follow(player, vec2(-4, 9)),
    area(),
    spin(),
  ]);

  const oldman = add([
    OLDMAN,
    sprite(OLDMAN),
    pos(map.getPos(30, 12)),
    origin("bot"),
    area(),
    solid(),
    { msg: "Save progress?" },
  ]);

  const oldman2 = add([
    OLDMAN2,
    sprite(OLDMAN2),
    pos(map.getPos(8, 20)),
    origin("bot"),
    area(),
    solid(),
    { msg: "Save progress?" },
  ]);

  const oldman3 = add([
    OLDMAN3,
    sprite(OLDMAN3),
    pos(map.getPos(8, 4)),
    origin("bot"),
    area(),
    solid(),
    { msg: "Save progress?" },
  ]);

  const ogre = add([
    "ogre",
    sprite("ogre"),
    pos(map.getPos(6, 14)),
    origin("bot"),
    area({ scale: 0.5 }),
    solid(),
  ]);

  const monster = add([
    "monster",
    sprite("monster", { anim: "run" }),
    pos(map.getPos(4, 7)),
    origin("bot"),
    patrol(100),
    area({ scale: 0.5 }),
    solid(),
  ]);

  const monster2 = add([
    "monster",
    sprite("monster", { anim: "run" }),
    pos(map.getPos(24, 9)),
    origin("bot"),
    patrol(100),
    area({ scale: 0.5 }),
    solid(),
  ]);

  /**
   * HUD
   */
  const counter = add([
    text("Score: 0", { size: 18, font: "sinko" }),
    pos(40, 4),
    z(100),
    fixed(),
    { value: 0 },
  ]);

  const health = add([
    sprite("health", { width: 18, height: 18 }),
    pos(12, 4),
    fixed(),
  ]);

  /**
   * Logics
   */
  function spin() {
    let spinning = false;
    return {
      angle: 0, // add type for this.angle
      id: "spin",
      update() {
        if (spinning) {
          this.angle += 1200 * dt();
          if (this.angle >= 360) {
            this.angle = 0;
            spinning = false;
          }
        }
      },
      spin() {
        spinning = true;
      },
    };
  }
  function reduceHealth() {
    switch (health.frame) {
      case 0:
        health.frame = 1;
        break;
      case 1:
        health.frame = 2;
        break;
      default:
        go("home");
        counter.value = 0;
        counter.text = "0";
        health.frame = 0;
        break;
    }
  }

  function patrol(speed = 60, dir = 1) {
    return {
      on: (obj: any, col: any) => console.log(),
      move: (x: any, y: any) => console.log(),
      id: "patrol",
      require: ["pos", "area"],
      add() {
        this.on("collide", (obj: any, col: any) => {
          if (col.isLeft() || col.isRight()) {
            dir = -dir;
          }
        });
      },
      update() {
        this.move(speed * dir, 0);
      },
    };
  }

  function addDialog() {
    const h = 160;
    const btnText = "Yes";
    const bg = add([
      pos(0, height() - h),
      rect(width(), h),
      color(0, 0, 0),
      z(100),
      fixed(),
    ]);
    const txt = add([
      text("", {
        size: 18,
      }),
      pos(vec2(300, 400)),
      scale(1),
      origin("center"),
      z(100),
      fixed(),
    ]);
    const btn = add([
      text(btnText, {
        size: 24,
      }),
      pos(vec2(400, 400)),
      area({ cursor: "pointer" }),
      scale(1),
      origin("center"),
      z(100),
      fixed(),
    ]);

    btn.onUpdate(() => {
      if (btn.isHovering()) {
        btn.scale = vec2(1.2);
      } else {
        btn.scale = vec2(1);
        cursor("default");
      }
    });

    btn.onClick(() => {
      console.log("set: ", counter.value, health.frame),
        setUserAnchor(counter.value, health.frame);
    });
    bg.hidden = true;
    txt.hidden = true;
    btn.hidden = true;
    return {
      say(t: string) {
        txt.text = t;
        bg.hidden = false;
        txt.hidden = false;
        btn.hidden = false;
      },
      dismiss() {
        if (!this.active()) {
          return;
        }
        txt.text = "";
        bg.hidden = true;
        txt.hidden = true;
        btn.hidden = true;
      },
      active() {
        return !bg.hidden;
      },
      destroy() {
        bg.destroy();
        txt.destroy();
      },
    };
  }
  const dialog = addDialog();

  /**
   * on Player Collides
   */
  player.onCollide("ogre", async (obj, col) => {
    play("hit");
    reduceHealth();
    // initUserAnchor();
  });

  player.onCollide("coin", async (obj, col) => {
    destroy(obj);
    play("coin");
    counter.value += 10;
    counter.text = `Score: ${counter.value}`;
    // initUserAnchor();
  });

  player.onCollide("monster", async (obj, col) => {
    if (col?.isRight()) {
      player.moveBy(-32, 0);
    }
    if (col?.isLeft()) {
      player.moveBy(32, 0);
    }
    if (col?.isBottom()) {
      player.moveBy(0, -32);
    }
    if (col?.isTop()) {
      player.moveBy(0, 32);
    }
    if (col?.displacement) play("hit");
    reduceHealth();
    // initUserAnchor();
  });

  // TODO: sword collide enemy
  sword.onCollide("ogre", async (ogre) => {
    play("kill");
    counter.value += 100;
    counter.text = `Score: ${counter.value}`;
    destroy(ogre);
    // initUserAnchor();
  });

  player.onCollide(OLDMAN, (obj) => {
    dialog.say(obj.msg);
  });

  player.onCollide(OLDMAN2, (obj) => {
    dialog.say(obj.msg);
  });

  player.onCollide(OLDMAN3, (obj) => {
    dialog.say(obj.msg);
  });

  // player.onUpdate(() => {
  //   collides("")
  //   if (player.isColliding(ogre)) {
  //     console.log("cllide");
  //   }
  // });

  /**
   * Player Controls
   */

  camScale(vec2(2));
  player.onUpdate(() => {
    camPos(player.pos);
  });

  onKeyPress("space", () => {
    let interacted = false;
    every("chest", (c) => {
      if (player.isTouching(c)) {
        if (c.opened) {
          c.play("close");
          c.opened = false;
        } else {
          c.play("open");
          c.opened = true;
          counter.value += 500;
          counter.text = `Score: ${counter.value}`;
        }
        interacted = true;
      }
    });
    if (!interacted) {
      play("wooosh");
      sword.spin();
    }
  });

  onKeyDown("right", () => {
    player.flipX(false);
    sword.flipX(false);
    player.move(SPEED, 0);
    sword.follow.offset = vec2(-4, 9);
  });

  onKeyDown("left", () => {
    player.flipX(true);
    sword.flipX(true);
    player.move(-SPEED, 0);
    sword.follow.offset = vec2(4, 9);
  });

  onKeyDown("up", () => {
    player.move(0, -SPEED);
  });

  onKeyDown("down", () => {
    player.move(0, SPEED);
  });

  onKeyRelease(["left", "right", "up", "down"], () => {
    player.play("idle");
  });

  onKeyPress(["left", "right", "up", "down"], () => {
    dialog.dismiss();
    player.play("run");
  });
};
