export function formatDatetimeLocal(value: string | Date | null | undefined, format: string = 'yyyy-MM-dd', timezone?: string): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) {
        console.warn(`[formatDatetimeLocal] Invalid date value:`, value, '- returning empty string.');
        return '';
    }

    if (timezone) {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(date);
    }

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
