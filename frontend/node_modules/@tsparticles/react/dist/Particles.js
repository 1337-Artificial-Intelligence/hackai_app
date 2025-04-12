import { jsx as d } from "react/jsx-runtime";
import { useEffect as m } from "react";
import { tsParticles as s } from "@tsparticles/engine";
const f = (t) => {
  const i = t.id ?? "tsparticles";
  return m(() => {
    let e;
    return s.load({ id: i, url: t.url, options: t.options }).then((l) => {
      var a;
      e = l, (a = t.particlesLoaded) == null || a.call(t, l);
    }), () => {
      e == null || e.destroy();
    };
  }, [i, t, t.url, t.options]), /* @__PURE__ */ d("div", { id: i, className: t.className });
};
export {
  f as default
};
