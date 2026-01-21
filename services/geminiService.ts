
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStudentNarrative(studentName: string, keywords: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan narasi perkembangan untuk siswa bernama ${studentName} berdasarkan poin-poin berikut: ${keywords}. Gunakan bahasa formal pendidikan Indonesia untuk raport atau buku bimbingan.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating narrative:", error);
    return "Gagal menghasilkan narasi otomatis.";
  }
}

export async function generateDocumentContent(templateId: string, context: any) {
    // This could be expanded to use AI for more complex templates
    // For now, it acts as a structured content generator
    return ""; 
}
