// import CryptoJS from "crypto-js";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// const decryptPayload = (encrypted: string, secret: string) => {
//   const bytes = CryptoJS.AES.decrypt(encrypted, secret);
//   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// };


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const encryptedApiKey = formData.get("apiKey") as string;

    if (!file || !encryptedApiKey) {
      return new Response("Invalid request", { status: 400 });
    }

    // Decrypt the API key
   //  const { apiKey } = decryptPayload(encryptedApiKey, process.env.SHARED_SECRET!);

  
    

    if (!encryptedApiKey) {
      return new Response("Missing API key", { status: 400 });
    }

    // Generate a document ID
    const documentId = crypto.randomUUID();

    // Convert file to blob
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    // Load and parse PDF
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    // Add documentId to metadata of each chunk
    const docsWithMetadata = splitDocs.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        documentId,
      },
    }));

    // Generate summary
    const openai = new OpenAI({ openAIApiKey: encryptedApiKey });
    const summary = await openai.invoke(
      `Summarize the following document: ${splitDocs[0].pageContent}`
    );

    // Store in Pinecone with metadata
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: encryptedApiKey });
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    await PineconeStore.fromDocuments(docsWithMetadata, embeddings, {
      pineconeIndex: index,
    });

    return NextResponse.json({
      summary,
      documentId,
      pageCount: docs.length,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return new Response("Error processing upload", { status: 500 });
  }
}
