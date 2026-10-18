from rag import JpmRAG

def main():
    bot = JpmRAG()
    bot.initialize()
    bot.create_chatbot()
    bot.talk_to_chatbot()

if __name__ == "__main__":
    main()