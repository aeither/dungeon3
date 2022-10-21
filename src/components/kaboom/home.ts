import { KaboomCtx } from "kaboom";

export const Home = (k: KaboomCtx) => {
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
    keyDown,
    text,
    go,
    shake,
    layers,
    layer,
    play,
    wait,
    opacity,
    center,
    scale,
    onUpdate,
    vec2,
    cursor,
    debug,
  } = k;

  // Keep track which is the current font
  let curFont = 0;
  let curSize = 48;
  const pad = 24;

  function addButton(txt: string, px: number, py: number, f: any) {
    const btn = add([
      text(txt),
      pos(px, py),
      area({ cursor: "pointer" }),
      scale(1),
      origin("center"),
    ]);

    btn.onClick(f);

    btn.onUpdate(() => {
      if (btn.isHovering()) {
        btn.scale = vec2(1.2);
      } else {
        btn.scale = vec2(1);
        cursor("default");
      }
    });
  }

  addButton("Start", center().x, center().y - 120, () => go("game"));
  addButton("Quit", center().x, center().y, () => debug.log("quit"));
};
