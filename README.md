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