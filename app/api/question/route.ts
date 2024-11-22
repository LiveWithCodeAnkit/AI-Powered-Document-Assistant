import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";
// import CryptoJS from "crypto-js";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// const decryptPayload = (encrypted: string, secret: string) => {
//   const bytes = CryptoJS.AES.decrypt(encrypted, secret);
//   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// };

export async function POST(req: Request) {
  try {
    const { question, documentId, apiKey } = await req.json();

    if (!question?.trim() || !documentId) {
      return new Response("Missing question or documentId or openAikey", { status: 400 });
    }
  //  const apiKey = decryptPayload(encryptedApiKey, process.env.SECRET_KEY!);
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      filter: { documentId },
    });

    const results = await vectorStore.similaritySearch(question, 4);

    if (results.length === 0) {
      return NextResponse.json({
        answer: "I don't know the answer to that question",
      });
    }

    const contentText = results.map((r) => r.pageContent).join("\n");

    const openai = new OpenAI({
      openAIApiKey: apiKey!,
    });

    const prompt = `You are a helpful AI assistant. Using the following context from a document, 
    please answer the user's question accurately and concisely. If the context doesn't contain 
    relevant information to answer the question, please say so.

Context:
${contentText}

Question: ${question}

    Answer:`;

    const response = await openai.invoke(prompt);

    return NextResponse.json({
      answer: response,
    });
  } catch (error) {
    console.error("Error processing question:", error);
    return NextResponse.json({
      answer: "An error occurred while processing your question.",
    });
  }
}
