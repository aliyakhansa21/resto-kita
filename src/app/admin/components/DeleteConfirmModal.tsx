import { X, AlertTriangle } from "lucide-react";

interface Props {
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmModal({ itemName, onConfirm, onCancel }: Props) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-stone-50 border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="px-6 pt-8 pb-5 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-50 border-2 border-red-100 text-red-600">
                        <AlertTriangle size={30} />
                    </div>

                    <h2 className="text-xl font-bold text-stone-900">
                        Hapus Karyawan?
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                        Apakah Anda yakin ingin menghapus karyawan <span className="font-bold text-stone-800">“{itemName}”</span>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>

                <div className="mx-6 h-px bg-stone-200" />

                <div className="px-6 py-5 flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200 active:scale-95 shadow-sm"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}