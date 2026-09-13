"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { downloadExportSnapshot, importSnapshotFromFile } from "@/lib/dataExport";
import type { ImportResult } from "@/lib/dataExport";

const IMPORT_ERROR_MESSAGES: Record<Exclude<ImportResult, { ok: true }>["reason"], string> = {
  "invalid-json": "Файл повреждён или не является JSON.",
  "invalid-format": "Файл не похож на экспорт VANTA — структура не совпадает.",
  "unsupported-version": "Файл создан более новой версией VANTA и не может быть загружен.",
};

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  function handleExportClick() {
    downloadExportSnapshot();
    setStatusMessage("Файл резервной копии скачан.");
  }

  function handleImportButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    setIsConfirmOpen(true);

    // Сбрасываем value, чтобы повторный выбор того же файла снова вызвал onChange
    event.target.value = "";
  }

  async function handleConfirmImport() {
    if (!pendingFile) return;

    setIsImporting(true);
    const result = await importSnapshotFromFile(pendingFile);
    setIsImporting(false);
    setIsConfirmOpen(false);
    setPendingFile(null);

    if (result.ok) {
      setStatusMessage("Данные успешно импортированы.");
    } else {
      setStatusMessage(IMPORT_ERROR_MESSAGES[result.reason]);
    }
  }

  function handleCancelImport() {
    setIsConfirmOpen(false);
    setPendingFile(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Система
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-vanta-text">Настройки</h1>
      </div>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-vanta-text-muted">Данные</p>

        <div className="flex flex-col gap-3 rounded-xl bg-vanta-surface-hover p-4">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-vanta-text-dim" strokeWidth={1.75} />
            <div className="flex-1">
              <p className="text-sm font-medium text-vanta-text">Экспорт данных</p>
              <p className="text-xs text-vanta-text-dim">
                Скачать задачи, привычки, воду, расходы и фокус-сессии в JSON-файл
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportClick}
            className="self-start rounded-md border border-vanta-accent px-3 py-2 text-sm text-vanta-accent transition-colors hover:bg-vanta-accent/10"
          >
            Скачать резервную копию
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-vanta-surface-hover p-4">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-vanta-text-dim" strokeWidth={1.75} />
            <div className="flex-1">
              <p className="text-sm font-medium text-vanta-text">Импорт данных</p>
              <p className="text-xs text-vanta-text-dim">
                Полностью заменяет текущие данные содержимым файла
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleImportButtonClick}
            className="self-start rounded-md border border-vanta-border px-3 py-2 text-sm text-vanta-text-muted transition-colors hover:border-vanta-accent hover:text-vanta-accent"
          >
            Выбрать файл
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>

        {statusMessage ? <p className="text-sm text-vanta-text-muted">{statusMessage}</p> : null}
      </section>

      <Modal
        isOpen={isConfirmOpen}
        onClose={handleCancelImport}
        title="Заменить текущие данные?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-vanta-text-muted">
            Это действие полностью перезапишет текущие задачи, привычки, воду, расходы и
            фокус-сессии содержимым выбранного файла. Отменить это будет нельзя.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelImport}
              disabled={isImporting}
              className="rounded-md border border-vanta-border px-3 py-2 text-sm text-vanta-text-muted transition-colors hover:text-vanta-text disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={isImporting}
              className="rounded-md border border-vanta-accent px-3 py-2 text-sm text-vanta-accent transition-colors hover:bg-vanta-accent/10 disabled:opacity-50"
            >
              {isImporting ? "Импорт..." : "Заменить данные"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}