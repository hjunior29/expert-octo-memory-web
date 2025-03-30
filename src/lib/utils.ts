type BreadcrumbPath = {
    label: string;
    href: string;
    isCurrent: boolean;
};

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Error reading file"));
    });
}

export function generateBreadcrumbPaths(pathname: string): BreadcrumbPath[] {
    const segments = pathname.split('/').filter(Boolean);
    const paths: BreadcrumbPath[] = [];

    paths.push({
        label: '',
        href: '/',
        isCurrent: segments.length === 0,
    });

    let currentPath = '';
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        let label = segment;
        if (label === 'folder') label = 'Pastas';
        else if (label === 'topic') label = 'Tópicos';
        else label = decodeURIComponent(label.replace(/-/g, ' '));

        paths.push({
            label,
            href: currentPath,
            isCurrent: index === segments.length - 1,
        });
    });

    return paths;
}

export const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");

    return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})/, "$1-$2")
        .substring(0, 15);
};