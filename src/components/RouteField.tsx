'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };

type Route = {
  startX: number;
  startY: number;
  bendX: number;
  bendY: number;
  endOffsetX: number;
  endOffsetY: number;
  phase: number;
  speed: number;
  alpha: number;
};

const RouteField = () => {
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
    let routes: Route[] = [];
    let focus: Point = { x: width * 0.72, y: height * 0.43 };
    let target: Point = { ...focus };

    const random = (() => {
      let seed = 1847;
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    })();

    const createRoutes = () => {
      routes = Array.from({ length: width < 700 ? 24 : 42 }, (_, index) => {
        const fromTop = index % 3 === 0;
        return {
          startX: fromTop ? random() * width : random() * width * 0.35,
          startY: fromTop ? -40 : random() * height,
          bendX: width * (0.3 + random() * 0.35),
          bendY: height * (0.08 + random() * 0.84),
          endOffsetX: (random() - 0.5) * width * 0.2,
          endOffsetY: (random() - 0.5) * height * 0.36,
          phase: random(),
          speed: 0.000015 + random() * 0.000025,
          alpha: 0.05 + random() * 0.13
        };
      });
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
      focus = { x: width * 0.72, y: height * 0.43 };
      target = { ...focus };
      createRoutes();
    };

    const cubicPoint = (
      start: Point,
      controlOne: Point,
      controlTwo: Point,
      end: Point,
      progress: number
    ) => {
      const inverse = 1 - progress;
      return {
        x:
          inverse ** 3 * start.x +
          3 * inverse ** 2 * progress * controlOne.x +
          3 * inverse * progress ** 2 * controlTwo.x +
          progress ** 3 * end.x,
        y:
          inverse ** 3 * start.y +
          3 * inverse ** 2 * progress * controlOne.y +
          3 * inverse * progress ** 2 * controlTwo.y +
          progress ** 3 * end.y
      };
    };

    const draw = (time = 0) => {
      focus.x += (target.x - focus.x) * 0.035;
      focus.y += (target.y - focus.y) * 0.035;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      routes.forEach((route, index) => {
        const start = { x: route.startX, y: route.startY };
        const end = {
          x: focus.x + route.endOffsetX,
          y: focus.y + route.endOffsetY
        };
        const controlOne = { x: route.bendX, y: route.bendY };
        const controlTwo = {
          x: focus.x - width * (0.08 + (index % 5) * 0.012),
          y: end.y + Math.sin(index * 1.7) * height * 0.12
        };

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.bezierCurveTo(
          controlOne.x,
          controlOne.y,
          controlTwo.x,
          controlTwo.y,
          end.x,
          end.y
        );
        context.strokeStyle = `rgba(216, 164, 109, ${route.alpha})`;
        context.lineWidth = index % 7 === 0 ? 0.9 : 0.45;
        context.stroke();

        const progress = reducedMotion
          ? route.phase
          : (route.phase + time * route.speed) % 1;
        const waypoint = cubicPoint(
          start,
          controlOne,
          controlTwo,
          end,
          progress
        );
        context.beginPath();
        context.arc(
          waypoint.x,
          waypoint.y,
          index % 5 === 0 ? 1.8 : 1,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(246, 240, 229, ${0.25 + route.alpha * 2})`;
        context.fill();
      });

      context.beginPath();
      context.arc(focus.x, focus.y, 26, 0, Math.PI * 2);
      context.strokeStyle = 'rgba(216, 164, 109, 0.28)';
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.arc(focus.x, focus.y, 3.5, 0, Math.PI * 2);
      context.fillStyle = 'rgba(246, 240, 229, 0.85)';
      context.fill();

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      target = { x: event.clientX, y: event.clientY };
    };

    const handleLeave = () => {
      target = { x: width * 0.72, y: height * 0.43 };
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointer);
    document.documentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointer);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="route-field" aria-hidden="true" />;
};

export default RouteField;
