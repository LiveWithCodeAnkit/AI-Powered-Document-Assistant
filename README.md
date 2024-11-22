# **PDF Upload and Question Answering Application**

This application allows users to upload PDF documents, extract content, generate summaries, and perform question-and-answer interactions based on the uploaded content. Users must provide their **OpenAI API key**, which is securely managed and used only during their session.

---

## **Features**

- **PDF Upload**: Users can upload PDF files to process and store their content.
- **Document Summarization**: Automatically generates a concise summary of uploaded PDFs.
- **Contextual Question Answering**: Users can ask questions based on the uploaded document's content.
- **User-Supplied OpenAI API Key**: Users provide their own OpenAI API key via a secure modal.
- **Data Storage with Pinecone**: Processed document data is securely stored for efficient retrieval.

---

## **Technologies Used**

- **Next.js** (latest version) for server-side rendering and API routes.
- **LangChain** for document parsing and summarization.
- **Pinecone** for vector database storage and similarity searches.
- **OpenAI API** for AI-powered summarization and Q&A.
- **React** for the user interface.

---

## **Getting Started**

### Prerequisites

1. **Node.js** (>=16.x) and **npm** or **yarn**.
2. **Pinecone API Key**: Sign up at [Pinecone](https://www.pinecone.io/).

---

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name


2. **Install Dependencies:**:
 ```bash
  npm install

3. **Set Environment Variables:**: Create a .env file in the root directory and add the following variables:
 PINECONE_API_KEY=<your-pinecone-api-key>
 PINECONE_INDEX_NAME=<your-pinecone-index-name>
 SHARED_SECRET=<your-shared-secret>

## **Usage**

### **Upload a Document**

1. Drag and drop a PDF file onto the upload area.
2. If you haven’t provided an OpenAI API key, a modal will prompt you to enter it.
3. View the document's summary upon successful upload.

### **Ask Questions**

1. Select a document and type a question in the Q&A interface.
2. Receive an AI-generated answer based on the document's content.


 ### Application Workflow
**Client-Side**
 1.Users drag and drop a PDF file to upload.
 2.If no OpenAI API key is provided, a modal prompts the user to enter it.
 3.The OpenAI API key is stored securely in the client context and is never sent to the server.
 4.The uploaded file and metadata are securely transmitted to the server.


## Server-Side
The uploaded file is processed with LangChain to:

   Extract the document's content.

   Generate a summary using the user-provided OpenAI API key.

   Split the content into chunks for storage.

Processed data is stored in Pinecone with metadata.

For Q&A, similarity searches are performed using Pinecone, and answers are generated with the user's OpenAI API key.