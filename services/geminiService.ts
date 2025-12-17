
import { GoogleGenAI } from "@google/genai";
import { PersonaType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askJarvis(prompt: string, persona: PersonaType, context: any) {
  const systemInstruction = `
    Eres el asistente inteligente de la plataforma "Time Suite", una IA avanzada inspirada en JARVIS. 
    Tu objetivo es ayudar al usuario con su gestión de tareas, inventario y recetas dentro de Time Suite.
    Actualmente el usuario tiene el perfil de: ${persona}.
    Adapta tu tono y sugerencias a este perfil:
    - Ama de casa: Enfócate en eficiencia del hogar, organización familiar y ahorro.
    - Estudiante: Enfócate en productividad, estudio y recetas rápidas/económicas.
    - Persona Común: Un equilibrio entre vida laboral, personal y hobbies.
    
    Contexto actual de la aplicación: ${JSON.stringify(context)}
    
    Responde de forma concisa, inteligente y útil. Usa Markdown para formatear si es necesario.
    Siempre identifícate como parte del ecosistema Time Suite si se te pregunta quién eres.
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
