import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    let productsContext = "No products available.";
    try {
        const res = await fetch(`${API_URL}/products/`);
        if (res.ok) {
            const products = await res.json();
            productsContext = products.map((p: any) => `- ${p.name}: $${p.price} (Category: ${p.category})`).join('\n');
        }
    } catch(e) {
        console.error("Could not fetch products context for AI");
    }

    const systemInstruction = `You are a helpful AI Assistant for an e-commerce store called VoltVibe.
    Here is our current product catalog:
    ${productsContext}
    
    Use this catalog to answer user questions, recommend products, and help them shop. Keep answers concise.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction });

    // Ensure history strictly starts with a user message
    let validHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Remove any leading model messages
    while (validHistory.length > 0 && validHistory[0].role === 'model') {
      validHistory.shift();
    }

    const chat = model.startChat({
      history: validHistory,
    });

    try {
        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        return NextResponse.json({
          role: 'assistant',
          content: responseText
        });
    } catch (apiError) {
        console.error("Gemini API Error:", apiError);
        return NextResponse.json({
          role: 'assistant',
          content: "I'm currently experiencing high demand and cannot answer your question right now. Please try again later."
        });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
