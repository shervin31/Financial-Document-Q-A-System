from dotenv import load_dotenv

load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

class JpmRAG:
    def __init__(self):
        self.vector_store = None
        self.chain = None

    def initialize(self) -> FAISS: 
        print("Loading and processing 10-K PDF...")
        pdf_loader = PyPDFLoader("https://www.jpmorganchase.com/content/dam/jpmc/jpmorgan-chase-and-co/investor-relations/documents/quarterly-earnings/2025/4th-quarter/corp-10k-2025.pdf")
        pages = pdf_loader.load() 
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200) 
        pages_chunks = splitter.split_documents(pages)
        
        self.vector_store = FAISS.from_documents(
            documents=pages_chunks,
            embedding=HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        )
        print("Vector database initialized successfully!\n")
        return self.vector_store

    def create_chatbot(self): 
        retriever = self.vector_store.as_retriever(search_kwargs={"k": 4})
        prompt_loader = TextLoader("../Files/prompt.txt")
        prompt_docs = prompt_loader.load()
        prompt_string = prompt_docs[0].page_content
        prompt = PromptTemplate.from_template(prompt_string)
        
        llm = ChatOpenAI(model="gpt-4o-mini")
        
        # Format helper function to combine retrieved document chunks into a single string
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        # LCEL Chain connecting Retriever -> Prompt -> LLM
        self.chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        return self.chain

    def talk_to_chatbot(self): 
        print("Hi! I’m ready to answer your questions about the JPM 2025 10-K. What would you like to look up?")
        print("(Press Enter on an empty line to exit)\n")
    
        while True: 
            user_input = input("You: ").strip()
        
            if not user_input:
                print("Goodbye!")
                break
        
            response = self.chain.invoke(user_input)
            print(f"\nChatbot: {response}\n")