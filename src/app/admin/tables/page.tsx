"use client";

import { useState, useCallback, useEffect } from "react";
import { QrCode, Download, RefreshCw, Plus, Trash2 } from "lucide-react";
import QRCode from "qrcode";
import { generateTableSession, getTableSessions } from "@/lib/tableSessionService";
import type { TableSession } from "@/types";

// Types 

interface TableEntry {
    tableId: number;
    customerName: string;
    session: TableSession | null;
    isLoading: boolean;
    error: string | null;
    canvasDataUrl: string | null;
}

async function renderQRToDataUrl(text: string): Promise<string> {
    return QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: { dark: "#8C6D56", light: "#FAF7F2" },
        errorCorrectionLevel: "H",
    });
}

// Component: QRCard 

function QRCard({ entry, onGenerate, onRemove }: { 
    entry: TableEntry; 
    onGenerate: (id: number, name: string) => void;
    onRemove: (id: number) => void;
}) {
    const handleDownload = () => {
        if (!entry.canvasDataUrl) return;
        const link = document.createElement("a");
        link.href = entry.canvasDataUrl;
        link.download = `QR-Meja-${entry.tableId}-${entry.customerName}.png`;
        link.click();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
            <div className="bg-primary-20 px-5 py-3 flex items-center justify-between text-white">
                <span className="font-bold text-sm tracking-widest">TABLE {entry.tableId}</span>
                <button onClick={() => onRemove(entry.tableId)} className="opacity-60 hover:opacity-100 transition-opacity">
                    <Trash2 size={14}/>
                </button>
            </div>
            
            <div className="p-6 flex flex-col items-center gap-4 flex-1">
                {entry.isLoading ? (
                    <div className="w-40 h-40 bg-stone-100 animate-pulse rounded-xl" />
                ) : entry.canvasDataUrl ? (
                    <img src={entry.canvasDataUrl} alt="QR" className="w-40 h-40 rounded-xl" />
                ) : (
                    <div className="w-40 h-40 bg-stone-50 border-2 border-dashed border-stone-100 rounded-xl flex items-center justify-center text-stone-200">
                        <QrCode size={48} />
                    </div>
                )}
                
                <div className="text-center w-full px-2">
                    <p className="font-bold text-stone-800 uppercase tracking-tight mb-1">
                        {entry.customerName || "No Name"}
                    </p>
                    
                    {/* Tampilkan URL di sini agar bisa diklik untuk testing */}
                    {entry.session?.qrUrl ? (
                        <a 
                            href={entry.session.qrUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[9px] text-blue-500 hover:text-blue-700 underline break-all leading-relaxed block"
                            title="Klik untuk membuka menu meja ini"
                        >
                            {entry.session.qrUrl}
                        </a>
                    ) : (
                        <p className="text-[10px] text-stone-400 mt-1">No Active Session</p>
                    )}
                </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex gap-2">
                <button 
                    onClick={() => onGenerate(entry.tableId, entry.customerName)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#8C6D56] text-[#8C6D56] rounded-xl text-xs font-bold hover:bg-[#8C6D56]/5 transition-all"
                >
                    <RefreshCw size={14} className={entry.isLoading ? "animate-spin" : ""} /> REGENERATE
                </button>
                {entry.canvasDataUrl && (
                    <button onClick={handleDownload} className="px-4 py-2.5 bg-primary-20 text-white rounded-xl hover:bg-[#8C6D56]/90 shadow-md shadow-[#8C6D56]/20 transition-all">
                        <Download size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

// Page Component 

export default function TableManagementPage() {
    const [tables, setTables] = useState<TableEntry[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string>("");
    const [customerName, setCustomerName] = useState("");
    const [isFetching, setIsFetching] = useState(true);

    const [validTables, setValidTables] = useState<{id: number, number: number}[]>([]);

    const loadSessions = useCallback(async () => {
        setIsFetching(true);
        try {            
            const [masterTables, sessions] = await Promise.all([
                import('@/lib/tableSessionService').then(m => m.getMasterTables()),
                getTableSessions()
            ]);

            setValidTables(masterTables); 

            const uniqueSessionsMap = new Map<number, TableSession>();

            sessions.forEach(s => {
                if (s.tableId && (s as any).isActive) {
                    uniqueSessionsMap.set(s.tableId, s);
                }
            });

            const activeSessions = Array.from(uniqueSessionsMap.values());

            const tableEntries: TableEntry[] = await Promise.all(activeSessions.map(async (s) => ({
                tableId: s.tableId,
                customerName: (s as any).customerName || "Customer",
                session: s,
                isLoading: false,
                error: null,
                canvasDataUrl: await renderQRToDataUrl(s.qrUrl)
            })));
            
            setTables(tableEntries);
        } catch (err: any) {
            console.error("Failed to load data", err);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => { loadSessions(); }, [loadSessions]);

    const handleGenerate = async (id: number, name: string) => {
        if (!id) return alert("Error: ID Meja tidak valid dari database!"); 
        if (!name) return alert("Nama pelanggan harus diisi!");
        
        setTables(prev => prev.map(t => t.tableId === id ? { ...t, isLoading: true } : t));
        
        try {
            const session = await generateTableSession(id, name);
            const qr = await renderQRToDataUrl(session.qrUrl);
            setTables(prev => prev.map(t => t.tableId === id ? { 
                ...t, session, canvasDataUrl: qr, isLoading: false, customerName: name 
            } : t));
        } catch (err: any) {
            console.error("Generate error:", err);
            const errorMsg = err.response?.data?.message || err.message || "Unknown error";
            alert(`Gagal generate QR Meja ${id}:\n\n${errorMsg}`);
            
            setTables(prev => prev.map(t => t.tableId === id ? { ...t, isLoading: false } : t));
        }
    };

    const handleAddTable = () => {
        const id = parseInt(selectedTableId);
        if (!id || !customerName) return alert("Pilih nomor meja dan isi nama!");
        if (tables.find(t => t.tableId === id)) return alert("Meja sudah aktif!");

        const newEntry: TableEntry = {
            tableId: id,
            customerName: customerName,
            session: null,
            isLoading: false,
            error: null,
            canvasDataUrl: null
        };
        
        setTables(prev => [...prev, newEntry]);
        handleGenerate(id, customerName);
        setCustomerName("");
        setSelectedTableId("");
    };

    return (
        <div className="p-6 sm:p-10 space-y-10 w-full max-w-6xl mx-auto">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-stone-800">Generate QR Table</h1>
                <p className="text-sm text-stone-500">Kelola sesi aktif dan cetak QR Code untuk pelanggan di meja.</p>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                    <label className="text-[10px] font-bold text-stone-400 tracking-widest">PILIH NOMOR MEJA</label>
                    <select 
                        value={selectedTableId}
                        onChange={(e) => setSelectedTableId(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8C6D56]/20 outline-none"
                    >
                        <option value="">Pilih Nomor Meja...</option>
                        {/* Loop dropdown menggunakan data meja yang valid dari backend */}
                        {validTables.map((table) => (
                            <option key={table.id} value={table.id}>
                                Meja {table.number}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-[2] space-y-2 w-full">
                    <label className="text-[10px] font-bold text-stone-400 tracking-widest">NAMA PELANGGAN</label>
                    <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Masukkan nama untuk sesi ini..."
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8C6D56]/20 outline-none"
                    />
                </div>
                <button 
                    onClick={handleAddTable}
                    className="bg-primary-20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#8C6D56]/90 transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#8C6D56]/20"
                >
                    <Plus size={18} /> TAMBAH MEJA
                </button>
            </div>

            {/* Grid */}
            {isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none">
                    {[1,2,3].map(i => <div key={i} className="h-80 bg-stone-100 animate-pulse rounded-2xl" />)}
                </div>
            ) : tables.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-primary-20 border-2 border-dashed border-stone-100 rounded-3xl">
                    <QrCode size={64} strokeWidth={1} />
                    <p className="mt-4 font-medium">Belum ada meja aktif. Silakan tambah di atas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tables.sort((a, b) => a.tableId - b.tableId).map((entry) => (
                        <QRCard 
                            key={entry.tableId} 
                            entry={entry} 
                            onGenerate={handleGenerate}
                            onRemove={(id) => setTables(prev => prev.filter(t => t.tableId !== id))}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}