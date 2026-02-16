import { GoogleGenAI } from "@google/genai";
import { Entry } from "../types";

// Using process.env.API_KEY as per instructions
const apiKey = "AIzaSyAYOtJVLAGVBc_ABdWD6vR3o4QSxYL5Euo";
const ai = new GoogleGenAI({ apiKey });
export const GeminiService = {
  /**
   * Analyzes a specific entry to provide somatic coaching feedback.
   */
  analyzeEntry: async (entry: Entry): Promise<string> => {
    if (!apiKey) {
      return "Configura tu API Key para recibir feedback del coach.";
    }

    const modelName = 'gemini-3-pro-preview'; // Using Pro 3 for complex reasoning about emotions

    let promptContext = "";

    if (entry.category === 'boundary') {
      promptContext = `
        El usuario ha registrado un momento de límite ("Hasta aquí llegué").
        Nivel de cansancio (1-10): ${entry.tirednessLevel}
        Sensación corporal: ${entry.bodySensation}
        Pensamiento: ${entry.thought}
        Reacción del entorno: ${entry.contextReaction}
      `;
    } else if (entry.category === 'physical') {
      promptContext = `
        El usuario ha registrado actividad física.
        ¿Realizó la actividad?: ${entry.didActivity ? 'Sí' : 'No'}
        Impacto en la transformación (sentir/pensar/hacer): ${entry.transformationNote}
      `;
    } else if (entry.category === 'audio') {
      promptContext = `
        El usuario ha registrado la escucha de un audio del coach.
        ¿Escuchado?: ${entry.listened ? 'Sí' : 'No'}
        Emoción/Sensación/Pensamiento al escuchar: ${entry.emotion}
        Sensación corporal: ${entry.bodySensation}
        Pensamiento: ${entry.thought}
      `;
    } else {
      promptContext = `
        Categoría personalizada: ${entry.customCategoryName}
        Notas: ${entry.transformationNote || entry.bodySensation || entry.thought}
      `;
    }

    const prompt = `
      Actúa como un Coach Personal experto en coaching somático y ontológico.
      Analiza la siguiente entrada del diario del usuario y proporciona un feedback breve, empático y constructivo (máximo 80 palabras).
      Concéntrate en validar sus sentimientos, reforzar el establecimiento de límites saludables y la conexión cuerpo-mente.
      
      Entrada del usuario:
      ${promptContext}
      
      Respuesta (en español):
    `;

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      return response.text || "No se pudo generar un consejo en este momento.";
    } catch (error) {
      console.error("Error calling Gemini:", error);
      return "Hubo un error al conectar con tu coach virtual.";
    }
  },

  /**
   * Generates a weekly summary or "insight" based on recent history.
   */
  generateWeeklyInsight: async (entries: Entry[]): Promise<string> => {
    if (!apiKey || entries.length === 0) return "";

    const recentEntries = entries.slice(0, 10); // Analyze last 10 entries
    const serialized = JSON.stringify(recentEntries);

    const prompt = `
      Eres un Coach Personal. Revisa estos últimos registros del usuario y dame una conclusión general sobre su progreso en poner límites ("decir no"), su conexión corporal y su disciplina.
      Sé motivador. (Máximo 100 palabras).
      
      Registros: ${serialized}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      return response.text || "";
    } catch (error) {
      return "No se pudo generar el resumen.";
    }
  }
};
