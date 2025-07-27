export function formatDatetimeLocal(value: string | Date | null | undefined, format: string = 'yyyy-MM-dd'): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '';

    const pad = (n: number) => n.toString().padStart(2, '0');

    const map: Record<string, string> = {
        yyyy: date.getFullYear().toString(),
        MM: pad(date.getMonth() + 1),
        dd: pad(date.getDate()),
        HH: pad(date.getHours()),
        mm: pad(date.getMinutes()),
        ss: pad(date.getSeconds()),
    };

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (token) => map[token]);
}
