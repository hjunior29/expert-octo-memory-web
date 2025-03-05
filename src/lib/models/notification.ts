export interface Notification {
    kind?: "success" | "error";
    title?: string;
    subtitle?: string;
    timeout?: number;
    caption?: string;
}