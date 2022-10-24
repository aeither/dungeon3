import { KaboomCtx } from "kaboom";

export const Home = (k: KaboomCtx) => {
  const {
    add,
    pos,
    origin,
    area,
    text,
    go,
    center,
    scale,
    vec2,
    cursor,
    debug,
  } = k;

  function addButton(txt: string, px: number, py: number, f: any) {
    const btn = add([
      text(txt, { size: 48 }),
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
  addButton("Settings", center().x, center().y, () => debug.log("settings"));
};
