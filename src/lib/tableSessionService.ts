import api from "@/lib/api";
import type { ApiTableSessionResponse, TableSession } from "@/types";

// Generate token table session baru dari backend
// POST /api/table-sessions/generate

export async function generateTableSession(tableId: number, customerName: string): Promise<TableSession> {
    const { data } = await api.post<ApiTableSessionResponse>(
        "/admin/table-sessions/generate",
        { 
            table_id: tableId,
            customer_name: customerName
        }
    );

    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_BASE_URL ?? "";

    return {
        token: data.data.token,
        tableId: data.data.table_id,
        seatedAt: data.data.seated_at,
        qrUrl: `${baseUrl}/menu?token=${data.data.token}&table=${data.data.table_id}`,
    };
}