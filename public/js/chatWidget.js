/**
 * Chat Widget - A simple AI chatbot widget for the job application platform
 * This file contains the client-side JavaScript for the chat interface
 */

class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.chatContainer = null;
    this.init();
  }

  init() {
    // Create and inject the chat widget HTML into the page
    this.createChatWidget();
    this.attachEventListeners();
  }

  createChatWidget() {
    const widgetHTML = `
      <div id="chat-widget" class="fixed bottom-4 right-4 z-50">
        <!-- Chat Toggle Button -->
        <button id="chat-toggle-btn" class="btn btn-primary btn-circle btn-lg shadow-lg">
          <i data-lucide="message-circle" class="h-6 w-6"></i>
        </button>

        <!-- Chat Window (Hidden by default) -->
        <div id="chat-window" class="card w-96 bg-base-100 shadow-xl hidden">
          <div class="card-body p-4">
            <!-- Chat Header -->
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title text-lg">
                <i data-lucide="bot" class="h-5 w-5 mr-2"></i>
                Kenai
              </h2>
              <button id="chat-close-btn" class="btn btn-ghost btn-sm btn-circle">
                <i data-lucide="x" class="h-4 w-4"></i>
              </button>
            </div>

            <!-- Chat Messages -->
            <div id="chat-messages" class="h-96 overflow-y-auto space-y-3 mb-4 p-2 bg-base-200 rounded-lg">
              <div class="chat chat-start">
                <div class="chat-bubble chat-bubble-primary">
                  Hi! I'm Kenai, your job application assistant. How can I help you today?
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="flex gap-2">
              <input
                type="text"
                id="chat-input"
                placeholder="Type a message..."
                class="input input-bordered flex-1"
                autocomplete="off"
              />
              <button id="chat-send-btn" class="btn btn-primary">
                <i data-lucide="send" class="h-4 w-4"></i>
              </button>
            </div>

            <!-- Loading Indicator -->
            <div id="chat-loading" class="hidden mt-2">
              <span class="loading loading-dots loading-sm"></span>
              <span class="text-sm ml-2">Thinking...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", widgetHTML);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById("chat-toggle-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const sendBtn = document.getElementById("chat-send-btn");
    const input = document.getElementById("chat-input");

    toggleBtn.addEventListener("click", () => this.toggleChat());
    closeBtn.addEventListener("click", () => this.toggleChat());
    sendBtn.addEventListener("click", () => this.sendMessage());
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });

    // Reinitialize Lucide icons for the new elements
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const chatWindow = document.getElementById("chat-window");
    const toggleBtn = document.getElementById("chat-toggle-btn");

    if (this.isOpen) {
      chatWindow.classList.remove("hidden");
      toggleBtn.classList.add("hidden");
      document.getElementById("chat-input").focus();
    } else {
      chatWindow.classList.add("hidden");
      toggleBtn.classList.remove("hidden");
    }
  }

  async sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (!message) return;

    // Add user message to UI
    this.addMessageToUI("user", message);
    input.value = "";

    // Show loading indicator
    this.showLoading(true);

    try {
      // Send message to backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          message: message,
          conversationHistory: this.messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Chat API error:", data);
        throw new Error(data.message || data.error || "Failed to get response");
      }

      // Add assistant response to UI
      this.addMessageToUI("assistant", data.data.response);

      // Store messages for context
      this.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: data.data.response }
      );
    } catch (error) {
      console.error("Chat error details:", error);
      const errorMessage = error.message || "Sorry, I'm having trouble connecting right now. Please try again later.";
      this.addMessageToUI(
        "assistant",
        `Error: ${errorMessage}`
      );
    } finally {
      this.showLoading(false);
    }
  }

  addMessageToUI(role, content) {
    const messagesContainer = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat ${role === "user" ? "chat-end" : "chat-start"}`;

    const bubbleClass =
      role === "user" ? "chat-bubble-accent" : "chat-bubble-primary";

    messageDiv.innerHTML = `
      <div class="chat-bubble ${bubbleClass}">
        ${this.escapeHtml(content)}
      </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showLoading(show) {
    const loadingDiv = document.getElementById("chat-loading");
    if (show) {
      loadingDiv.classList.remove("hidden");
    } else {
      loadingDiv.classList.add("hidden");
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chat widget when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ChatWidget();
  });
} else {
  new ChatWidget();
}
