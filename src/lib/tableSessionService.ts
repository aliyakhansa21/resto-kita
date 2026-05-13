import api from "@/lib/api";
import type { ApiTableSessionResponse, TableSession } from "@/types";


export async function getMasterTables(): Promise<{ id: number; number: number }[]> {
    try {
        const { data } = await api.get<{ data: { id: number; number: number }[] }>("/admin/tables");
        return data.data;
    } catch (error) {
        console.warn("Gagal mengambil master meja (mungkin endpoint belum ada), menggunakan data dummy sementara.");
        return Array.from({ length: 10 }, (_, i) => ({ id: i + 1, number: i + 1 }));
    }
}


export async function getTableSessions(): Promise<TableSession[]> {
    let allData: any[] = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
        const { data } = await api.get(`/admin/table-sessions?page=${currentPage}`);
        allData = [...allData, ...data.data];
        lastPage = data.meta.last_page;
        currentPage++;
    } while (currentPage <= lastPage);
    
    const baseUrl = typeof window !== "undefined"
            ? window.location.origin
            : "";

    return allData.map(item => {
        const resolvedTableId = item.table?.number || item.table?.id || item.table_id;

        return {
            token: item.token,
            tableId: resolvedTableId, 
            seatedAt: item.seated_at,
            customerName: item.customer_name,
            qrUrl: `${baseUrl}/?token=${item.token}&table=${resolvedTableId}`,
            isActive: item.is_active === true || item.status === 'active'
        };
    });
}

export async function generateTableSession(tableId: number, customerName: string): Promise<TableSession> {
    const { data } = await api.post<ApiTableSessionResponse>(
        "/admin/table-sessions/generate",
        { 
            table_id: tableId,
            customer_name: customerName
        }
    );

    const baseUrl = typeof window !== "undefined"
            ? window.location.origin
            : "";

    return {
        token: data.data.token,
        tableId: data.data.table_id,
        seatedAt: data.data.seated_at,
        qrUrl: `${baseUrl}/?token=${data.data.token}&table=${data.data.table_id}`,
    };
}