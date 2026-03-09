const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getDecks: () => ipcRenderer.invoke("getDecks"),
  createDeck: (deck) => ipcRenderer.invoke("createDeck", deck),
  updateDeck: (id, deck) => ipcRenderer.invoke("updateDeck", id, deck),
  deleteDeck: (id) => ipcRenderer.invoke("deleteDeck", id),
  evaluateAnswer: (payload) => ipcRenderer.invoke("evaluateAnswer", payload),
});