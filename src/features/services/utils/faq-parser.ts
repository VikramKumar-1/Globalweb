import { replaceLocation } from '@/lib/replaceLocation';

export interface FAQItem {
  question: string;
  answer: string;
}

export function parseFaqs(content: string, locationName: string = ""): { faqs: FAQItem[], cleanedContent: string } {
  let faqs: FAQItem[] = [];
  let cleanedContent = content ?? '';

  if (cleanedContent) {
    const match = cleanedContent.match(/<!-- FAQ_DATA: (.*?) -->/);
    if (match) {
      try {
        const rawFaqs = JSON.parse(match[1]);
        if (Array.isArray(rawFaqs)) {
          faqs = rawFaqs
            .map((f: any) => ({
              question: replaceLocation(f.question || '', locationName),
              answer: replaceLocation(f.answer || '', locationName),
            }))
            .filter((f) => f.question.trim() !== '' && f.answer.trim() !== '');
        }
        cleanedContent = cleanedContent.replace(match[0], '');
      } catch (e) {
        console.error("Failed to parse FAQ data", e);
      }
    }
  }

  return { faqs, cleanedContent };
}
