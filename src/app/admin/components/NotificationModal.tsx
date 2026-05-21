import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function NotificationModal({
    type = "success",
    title,
    message,
    onClose,
}: {
    type?: "success" | "error";
    title: string;
    message: string;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-stone-50 border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="px-6 pt-8 pb-5 flex flex-col items-center text-center">
                    {type === "success" ? (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-100 border-2 border-green-200">
                            <CheckCircle2 size={30} className="text-green-600" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100 border-2 border-red-200">
                            <AlertCircle size={30} className="text-red-600" />
                        </div>
                    )}
                    <h2 className="text-xl font-bold text-stone-900">{title}</h2>
                    <p className="mt-2 text-sm text-stone-500 whitespace-pre-line">{message}</p>
                </div>
                <div className="mx-6 h-px bg-stone-200" />
                <div className="px-6 py-5 flex justify-center">
                    <button
                        onClick={onClose}
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 active:scale-95 shadow-sm ${
                            type === "success" ? "bg-[#4A5D23] hover:bg-[#3a491c]" : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
}