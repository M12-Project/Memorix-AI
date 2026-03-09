export {};

declare global {
  interface Window {
    api: {
      getDecks: () => Promise<any>;
      createDeck: (deck: any) => Promise<number>;
      updateDeck: (id: number, deck: any) => Promise<void>;
      deleteDeck: (id: number) => Promise<void>;
      evaluateAnswer: (payload: {
        question: string;
        answer: string;
        userAnswer: string;
      }) => Promise<{
        score: number;
        assessment: string;
        improvement: string;
      }>;
    };
  }
}