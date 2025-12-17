
import { GoogleGenAI } from "@google/genai";
import { PersonaType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askJarvis(prompt: string, persona: PersonaType, context: any) {
  const systemInstruction = `
    Eres HESTIA, una inteligencia artificial avanzada inspirada en JARVIS. 
    Tu objetivo es ayudar al usuario con su gestión de tareas, inventario y recetas.
    Actualmente el usuario tiene el perfil de: ${persona}.
    Adapta tu tono y sugerencias a este perfil:
    - Ama de casa: Enfócate en eficiencia del hogar, organización familiar y ahorro.
    - Estudiante: Enfócate en productividad, estudio y recetas rápidas/económicas.
    - Persona Común: Un equilibrio entre vida laboral, personal y hobbies.
    
    Contexto actual de la aplicación: ${JSON.stringify(context)}
    
    Responde de forma concisa, inteligente y útil. Usa Markdown para formatear si es necesario.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error al consultar a Jarvis:", error);
    return "Lo siento, tuve una interferencia en mis sistemas. ¿Podrías repetir eso?";
  }
}
