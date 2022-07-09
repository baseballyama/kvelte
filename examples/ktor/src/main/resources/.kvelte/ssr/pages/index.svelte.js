// ../.kvelte/ssr/chunks/Layout-ab0165e3.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
var is_client = typeof window !== "undefined";
var now = is_client ? () => window.performance.now() : () => Date.now();
var raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
var tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
Promise.resolve();
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css22) => css22.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape_attribute_value(value.toString())}"`;
  return ` ${name}${assignment}`;
}
var Logo_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => ".svgSample1.svelte-12o3wme text.svelte-12o3wme.svelte-12o3wme{font-weight:bold;font-size:24px;font-family:Meiryo UI;stroke:#ff3e00;fill:#ffffff;letter-spacing:5px;text-anchor:middle;dominant-baseline:alphabetic}.svgSample1.svelte-12o3wme>svg.svelte-12o3wme>use.svelte-12o3wme:nth-of-type(1){stroke-width:11px;paint-order:stroke;stroke-linejoin:round}.svgSample1.svelte-12o3wme>svg.svelte-12o3wme>use.svelte-12o3wme:nth-of-type(2){stroke-width:0}")();
var css$2 = {
  code: ".svgSample1.svelte-12o3wme text.svelte-12o3wme.svelte-12o3wme{font-weight:bold;font-size:24px;font-family:Meiryo UI;stroke:#ff3e00;fill:#ffffff;letter-spacing:5px;text-anchor:middle;dominant-baseline:alphabetic}.svgSample1.svelte-12o3wme>svg.svelte-12o3wme>use.svelte-12o3wme:nth-of-type(1){stroke-width:11px;paint-order:stroke;stroke-linejoin:round}.svgSample1.svelte-12o3wme>svg.svelte-12o3wme>use.svelte-12o3wme:nth-of-type(2){stroke-width:0}",
  map: null
};
var Logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="${"svgSample1 svelte-12o3wme"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" width="${"100%"}" height="${"100%"}" class="${"svelte-12o3wme"}"><defs><text dy="${"0.4em"}" id="${"outTextx"}" class="${"svelte-12o3wme"}">K</text></defs><use x="${"50%"}" y="${"50%"}" xlink:href="${"#outTextx"}" class="${"svelte-12o3wme"}"></use><use x="${"50%"}" y="${"50%"}" xlink:href="${"#outTextx"}" class="${"svelte-12o3wme"}"></use></svg>
</div>`;
});
var Header_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => 'header.svelte-l3i19y.svelte-l3i19y{display:flex;justify-content:space-between}.corner.svelte-l3i19y.svelte-l3i19y{width:3em;height:3em}.corner.svelte-l3i19y a.svelte-l3i19y{display:flex;align-items:center;justify-content:center;width:100%;height:100%}nav.svelte-l3i19y.svelte-l3i19y{display:flex;justify-content:center;--background:rgba(255, 255, 255, 0.7)}svg.svelte-l3i19y.svelte-l3i19y{width:2em;height:3em;display:block}path.svelte-l3i19y.svelte-l3i19y{fill:var(--background)}ul.svelte-l3i19y.svelte-l3i19y{position:relative;padding:0;margin:0;height:3em;display:flex;justify-content:center;align-items:center;list-style:none;background:var(--background);background-size:contain}li.svelte-l3i19y.svelte-l3i19y{position:relative;height:100%}li.active.svelte-l3i19y.svelte-l3i19y::before{--size:6px;content:"";width:0;height:0;position:absolute;top:0;left:calc(50% - var(--size));border:var(--size) solid transparent;border-top:var(--size) solid var(--accent-color)}nav.svelte-l3i19y a.svelte-l3i19y{display:flex;height:100%;align-items:center;padding:0 1em;color:var(--heading-color);font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;transition:color 0.2s linear}a.svelte-l3i19y.svelte-l3i19y:hover{color:var(--accent-color)}')();
var css$1 = {
  code: 'header.svelte-l3i19y.svelte-l3i19y{display:flex;justify-content:space-between}.corner.svelte-l3i19y.svelte-l3i19y{width:3em;height:3em}.corner.svelte-l3i19y a.svelte-l3i19y{display:flex;align-items:center;justify-content:center;width:100%;height:100%}nav.svelte-l3i19y.svelte-l3i19y{display:flex;justify-content:center;--background:rgba(255, 255, 255, 0.7)}svg.svelte-l3i19y.svelte-l3i19y{width:2em;height:3em;display:block}path.svelte-l3i19y.svelte-l3i19y{fill:var(--background)}ul.svelte-l3i19y.svelte-l3i19y{position:relative;padding:0;margin:0;height:3em;display:flex;justify-content:center;align-items:center;list-style:none;background:var(--background);background-size:contain}li.svelte-l3i19y.svelte-l3i19y{position:relative;height:100%}li.active.svelte-l3i19y.svelte-l3i19y::before{--size:6px;content:"";width:0;height:0;position:absolute;top:0;left:calc(50% - var(--size));border:var(--size) solid transparent;border-top:var(--size) solid var(--accent-color)}nav.svelte-l3i19y a.svelte-l3i19y{display:flex;height:100%;align-items:center;padding:0 1em;color:var(--heading-color);font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;transition:color 0.2s linear}a.svelte-l3i19y.svelte-l3i19y:hover{color:var(--accent-color)}',
  map: null
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<header class="${"svelte-l3i19y"}"><div class="${"corner svelte-l3i19y"}"><a href="${"/"}" title="${"Logo"}" class="${"svelte-l3i19y"}">${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}</a></div>

  <nav class="${"svelte-l3i19y"}"><svg viewBox="${"0 0 2 3"}" aria-hidden="${"true"}" class="${"svelte-l3i19y"}"><path d="${"M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"}" class="${"svelte-l3i19y"}"></path></svg>
    <ul class="${"svelte-l3i19y"}"><li class="${["svelte-l3i19y", ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/"}" class="${"svelte-l3i19y"}">Home</a></li>
      <li class="${["svelte-l3i19y", ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/about"}" class="${"svelte-l3i19y"}">About</a></li>
      <li class="${["svelte-l3i19y", ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/todos"}" class="${"svelte-l3i19y"}">Todos</a></li></ul>
    <svg viewBox="${"0 0 2 3"}" aria-hidden="${"true"}" class="${"svelte-l3i19y"}"><path d="${"M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"}" class="${"svelte-l3i19y"}"></path></svg></nav>

  <div class="${"corner svelte-l3i19y"}"></div>
</header>`;
});
var Layout_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => "main.svelte-1nw0d5b.svelte-1nw0d5b{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;max-width:1024px;margin:0 auto;box-sizing:border-box}footer.svelte-1nw0d5b.svelte-1nw0d5b{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px}footer.svelte-1nw0d5b a.svelte-1nw0d5b{font-weight:bold}@media(min-width: 480px){footer.svelte-1nw0d5b.svelte-1nw0d5b{padding:40px 0}}")();
var css = {
  code: "main.svelte-1nw0d5b.svelte-1nw0d5b{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;max-width:1024px;margin:0 auto;box-sizing:border-box}footer.svelte-1nw0d5b.svelte-1nw0d5b{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px}footer.svelte-1nw0d5b a.svelte-1nw0d5b{font-weight:bold}@media(min-width: 480px){footer.svelte-1nw0d5b.svelte-1nw0d5b{padding:40px 0}}",
  map: null
};
var Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<link rel="${"stylesheet"}" href="${"/assets/app.css"}">`, ""}
${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

<main class="${"svelte-1nw0d5b"}">${slots.default ? slots.default({}) : ``}</main>

<footer class="${"svelte-1nw0d5b"}"><p>visit <a href="${"https://github.com/baseballyama/kvelte"}" target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"svelte-1nw0d5b"}">GitHub
    </a>
    to learn Kvelte
  </p>
</footer>`;
});

// ../.kvelte/ssr/pages/index.svelte.js
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60);
    const spring2 = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring2 - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;
    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value;
    } else {
      ctx.settled = false;
      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
function spring(value, opts = {}) {
  const store = writable(value);
  const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
  let last_time;
  let task;
  let current_token;
  let last_value = value;
  let target_value = value;
  let inv_mass = 1;
  let inv_mass_recovery_rate = 0;
  let cancel_task = false;
  function set(new_value, opts2 = {}) {
    target_value = new_value;
    const token = current_token = {};
    if (value == null || opts2.hard || spring2.stiffness >= 1 && spring2.damping >= 1) {
      cancel_task = true;
      last_time = now();
      last_value = new_value;
      store.set(value = target_value);
      return Promise.resolve();
    } else if (opts2.soft) {
      const rate = opts2.soft === true ? 0.5 : +opts2.soft;
      inv_mass_recovery_rate = 1 / (rate * 60);
      inv_mass = 0;
    }
    if (!task) {
      last_time = now();
      cancel_task = false;
      task = loop((now2) => {
        if (cancel_task) {
          cancel_task = false;
          task = null;
          return false;
        }
        inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
        const ctx = {
          inv_mass,
          opts: spring2,
          settled: true,
          dt: (now2 - last_time) * 60 / 1e3
        };
        const next_value = tick_spring(ctx, last_value, value, target_value);
        last_time = now2;
        last_value = value;
        store.set(value = next_value);
        if (ctx.settled) {
          task = null;
        }
        return !ctx.settled;
      });
    }
    return new Promise((fulfil) => {
      task.promise.then(() => {
        if (token === current_token)
          fulfil();
      });
    });
  }
  const spring2 = {
    set,
    update: (fn, opts2) => set(fn(target_value, value), opts2),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  };
  return spring2;
}
var Counter_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => ".counter.svelte-dvqhp4.svelte-dvqhp4{display:flex;border-top:1px solid rgba(0, 0, 0, 0.1);border-bottom:1px solid rgba(0, 0, 0, 0.1);margin:1rem 0}.counter.svelte-dvqhp4 button.svelte-dvqhp4{width:2em;padding:0;display:flex;align-items:center;justify-content:center;border:0;background-color:transparent;touch-action:manipulation;color:var(--text-color);font-size:2rem}.counter.svelte-dvqhp4 button.svelte-dvqhp4:hover{cursor:pointer;background-color:var(--secondary-color)}svg.svelte-dvqhp4.svelte-dvqhp4{width:25%;height:25%}path.svelte-dvqhp4.svelte-dvqhp4{vector-effect:non-scaling-stroke;stroke-width:2px;stroke:var(--text-color)}.counter-viewport.svelte-dvqhp4.svelte-dvqhp4{width:8em;height:4em;overflow:hidden;text-align:center;position:relative}.counter-viewport.svelte-dvqhp4 strong.svelte-dvqhp4{position:absolute;display:flex;width:100%;height:100%;font-weight:400;color:var(--accent-color);font-size:4rem;align-items:center;justify-content:center}.counter-digits.svelte-dvqhp4.svelte-dvqhp4{position:absolute;width:100%;height:100%}.hidden.svelte-dvqhp4.svelte-dvqhp4{top:-100%;user-select:none}")();
var css$12 = {
  code: ".counter.svelte-dvqhp4.svelte-dvqhp4{display:flex;border-top:1px solid rgba(0, 0, 0, 0.1);border-bottom:1px solid rgba(0, 0, 0, 0.1);margin:1rem 0}.counter.svelte-dvqhp4 button.svelte-dvqhp4{width:2em;padding:0;display:flex;align-items:center;justify-content:center;border:0;background-color:transparent;touch-action:manipulation;color:var(--text-color);font-size:2rem}.counter.svelte-dvqhp4 button.svelte-dvqhp4:hover{cursor:pointer;background-color:var(--secondary-color)}svg.svelte-dvqhp4.svelte-dvqhp4{width:25%;height:25%}path.svelte-dvqhp4.svelte-dvqhp4{vector-effect:non-scaling-stroke;stroke-width:2px;stroke:var(--text-color)}.counter-viewport.svelte-dvqhp4.svelte-dvqhp4{width:8em;height:4em;overflow:hidden;text-align:center;position:relative}.counter-viewport.svelte-dvqhp4 strong.svelte-dvqhp4{position:absolute;display:flex;width:100%;height:100%;font-weight:400;color:var(--accent-color);font-size:4rem;align-items:center;justify-content:center}.counter-digits.svelte-dvqhp4.svelte-dvqhp4{position:absolute;width:100%;height:100%}.hidden.svelte-dvqhp4.svelte-dvqhp4{top:-100%;user-select:none}",
  map: null
};
function modulo(n, m) {
  return (n % m + m) % m;
}
var Counter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let offset;
  let $displayed_count, $$unsubscribe_displayed_count;
  let count = 0;
  const displayed_count = spring();
  $$unsubscribe_displayed_count = subscribe(displayed_count, (value) => $displayed_count = value);
  $$result.css.add(css$12);
  {
    displayed_count.set(count);
  }
  offset = modulo($displayed_count, 1);
  $$unsubscribe_displayed_count();
  return `<div class="${"counter svelte-dvqhp4"}"><button aria-label="${"Decrease the counter by one"}" class="${"svelte-dvqhp4"}"><svg aria-hidden="${"true"}" viewBox="${"0 0 1 1"}" class="${"svelte-dvqhp4"}"><path d="${"M0,0.5 L1,0.5"}" class="${"svelte-dvqhp4"}"></path></svg></button>

  <div class="${"counter-viewport svelte-dvqhp4"}"><div class="${"counter-digits svelte-dvqhp4"}" style="${"transform: translate(0, " + escape(100 * offset) + "%)"}"><strong class="${"hidden svelte-dvqhp4"}" aria-hidden="${"true"}">${escape(Math.floor($displayed_count + 1))}</strong>
      <strong class="${"svelte-dvqhp4"}">${escape(Math.floor($displayed_count))}</strong></div></div>

  <button aria-label="${"Increase the counter by one"}" class="${"svelte-dvqhp4"}"><svg aria-hidden="${"true"}" viewBox="${"0 0 1 1"}" class="${"svelte-dvqhp4"}"><path d="${"M0,0.5 L1,0.5 M0.5,0 L0.5,1"}" class="${"svelte-dvqhp4"}"></path></svg></button>
</div>`;
});
var index_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => "section.svelte-1qekb6{display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1}h1.svelte-1qekb6{font-size:60px;color:var(--accent-color)}")();
var css2 = {
  code: "section.svelte-1qekb6{display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1}h1.svelte-1qekb6{font-size:60px;color:var(--accent-color)}",
  map: null
};
var Pages = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { message } = $$props;
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  $$result.css.add(css2);
  return `${$$result.head += `${$$result.title = `<title>Kvelte - Home</title>`, ""}<meta name="${"description"}" content="${"Top page of Kvelte"}">`, ""}

${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<section class="${"svelte-1qekb6"}"><h1 class="${"svelte-1qekb6"}">Welcome to the ${escape(message)} App!</h1>
    <h2>try editing <strong>src/main/resources/kvelte/pages/index.svelte</strong></h2>
    ${validate_component(Counter, "Counter").$$render($$result, {}, {}, {})}</section>`;
    }
  })}`;
});

// ../.kvelte/ssr/pages/index.svelte.call.js
function render(props) {
  return JSON.stringify(Pages.render(JSON.parse(props)));
}
