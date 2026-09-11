// Deterministic regression cases for media races; no browser or network required.
const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const ts = require('typescript');
const input = fs.readFileSync(
  require('path').resolve(__dirname, '../src/components/room/ClipPlayer.tsx'),
  'utf8'
);
const compiled = ts.transpileModule(input, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022
  }
}).outputText;
const flush = async () => {
  for (let i = 0; i < 16; i++) await Promise.resolve();
};

function fixture(config = {}) {
  let now = 0,
    nextTimer = 1;
  const timers = new Map(),
    log = [];
  function later(fn, delay = 0) {
    const id = nextTimer++;
    timers.set(id, { at: now + delay, fn });
    return id;
  }
  function cancel(id) {
    timers.delete(id);
  }
  async function tick(ms) {
    const end = now + ms;
    let count = 0;
    await flush();
    while (true) {
      const task = [...timers]
        .filter(([, t]) => t.at <= end)
        .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
      if (!task) break;
      if (++count > 500) throw Error('timer retry storm');
      now = task[1].at;
      timers.delete(task[0]);
      task[1].fn();
      await flush();
    }
    now = end;
    await flush();
  }
  class Video extends EventTarget {
    constructor(index) {
      super();
      this.index = index;
      this.style = { opacity: 0 };
      this.src = '';
      this.readyState = 0;
      this.error = null;
      this.paused = true;
      this.ended = false;
      this._time = 0;
      this.version = 0;
      this.waiting = [];
      this.callbacks = new Map();
      this.callbackId = 0;
      this.intent = false;
    }
    set currentTime(t) {
      this._time = t;
      this.ended = false;
    }
    get currentTime() {
      return this._time;
    }
    load() {
      this.version++;
      this.pause();
      this.readyState = 0;
      this.error = null;
      this.ended = false;
      log.push({ time: now, event: 'load', index: this.index, src: this.src });
      if (!this.src) return;
      const version = this.version;
      const delay = config.loadDelay?.(this.src, this.index) ?? 20;
      later(() => {
        if (version !== this.version) return;
        if (config.fail?.(this.src, this.index)) {
          this.error = { code: 4 };
          this.dispatchEvent(new Event('error'));
          for (const w of this.waiting.splice(0))
            w.reject(new DOMException('decode', 'NotSupportedError'));
        } else {
          this.readyState = 3;
          this.dispatchEvent(new Event('canplay'));
          this.start();
        }
      }, delay);
    }
    play() {
      log.push({ time: now, event: 'play', index: this.index, src: this.src });
      if (config.block?.(this.src, this.index))
        return Promise.reject(new DOMException('blocked', 'NotAllowedError'));
      if (this.error)
        return Promise.reject(new DOMException('decode', 'NotSupportedError'));
      this.intent = true;
      this.ended = false;
      const p = new Promise((resolve, reject) =>
        this.waiting.push({ resolve, reject })
      );
      this.start();
      return p;
    }
    start() {
      if (this.readyState < 2 || !this.intent) return;
      const version = this.version;
      later(() => {
        if (version !== this.version || !this.intent) return;
        this.paused = false;
        for (const w of this.waiting.splice(0)) w.resolve();
        this.scheduleFrame();
      }, config.playDelay ?? 5);
    }
    pause() {
      this.paused = true;
      this.intent = false;
      for (const w of this.waiting.splice(0))
        w.reject(new DOMException('paused', 'AbortError'));
    }
    requestVideoFrameCallback(fn) {
      const id = ++this.callbackId;
      this.callbacks.set(id, fn);
      this.scheduleFrame();
      return id;
    }
    cancelVideoFrameCallback(id) {
      this.callbacks.delete(id);
    }
    scheduleFrame() {
      later(() => {
        if (this.paused) return;
        const entries = [...this.callbacks];
        this.callbacks.clear();
        for (const [, fn] of entries) fn(now, {});
      }, 16);
    }
    finish() {
      this.paused = true;
      this.intent = false;
      this.ended = true;
      this.dispatchEvent(new Event('ended'));
    }
    removeAttribute(attr) {
      if (attr === 'src') this.src = '';
    }
  }
  const videos = [];
  const refs = [],
    effects = [];
  let refIndex = 0,
    effectIndex = 0;
  const handle = {};
  let propPaused = false;
  const react = {
    forwardRef: (f) => f,
    useRef: (initial) =>
      refs[refIndex++] ?? (refs[refIndex - 1] = { current: initial }),
    useImperativeHandle: (ref, factory) => Object.assign(ref, factory()),
    useEffect: (fn, deps) => {
      const i = effectIndex++;
      const old = effects[i];
      const changed = !old || deps.some((d, j) => d !== old.deps[j]);
      effects[i] = { ...old, fn, deps, changed };
    }
  };
  const jsx = (type, props) => {
    if (type === 'video' && !props.ref.current) {
      const v = new Video(videos.length);
      videos.push(v);
      props.ref.current = v;
    }
    return { type, props };
  };
  const document = new EventTarget();
  document.hidden = false;
  const module = { exports: {} };
  const math = Object.create(Math);
  math.random = () => 0;
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    require: (n) =>
      n === 'react'
        ? react
        : n === 'react/jsx-runtime'
          ? { jsx, jsxs: jsx }
          : {},
    setTimeout: later,
    clearTimeout: cancel,
    requestAnimationFrame: (fn) => later(() => fn(now), 16),
    AbortController,
    DOMException,
    document,
    Math: math,
    console
  });
  const clips = config.clips ?? [
    { src: '/idle', weight: 5 },
    { src: '/work', weight: 4 }
  ];
  function render(paused = propPaused) {
    propPaused = paused;
    refIndex = 0;
    effectIndex = 0;
    module.exports.default({ clips, poster: '/poster', paused }, handle);
    for (const e of effects) {
      if (e.changed) {
        e.cleanup?.();
        e.cleanup = e.fn();
        e.changed = false;
      }
    }
  }
  function visible() {
    return videos
      .filter((v) => Number(v.style.opacity) === 1)
      .sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
  }
  function hidden(value) {
    document.hidden = value;
    document.dispatchEvent(new Event('visibilitychange'));
  }
  function unmount() {
    for (const e of effects) e.cleanup?.();
  }
  render();
  return {
    videos,
    log,
    tick,
    render,
    handle,
    visible,
    hidden,
    unmount,
    timers
  };
}

const cases = [];
async function test(name, fn) {
  try {
    await fn();
    cases.push({ name, status: 'PASS' });
  } catch (error) {
    cases.push({ name, status: 'FAIL', message: error.stack });
  }
}
(async () => {
  await test('Pause/resume in initial 500ms reveal', async () => {
    const f = fixture();
    await f.tick(60);
    f.render(true);
    await f.tick(50);
    f.render(false);
    await f.tick(1000);
    assert.equal(f.visible().paused, false);
    assert.equal(f.visible().src, '/idle');
    f.unmount();
  });
  await test('Pause/resume during 160ms ambient fade', async () => {
    const f = fixture();
    await f.tick(1000);
    f.visible().finish();
    await f.tick(30);
    f.render(true);
    await f.tick(30);
    f.render(false);
    await f.tick(500);
    assert.equal(f.visible().index, 1);
    assert.equal(f.visible().paused, false);
    assert.equal(f.videos[0].paused, true);
    f.unmount();
  });
  await test('Pause across pending play rejection does not blacklist source', async () => {
    const f = fixture({ playDelay: 100 });
    await f.tick(30);
    f.render(true);
    await f.tick(10);
    f.render(false);
    await f.tick(1000);
    assert.equal(f.visible().paused, false);
    assert.equal(f.visible().src, '/idle');
    assert.equal(
      f.log.filter(
        (x) => x.event === 'load' && x.index === 0 && x.src === '/idle'
      ).length,
      1
    );
    f.unmount();
  });
  await test('Pause/resume while next ambient video loads', async () => {
    const f = fixture({ loadDelay: (src, index) => (index === 1 ? 3000 : 20) });
    await f.tick(1000);
    f.visible().finish();
    await f.tick(50);
    f.render(true);
    await f.tick(200);
    f.render(false);
    await f.tick(4000);
    assert.equal(f.visible().index, 1);
    assert.equal(f.visible().paused, false);
    f.unmount();
  });
  await test('Reaction ignores outgoing ended event during dissolve', async () => {
    const f = fixture();
    await f.tick(1000);
    const old = f.visible();
    f.handle.playNow('/cat');
    await f.tick(60);
    old.finish();
    await f.tick(1000);
    assert.equal(f.visible().src, '/cat');
    assert.equal(f.visible().paused, false);
    assert.equal(old.style.opacity, '0');
    f.visible().finish();
    await f.tick(500);
    assert.equal(f.visible().src, '/idle');
    f.unmount();
  });
  await test('Queued reaction while natural fade is busy', async () => {
    const f = fixture();
    await f.tick(1000);
    f.visible().finish();
    await f.tick(30);
    f.handle.playNow('/cat');
    await f.tick(1000);
    assert.equal(f.visible().src, '/cat');
    assert.equal(f.visible().paused, false);
    f.unmount();
  });
  await test('Pause reaction while loading, then resume requested source', async () => {
    const f = fixture({ loadDelay: (src) => (src === '/cat' ? 1000 : 20) });
    await f.tick(1000);
    f.handle.playNow('/cat');
    await f.tick(100);
    f.render(true);
    await f.tick(1200);
    f.render(false);
    await f.tick(1000);
    assert.equal(f.visible().src, '/cat');
    assert.equal(f.visible().paused, false);
    f.unmount();
  });
  await test('First broken source falls back to healthy clip', async () => {
    const f = fixture({ fail: (src) => src === '/idle' });
    await f.tick(2000);
    assert.equal(f.visible().src, '/work');
    assert.equal(f.visible().paused, false);
    assert.equal(
      f.log.filter((x) => x.event === 'load' && x.src === '/idle').length,
      1
    );
    f.unmount();
  });
  await test('All failing sources stop retries and preserve poster', async () => {
    const f = fixture({ fail: () => true });
    await f.tick(30000);
    assert.equal(f.visible(), undefined);
    assert.equal(f.log.filter((x) => x.event === 'load' && x.src).length, 2);
    f.unmount();
  });
  await test('Empty clip pool keeps poster', async () => {
    const f = fixture({ clips: [] });
    await f.tick(1000);
    assert.equal(f.visible(), undefined);
    assert.equal(f.log.length, 0);
    f.unmount();
  });
  await test('Autoplay denied keeps poster without retries', async () => {
    const f = fixture({ block: () => true });
    await f.tick(30000);
    assert.equal(f.visible(), undefined);
    assert.equal(f.log.filter((x) => x.event === 'play').length, 1);
    f.unmount();
  });
  await test('Unmount while loading prevents later video reveal', async () => {
    const f = fixture({ loadDelay: () => 1000 });
    await f.tick(100);
    f.unmount();
    await f.tick(30000);
    assert.equal(f.visible(), undefined);
    assert(f.videos.every((v) => v.paused));
  });
  await test('Visibility pause/resume during reaction fade', async () => {
    const f = fixture();
    await f.tick(1000);
    f.handle.playNow('/cat');
    await f.tick(100);
    f.hidden(true);
    await f.tick(100);
    f.hidden(false);
    await f.tick(1000);
    assert.equal(f.visible().src, '/cat');
    assert.equal(f.visible().paused, false);
    f.unmount();
  });
  console.log(JSON.stringify(cases, null, 2));
  process.exitCode = cases.some((result) => result.status === 'FAIL') ? 1 : 0;
})();
