import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Flashcard } from '$lib/models/flashcard';
import type { Topic } from './models/topic';

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
        else if (label === 'shared') label = 'Compartilhados';
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

export const getSharedUrl = (sharedId: string): string => {
    const url = new URL(window.location.href);
    return `${url.origin}/shared/${sharedId}`;
};

export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

function wrapText(font: any, text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
}

export async function generateFlashcardsPDF(flashcards: Flashcard[], topic: Topic): Promise<string> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 400;
    const pageHeight = 300;

    const margin = 20;
    const fontSizeTitle = 20;
    const fontSizeText = 14;
    const lineHeight = 18;

    const coverPage = pdfDoc.addPage([pageWidth, pageHeight]);
    coverPage.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(0.11, 0.14, 0.2),
    });

    const topicTitle = topic.name ?? 'Tópico';
    const topicTitleWidth = font.widthOfTextAtSize(topicTitle, fontSizeTitle);
    coverPage.drawText(topicTitle, {
        x: (pageWidth - topicTitleWidth) / 2,
        y: pageHeight - margin - 30,
        size: fontSizeTitle,
        font,
        color: rgb(1, 1, 1),
    });

    const topicDescription = topic.description?.toString() ?? '';
    const descLines = wrapText(font, topicDescription, pageWidth - margin * 2, fontSizeText);
    descLines.forEach((line, i) => {
        const textWidth = font.widthOfTextAtSize(line, fontSizeText);
        coverPage.drawText(line, {
            x: (pageWidth - textWidth) / 2,
            y: pageHeight / 2 - i * lineHeight,
            size: fontSizeText,
            font,
            color: rgb(1, 1, 1),
        });
    });

    for (const card of flashcards) {
        const questionPage = pdfDoc.addPage([pageWidth, pageHeight]);

        questionPage.drawRectangle({
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
            color: rgb(0.11, 0.14, 0.2),
        });

        const title = card.title ?? '';
        const titleWidth = font.widthOfTextAtSize(title, fontSizeTitle);
        questionPage.drawText(title, {
            x: (pageWidth - titleWidth) / 2,
            y: pageHeight - margin - 30,
            size: fontSizeTitle,
            font,
            color: rgb(1, 1, 1),
        });

        const questionLines = wrapText(font, card.question ?? '', pageWidth - margin * 2, fontSizeText);
        questionLines.forEach((line, i) => {
            const textWidth = font.widthOfTextAtSize(line, fontSizeText);
            questionPage.drawText(line, {
                x: (pageWidth - textWidth) / 2,
                y: pageHeight / 2 - i * lineHeight,
                size: fontSizeText,
                font,
                color: rgb(1, 1, 1),
            });
        });

        const answerPage = pdfDoc.addPage([pageWidth, pageHeight]);

        answerPage.drawRectangle({
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
            color: rgb(0.38, 0.58, 0.42),
        });

        const answerTitle = 'Resposta';
        const answerTitleWidth = font.widthOfTextAtSize(answerTitle, fontSizeTitle);
        answerPage.drawText(answerTitle, {
            x: (pageWidth - answerTitleWidth) / 2,
            y: pageHeight - margin - 30,
            size: fontSizeTitle,
            font,
            color: rgb(1, 1, 1),
        });

        const answerLines = wrapText(font, card.answer ?? '', pageWidth - margin * 2, fontSizeText);
        answerLines.forEach((line, i) => {
            const textWidth = font.widthOfTextAtSize(line, fontSizeText);
            answerPage.drawText(line, {
                x: (pageWidth - textWidth) / 2,
                y: pageHeight / 2 - i * lineHeight,
                size: fontSizeText,
                font,
                color: rgb(1, 1, 1),
            });
        });
    }

    try {
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error(error);
        return '';
    }
}
