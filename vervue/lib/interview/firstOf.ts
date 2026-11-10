// Supabase returns a single object instead of a list when the link is one-to-one
export function firstOf<T>(value: T | T[] | null | undefined): T | undefined {
    if (Array.isArray(value)) return value[0];
    return value ?? undefined;
}