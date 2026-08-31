import { useCallback, useState } from "react";

/**
 * Инкапсулирует паттерн "два тапа удаления": первый клик переводит
 * компонент в состояние подтверждения, второй клик по той же кнопке
 * вызывает переданный onConfirm. Использовать вместо ручного
 * useState(false) + функции-обработчика в каждом месте отдельно —
 * раньше эта логика была продублирована дословно в ExpenseRow.tsx,
 * TaskFormModal.tsx и HabitFormModal.tsx (см. аудит M1).
 *
 * Разметка/стили кнопки остаются на усмотрение каждого компонента —
 * хук отдаёт только состояние и обработчик клика, ничего не рендерит.
 */
export function useConfirmDelete(onConfirm: () => void) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = useCallback(() => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    onConfirm();
  }, [isConfirming, onConfirm]);

  const reset = useCallback(() => setIsConfirming(false), []);

  return { isConfirming, handleClick, reset };
}