import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { question, documentId, apiKey } = await req.json();

    // Validate inputs
    if (!question?.trim() || !documentId) {
      return new Response("Missing question or documentId or openAikey", { status: 400 });
    }

    // Step 1: Initialize OpenAI embeddings for Pinecone
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      model: "text-embedding-3-small",
      dimensions: 512,
    });

    // Step 2: Retrieve relevant document snippets from Pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      filter: { documentId },
    });

    const results = await vectorStore.similaritySearch(question, 4); // Top 4 matches
    if (results.length === 0) {
      return NextResponse.json({
        answer: "The document does not contain this information.",
      });
    }

    // Combine relevant snippets into a single context
    const contentText = results.map((r) => r.pageContent).join("\n");

    // Step 3: Create an enhanced OpenAI prompt
    const prompt = `
You are an advanced AI assistant trained to analyze and answer questions based on uploaded documents. The document type can vary widely, including resumes, medical reports, educational materials, fictional stories, or other content.

Follow these instructions:
1. **Analyze the provided context thoroughly**: Use only the information from the document to answer the question.
2. **Provide structured, specific answers**: Format your answers based on the type of query. If the question asks for a list, provide it in bullet points. If it requests an explanation, be concise and clear.
3. **Handle unknowns appropriately**: If the document does not contain the required information, respond with: 
   "The document does not contain this information."
4. **Focus on relevance**: Ignore any unrelated or speculative content.

Here is the document context:
${contentText}

Question: ${question}

Answer:
    `;

    // Step 4: Send the prompt to OpenAI API for processing
    const openai = new OpenAI({
      openAIApiKey: apiKey!,
    });

    const response = await openai.invoke(prompt);

    // Return the AI's response
    return NextResponse.json({
      answer: response.trim(),
    });
  } catch (error) {
    console.error("Error processing question:", error);
    return NextResponse.json({
      answer: "An error occurred while processing your question.",
    });
  }
}
