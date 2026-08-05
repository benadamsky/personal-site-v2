'use client';

import { useEffect, useRef } from 'react';

type Vec3 = { x: number; y: number; z: number };

type Neuron = {
  pos: Vec3;
  size: number;
  machine: boolean;
  phase: number;
  excite: number;
  flash: number;
  fireAt: number;
  sx: number;
  sy: number;
  depth: number;
  scale: number;
};

type Edge = {
  a: number;
  b: number;
  kind: 'machine' | 'organic' | 'bridge';
  bow: number;
  glow: number;
};

type Pulse = {
  edge: number;
  dir: 1 | -1;
  t: number;
  speed: number;
};

type Bolt = {
  sx: number;
  sy: number;
  target: number;
  t: number;
  cascade: boolean;
};

const COPPER = [216, 164, 109] as const;
const CYAN = [110, 231, 221] as const;
const BONE = [240, 236, 228] as const;

const rgba = (c: readonly [number, number, number], a: number) =>
  `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

const NeuralField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let lastTime = 0;
    let ambientAt = 900;

    let neurons: Neuron[] = [];
    let edges: Edge[] = [];
    let adjacency: number[][] = [];
    let pulses: Pulse[] = [];
    let bolts: Bolt[] = [];

    let center = { x: width * 0.66, y: height * 0.5 };
    let radius = Math.min(width * 0.33, height * 0.44);

    const pointer = { x: -1, y: -1 };
    const spin = { x: 0, y: 0 };
    const spinTarget = { x: 0, y: 0 };

    const random = (() => {
      let seed = 4211;
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    })();

    const createBrain = () => {
      const desktop = width >= 980;
      const count = desktop ? 400 : 250;
      neurons = [];

      while (neurons.length < count) {
        const theta = Math.acos(2 * random() - 1);
        const phi = random() * Math.PI * 2;
        const shell = 0.55 + 0.45 * Math.cbrt(random());
        const bump = 1 + 0.05 * Math.sin(theta * 5 + 1.3) * Math.sin(phi * 4);
        const r = shell * bump;

        const point = {
          x: r * Math.sin(theta) * Math.cos(phi) * 0.95,
          y: r * Math.cos(theta) * 0.76,
          z: r * Math.sin(theta) * Math.sin(phi) * 1.18
        };

        if (point.y < -0.42) point.y = -0.42 + (point.y + 0.42) * 0.5;
        if (Math.abs(point.x) < 0.075) continue;

        neurons.push({
          pos: point,
          size: random(),
          machine: point.x < 0,
          phase: random() * Math.PI * 2,
          excite: 0,
          flash: 0,
          fireAt: 0,
          sx: 0,
          sy: 0,
          depth: 0,
          scale: 1
        });
      }

      const keys = new Set<string>();
      edges = [];

      const link = (a: number, b: number, kind: Edge['kind']) => {
        const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
        if (keys.has(key)) return;
        keys.add(key);
        edges.push({
          a,
          b,
          kind,
          bow: (random() - 0.5) * 0.5,
          glow: 0
        });
      };

      neurons.forEach((neuron, index) => {
        const nearest = neurons
          .map((other, otherIndex) => {
            const dx = other.pos.x - neuron.pos.x;
            const dy = other.pos.y - neuron.pos.y;
            const dz = other.pos.z - neuron.pos.z;
            return {
              otherIndex,
              distance: dx * dx + dy * dy + dz * dz
            };
          })
          .filter((entry) => entry.otherIndex !== index)
          .sort((left, right) => left.distance - right.distance)
          .slice(0, 2);

        nearest.forEach((entry) => {
          const other = neurons[entry.otherIndex];
          const kind =
            neuron.machine === other.machine
              ? neuron.machine
                ? 'machine'
                : 'organic'
              : 'bridge';
          link(index, entry.otherIndex, kind);
        });
      });

      const organicIndices = neurons.flatMap((n, i) => (n.machine ? [] : [i]));
      const machineIndices = neurons.flatMap((n, i) => (n.machine ? [i] : []));
      let bridges = 0;
      let attempts = 0;
      while (bridges < 14 && attempts < 400) {
        attempts += 1;
        const a = organicIndices[Math.floor(random() * organicIndices.length)];
        const b = machineIndices[Math.floor(random() * machineIndices.length)];
        const dx = neurons[a].pos.x - neurons[b].pos.x;
        const dy = neurons[a].pos.y - neurons[b].pos.y;
        const dz = neurons[a].pos.z - neurons[b].pos.z;
        if (dx * dx + dy * dy + dz * dz > 0.34) continue;
        link(a, b, 'bridge');
        bridges += 1;
      }

      adjacency = neurons.map(() => []);
      edges.forEach((edge, edgeIndex) => {
        adjacency[edge.a].push(edgeIndex);
        adjacency[edge.b].push(edgeIndex);
      });

      pulses = [];
      bolts = [];
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const desktop = width >= 980;
      center = desktop
        ? { x: width * 0.66, y: height * 0.5 }
        : { x: width * 0.5, y: height * 0.6 };
      radius = desktop
        ? Math.min(width * 0.33, height * 0.44)
        : Math.min(width * 0.58, height * 0.32);

      createBrain();
    };

    const spawnPulse = (edgeIndex: number, from?: number) => {
      if (pulses.length > 90) return;
      const edge = edges[edgeIndex];
      pulses.push({
        edge: edgeIndex,
        dir: from === undefined ? (random() > 0.5 ? 1 : -1) : from === edge.a ? 1 : -1,
        t: 0,
        speed: 0.012 + random() * 0.014
      });
      edge.glow = Math.min(edge.glow + 0.7, 1.4);
    };

    const fire = (index: number) => {
      const neuron = neurons[index];
      neuron.flash = 1;
      neuron.excite = Math.min(neuron.excite + 0.6, 1);
      adjacency[index].forEach((edgeIndex) => spawnPulse(edgeIndex, index));
    };

    const nearestNeuron = (screenX: number, screenY: number, cap = Infinity) => {
      let origin = -1;
      let best = cap;
      neurons.forEach((neuron, index) => {
        const dx = neuron.sx - screenX;
        const dy = neuron.sy - screenY;
        const distance = dx * dx + dy * dy;
        if (distance < best) {
          best = distance;
          origin = index;
        }
      });
      return origin;
    };

    const scheduleCascade = (origin: number, now: number) => {
      const depths = new Map<number, number>([[origin, 0]]);
      const queue = [origin];
      while (queue.length) {
        const current = queue.shift() as number;
        const depth = depths.get(current) as number;
        if (depth >= 9) continue;
        adjacency[current].forEach((edgeIndex) => {
          const edge = edges[edgeIndex];
          const next = edge.a === current ? edge.b : edge.a;
          if (!depths.has(next)) {
            depths.set(next, depth + 1);
            queue.push(next);
          }
        });
      }
      depths.forEach((depth, index) => {
        neurons[index].fireAt = now + depth * 90;
      });
    };

    const cascade = (screenX: number, screenY: number, now: number) => {
      const origin = nearestNeuron(screenX, screenY, 200 * 200);
      if (origin === -1) return;
      scheduleCascade(origin, now);
    };

    const handleSignal = (event: Event) => {
      const detail = (
        event as CustomEvent<{ x: number; y: number; mode: string }>
      ).detail;
      if (!detail) return;
      const target = nearestNeuron(detail.x, detail.y);
      if (target === -1) return;
      bolts.push({
        sx: detail.x,
        sy: detail.y,
        target,
        t: 0,
        cascade: detail.mode === 'cascade'
      });
    };

    const edgePoint = (edge: Edge, t: number) => {
      const a = neurons[edge.a];
      const b = neurons[edge.b];
      if (edge.kind === 'machine') {
        const elbowX = b.sx;
        const elbowY = a.sy;
        const first = Math.hypot(elbowX - a.sx, elbowY - a.sy);
        const second = Math.hypot(b.sx - elbowX, b.sy - elbowY);
        const total = first + second || 1;
        const split = first / total;
        if (t < split) {
          const local = t / (split || 1);
          return {
            x: a.sx + (elbowX - a.sx) * local,
            y: a.sy + (elbowY - a.sy) * local
          };
        }
        const local = (t - split) / (1 - split || 1);
        return {
          x: elbowX + (b.sx - elbowX) * local,
          y: elbowY + (b.sy - elbowY) * local
        };
      }
      if (edge.kind === 'organic') {
        const midX = (a.sx + b.sx) / 2 - (b.sy - a.sy) * edge.bow;
        const midY = (a.sy + b.sy) / 2 + (b.sx - a.sx) * edge.bow;
        const inverse = 1 - t;
        return {
          x: inverse * inverse * a.sx + 2 * inverse * t * midX + t * t * b.sx,
          y: inverse * inverse * a.sy + 2 * inverse * t * midY + t * t * b.sy
        };
      }
      return {
        x: a.sx + (b.sx - a.sx) * t,
        y: a.sy + (b.sy - a.sy) * t
      };
    };

    const draw = (time = 0) => {
      const dt = Math.min(time - lastTime || 16, 50);
      lastTime = time;

      spin.x += (spinTarget.x - spin.x) * 0.03;
      spin.y += (spinTarget.y - spin.y) * 0.03;

      const rotY = time * 0.00009 + spin.x * 0.4;
      const rotX = -0.16 + spin.y * 0.22;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      neurons.forEach((neuron, index) => {
        const rx = neuron.pos.x * cosY - neuron.pos.z * sinY;
        const rz = neuron.pos.x * sinY + neuron.pos.z * cosY;
        const ry = neuron.pos.y * cosX - rz * sinX;
        const rz2 = neuron.pos.y * sinX + rz * cosX;

        const scale = 1.6 / (1.6 - rz2 * 0.5);
        neuron.sx = center.x + rx * radius * scale;
        neuron.sy = center.y + ry * radius * scale;
        neuron.depth = (rz2 + 1.3) / 2.6;
        neuron.scale = scale;

        neuron.excite *= 0.955;
        neuron.flash *= 0.9;

        if (neuron.fireAt !== 0 && time >= neuron.fireAt) {
          neuron.fireAt = 0;
          fire(index);
        }

        if (pointer.x >= 0) {
          const dx = neuron.sx - pointer.x;
          const dy = neuron.sy - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 110) {
            neuron.excite = Math.min(
              neuron.excite + (1 - distance / 110) * 0.09,
              1
            );
            if (random() < neuron.excite * 0.03) {
              const options = adjacency[index];
              if (options.length) {
                spawnPulse(options[Math.floor(random() * options.length)]);
              }
            }
          }
        }
      });

      if (time > ambientAt) {
        ambientAt = time + 900 + random() * 1600;
        const index = Math.floor(random() * neurons.length);
        neurons[index].flash = 0.8;
        adjacency[index].forEach((edgeIndex) => {
          if (random() > 0.4) spawnPulse(edgeIndex, index);
        });
      }

      context.clearRect(0, 0, width, height);

      edges.forEach((edge) => {
        edge.glow *= 0.94;
        const a = neurons[edge.a];
        const b = neurons[edge.b];
        const depth = (a.depth + b.depth) / 2;
        const energy = Math.max(a.flash, b.flash, edge.glow * 0.6);
        const alpha = Math.min(
          (0.05 + depth * 0.11) * (1 + energy * 2.4),
          0.62
        );
        const color =
          edge.kind === 'machine'
            ? rgba(CYAN, alpha)
            : edge.kind === 'organic'
              ? rgba(COPPER, alpha)
              : rgba(BONE, alpha * 0.8);

        context.beginPath();
        context.moveTo(a.sx, a.sy);
        if (edge.kind === 'machine') {
          context.lineTo(b.sx, a.sy);
          context.lineTo(b.sx, b.sy);
        } else if (edge.kind === 'organic') {
          context.quadraticCurveTo(
            (a.sx + b.sx) / 2 - (b.sy - a.sy) * edge.bow,
            (a.sy + b.sy) / 2 + (b.sx - a.sx) * edge.bow,
            b.sx,
            b.sy
          );
        } else {
          context.lineTo(b.sx, b.sy);
        }
        context.strokeStyle = color;
        context.lineWidth = 0.4 + depth * 0.7 + energy * 0.8;
        context.stroke();
      });

      const ordered = [...neurons].sort((l, r) => l.depth - r.depth);
      ordered.forEach((neuron) => {
        const breath = 1 + Math.sin(time * 0.0011 + neuron.phase) * 0.08;
        const size =
          (1.3 + neuron.size * 2.1) *
          neuron.scale *
          breath *
          (1 + neuron.excite * 0.9 + neuron.flash * 1.5);
        const energy = Math.max(neuron.excite, neuron.flash);
        const alpha = 0.28 + neuron.depth * 0.55 + energy * 0.4;
        const color = neuron.machine ? CYAN : COPPER;

        if (energy > 0.12 || neuron.depth > 0.72) {
          context.beginPath();
          context.arc(neuron.sx, neuron.sy, size * 2.8, 0, Math.PI * 2);
          context.fillStyle = rgba(color, 0.05 + energy * 0.16);
          context.fill();
        }

        if (neuron.machine) {
          const half = size;
          context.fillStyle = rgba(color, Math.min(alpha, 0.95));
          context.fillRect(neuron.sx - half, neuron.sy - half, half * 2, half * 2);
          if (energy > 0.35) {
            context.strokeStyle = rgba(BONE, energy * 0.8);
            context.lineWidth = 1;
            context.strokeRect(
              neuron.sx - half - 2,
              neuron.sy - half - 2,
              half * 2 + 4,
              half * 2 + 4
            );
          }
        } else {
          context.beginPath();
          context.arc(neuron.sx, neuron.sy, size, 0, Math.PI * 2);
          context.fillStyle = rgba(
            energy > 0.5 ? BONE : color,
            Math.min(alpha, 0.95)
          );
          context.fill();
        }
      });

      context.globalCompositeOperation = 'lighter';
      pulses = pulses.filter((pulse) => {
        pulse.t += pulse.speed * (dt / 16.7);
        if (pulse.t >= 1) return false;
        const edge = edges[pulse.edge];
        const t = pulse.dir === 1 ? pulse.t : 1 - pulse.t;
        const point = edgePoint(edge, t);
        const depth = (neurons[edge.a].depth + neurons[edge.b].depth) / 2;
        const color =
          edge.kind === 'machine'
            ? CYAN
            : edge.kind === 'organic'
              ? COPPER
              : BONE;

        context.beginPath();
        context.arc(point.x, point.y, 4.2, 0, Math.PI * 2);
        context.fillStyle = rgba(color, 0.1 + depth * 0.12);
        context.fill();

        context.beginPath();
        context.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        context.fillStyle = rgba(BONE, 0.35 + depth * 0.5);
        context.fill();
        return true;
      });

      bolts = bolts.filter((bolt) => {
        bolt.t += 0.045 * (dt / 16.7);
        const target = neurons[bolt.target];
        if (bolt.t >= 1) {
          if (bolt.cascade) scheduleCascade(bolt.target, time);
          else fire(bolt.target);
          return false;
        }
        const eased = bolt.t * bolt.t * (3 - 2 * bolt.t);
        const headX = bolt.sx + (target.sx - bolt.sx) * eased;
        const headY = bolt.sy + (target.sy - bolt.sy) * eased;
        const tail = Math.max(eased - 0.22, 0);
        const tailX = bolt.sx + (target.sx - bolt.sx) * tail;
        const tailY = bolt.sy + (target.sy - bolt.sy) * tail;

        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(headX, headY);
        context.strokeStyle = rgba(bolt.cascade ? CYAN : COPPER, 0.4);
        context.lineWidth = 1.2;
        context.stroke();

        context.beginPath();
        context.arc(headX, headY, 5, 0, Math.PI * 2);
        context.fillStyle = rgba(bolt.cascade ? CYAN : COPPER, 0.18);
        context.fill();

        context.beginPath();
        context.arc(headX, headY, 1.8, 0, Math.PI * 2);
        context.fillStyle = rgba(BONE, 0.9);
        context.fill();
        return true;
      });

      const corePulse = 1 + Math.sin(time * 0.0016) * 0.14;
      context.beginPath();
      context.arc(center.x, center.y, 3, 0, Math.PI * 2);
      context.fillStyle = rgba(BONE, 0.9);
      context.fill();

      context.beginPath();
      for (let i = 0; i <= 6; i += 1) {
        const angle = (Math.PI / 3) * i + time * 0.0004;
        const px = center.x + Math.cos(angle) * 15 * corePulse;
        const py = center.y + Math.sin(angle) * 15 * corePulse;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.strokeStyle = rgba(CYAN, 0.5);
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.arc(center.x, center.y, 26 * corePulse, 0, Math.PI * 2);
      context.strokeStyle = rgba(CYAN, 0.14);
      context.stroke();

      context.globalCompositeOperation = 'source-over';

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      spinTarget.x = (event.clientX / width - 0.5) * 2;
      spinTarget.y = (event.clientY / height - 0.5) * 2;
    };

    const handleLeave = () => {
      pointer.x = -1;
      pointer.y = -1;
      spinTarget.x = 0;
      spinTarget.y = 0;
    };

    const handleClick = (event: PointerEvent) => {
      if (window.scrollY > height * 0.8) return;
      if ((event.target as HTMLElement | null)?.closest('a, button')) return;
      cascade(event.clientX, event.clientY, lastTime);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    if (!reducedMotion) {
      window.addEventListener('pointermove', handlePointer);
      window.addEventListener('pointerdown', handleClick);
      window.addEventListener('neural-signal', handleSignal);
      document.documentElement.addEventListener('mouseleave', handleLeave);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerdown', handleClick);
      window.removeEventListener('neural-signal', handleSignal);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="neural-field" aria-hidden="true" />;
};

export default NeuralField;
