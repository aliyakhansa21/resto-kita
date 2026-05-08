"use client";

import { useState, useCallback } from "react";
import { QrCode, Download, RefreshCw, Plus, Trash2, Utensils } from "lucide-react";
import QRCode from "qrcode";
import { generateTableSession } from "@/lib/tableSessionService";
import type { TableSession } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TableEntry {
    tableId: number;
    customerName: string; // Tambahan untuk menyimpan input nama
    session: TableSession | null;
    isLoading: boolean;
    error: string | null;
    canvasDataUrl: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function renderQRToDataUrl(text: string): Promise<string> {
    return QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
            dark:  "#292524", // stone-800
            light: "#FAF7F2",
        },
        errorCorrectionLevel: "H",
    });
}

// ─── QRCard ───────────────────────────────────────────────────────────────────

function QRCard({
    entry,
    onGenerate,
    onRemove,
    onNameChange,
}: {
    entry: TableEntry;
    onGenerate: (tableId: number, name: string) => void;
    onRemove: (tableId: number) => void;
    onNameChange: (tableId: number, name: string) => void;
}) {
    const handleDownload = () => {
        if (!entry.canvasDataUrl || !entry.session) return;
        const link = document.createElement("a");
        link.href = entry.canvasDataUrl;
        link.download = `qr-table-${entry.tableId}-${entry.customerName || 'customer'}.png`;
        link.click();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#8C6D56] px-5 py-3 flex items-center justify-between">
                <span className="text-white font-bold tracking-wide text-sm">
                    TABLE {entry.tableId}
                </span>
                <button
                    onClick={() => onRemove(entry.tableId)}
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label="Remove table"
                >
                    <Trash2 size={15} />
                </button>
            </div>

            {/* QR Image */}
            <div className="flex flex-col items-center justify-center p-6 gap-4 flex-1">
                {entry.isLoading ? (
                    <div className="w-[150px] h-[150px] rounded-xl bg-stone-100 animate-pulse" />
                ) : entry.canvasDataUrl ? (
                    <img
                        src={entry.canvasDataUrl}
                        alt={`QR Table ${entry.tableId}`}
                        className="w-[150px] h-[150px] rounded-xl"
                    />
                ) : (
                    <div className="w-[150px] h-[150px] rounded-xl bg-stone-100 flex items-center justify-center">
                        <QrCode size={40} className="text-stone-300" />
                    </div>
                )}

                {entry.error && (
                    <p className="text-red-500 text-[10px] text-center font-medium leading-tight">
                        {entry.error}
                    </p>
                )}

                {entry.session && (
                    <div className="text-center">
                         <p className="text-[11px] font-bold text-stone-700">{entry.customerName}</p>
                         <p className="text-[9px] text-stone-400 break-all leading-relaxed px-2">
                            {entry.session.qrUrl}
                        </p>
                    </div>
                )}
            </div>

            {/* Input Nama Pelanggan */}
            <div className="px-4 pb-3">
                <input
                    type="text"
                    placeholder="Nama Pelanggan..."
                    value={entry.customerName}
                    onChange={(e) => onNameChange(entry.tableId, e.target.value)}
                    disabled={!!entry.session || entry.isLoading}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-stone-50 disabled:bg-stone-100 disabled:text-stone-400 transition-all"
                />
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
                <button
                    onClick={() => onGenerate(entry.tableId, entry.customerName)}
                    disabled={entry.isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-[#8C6D56] text-[#8C6D56] text-sm font-medium hover:bg-[#8C6D56]/5 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={entry.isLoading ? "animate-spin" : ""} />
                    {entry.session ? "Regenerate" : "Generate"}
                </button>

                {entry.canvasDataUrl && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#8C6D56] text-white text-sm font-medium hover:bg-[#8C6D56]/90 transition-colors"
                    >
                        <Download size={14} />
                        PNG
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TableManagementPage() {
    const [tables, setTables] = useState<TableEntry[]>([
        { tableId: 1, customerName: "", session: null, isLoading: false, error: null, canvasDataUrl: null },
        { tableId: 2, customerName: "", session: null, isLoading: false, error: null, canvasDataUrl: null },
        { tableId: 3, customerName: "", session: null, isLoading: false, error: null, canvasDataUrl: null },
    ]);
    const [newTableId, setNewTableId] = useState("");
    const [addError, setAddError]     = useState("");

    // Update state nama saat Admin mengetik
    const handleNameChange = (tableId: number, name: string) => {
        setTables((prev) =>
            prev.map((t) =>
                t.tableId === tableId ? { ...t, customerName: name, error: null } : t
            )
        );
    };

    // Generate session for one table
    const handleGenerate = useCallback(async (tableId: number, customerName: string) => {
        if (!customerName.trim()) {
            setTables((prev) =>
                prev.map((t) =>
                    t.tableId === tableId ? { ...t, error: "Nama pelanggan wajib diisi" } : t
                )
            );
            return;
        }

        setTables((prev) =>
            prev.map((t) =>
                t.tableId === tableId ? { ...t, isLoading: true, error: null } : t
            )
        );

        try {
            const session       = await generateTableSession(tableId, customerName);
            const canvasDataUrl = await renderQRToDataUrl(session.qrUrl);

            setTables((prev) =>
                prev.map((t) =>
                    t.tableId === tableId
                        ? { ...t, session, canvasDataUrl, isLoading: false }
                        : t
                )
            );
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Gagal generate session";
            setTables((prev) =>
                prev.map((t) =>
                    t.tableId === tableId
                        ? { ...t, error: message, isLoading: false }
                        : t
                )
            );
        }
    }, []);

    // Generate ALL yang sudah ada namanya
    const handleGenerateAll = useCallback(async () => {
        const targetTables = tables.filter(t => t.customerName.trim() && !t.session);
        for (const table of targetTables) {
            await handleGenerate(table.tableId, table.customerName);
        }
    }, [tables, handleGenerate]);

    const handleAddTable = () => {
        const id = parseInt(newTableId, 10);
        if (isNaN(id) || id <= 0) {
            setAddError("Masukkan nomor meja yang valid");
            return;
        }
        if (tables.some((t) => t.tableId === id)) {
            setAddError(`Meja ${id} sudah ada`);
            return;
        }
        setTables((prev) => [
            ...prev,
            { tableId: id, customerName: "", session: null, isLoading: false, error: null, canvasDataUrl: null },
        ]);
        setNewTableId("");
        setAddError("");
    };

    const handleRemove = (tableId: number) => {
        setTables((prev) => prev.filter((t) => t.tableId !== tableId));
    };

    const handleDownloadAll = async () => {
        const generated = tables.filter((t) => t.canvasDataUrl && t.session);
        for (const t of generated) {
            const link = document.createElement("a");
            link.href = t.canvasDataUrl!;
            link.download = `qr-table-${t.tableId}-${t.customerName}.png`;
            link.click();
            await new Promise((r) => setTimeout(r, 300));
        }
    };

    const generatedCount = tables.filter((t) => t.canvasDataUrl).length;

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            {/* Header */}
            <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#8C6D56] text-white">
                    <Utensils size={16} />
                </span>
                <div>
                    <h1 className="font-bold text-stone-800 text-lg leading-none">
                        Table Sessions
                    </h1>
                    <p className="text-xs text-stone-400 mt-0.5">
                        Generate & download QR code untuk setiap meja
                    </p>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={1}
                                value={newTableId}
                                onChange={(e) => { setNewTableId(e.target.value); setAddError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && handleAddTable()}
                                placeholder="Nomor meja baru..."
                                className="w-44 px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D56]/30 bg-white"
                            />
                            <button
                                onClick={handleAddTable}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C6D56] text-white text-sm font-medium hover:bg-[#8C6D56]/90 transition-colors"
                            >
                                <Plus size={15} /> Tambah
                            </button>
                        </div>
                        {addError && <p className="text-red-500 text-xs">{addError}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleGenerateAll}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#8C6D56] text-[#8C6D56] text-sm font-medium hover:bg-[#8C6D56]/5 transition-colors"
                        >
                            <RefreshCw size={14} />
                            Generate Semua
                        </button>
                        {generatedCount > 0 && (
                            <button
                                onClick={handleDownloadAll}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8C6D56] text-white text-sm font-medium hover:bg-[#8C6D56]/90 transition-colors"
                            >
                                <Download size={14} />
                                Download Semua ({generatedCount})
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid */}
                {tables.length === 0 ? (
                    <div className="text-center py-24 text-stone-400">
                        <QrCode size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Belum ada meja. Tambah nomor meja dulu.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tables
                            .sort((a, b) => a.tableId - b.tableId)
                            .map((entry) => (
                                <QRCard
                                    key={entry.tableId}
                                    entry={entry}
                                    onGenerate={handleGenerate}
                                    onRemove={handleRemove}
                                    onNameChange={handleNameChange}
                                />
                            ))}
                    </div>
                )}

                <p className="text-center text-xs text-stone-400 mt-10">
                    QR code berisi link menu dengan session token meja.
                    Token bersifat sementara — regenerate jika sesi berakhir.
                </p>
            </div>
        </div>
    );
}