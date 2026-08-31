"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Плавно анимирует числовое значение от предыдущего к новому за
 * durationMs через requestAnimationFrame с ease-out квадратичным
 * смягчением. Используется везде, где число должно "подкручиваться",
 * а не скакать резко (счётчик воды, Daily Score и т.д.) — единая
 * физика анимации по всему приложению.
 *
 * startFromZero=true заставляет самую первую анимацию (при монтировании
 * компонента) стартовать с 0, а не с текущего target — используется для
 * эффекта "накрутки" счётчика при первом появлении (например Daily
 * Score). По умолчанию false: первое значение отображается мгновенно,
 * анимация срабатывает только на последующие изменения target (как
 * нужно для счётчика воды — не тормозить взаимодействие).
 */
export function useAnimatedValue(
  target: number,
  durationMs: number,
  startFromZero = false,
): number {
  const [displayValue, setDisplayValue] = useState(startFromZero ? 0 : target);
  const frameRef = useRef<number | null>(null);
  const fromRef = useRef(startFromZero ? 0 : target);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;

    if (from === to) return;

    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = from + (to - from) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    }

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return displayValue;
}