
  

document.addEventListener("DOMContentLoaded", () =>{
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");

    userInput.addEventListener("input", () => {
        userInput.style.height = "auto";
        userInput.style.height = userInput.scrollHeight + "px";
    });

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        addMessage(message, true);
        userInput.value = "";
        userInput.style.height = "auto";    
        sendButton.disabled = true;
        const typingIndicator = showTypingIndicator();
        try {
            const response = await generateResponse(message);
            typingIndicator.remove();
            addMessage(response, false);
        } catch (error) {
            typingIndicator.remove();
            addErrorMessage(error.message);
        } finally {
            sendButton.disabled = false;
        }

});



async function generateResponse(prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=AIzaSyBFxwaWPMOmtGmfgl-vJ_Osp1w14ONpe7E`, 
    {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        },
                    ],
                },
            ],
        }),
    }
);
if(!response.ok) {
    throw new Error("Failed to generate the response.");
}
const data = await response.json();
return data.candidates[0].content.parts[0].text;
}

function addMessage(text, isUser){
    const message = document.createElement("div");
    message.className = `message ${isUser ? "user-message" : ""}`;
    message.innerHTML = `
    <div class = "avatar ${isUser ? "user-avatar" : ""}"> 
    ${isUser ? "U" : "AI"}
    </div>
    <div class = "message-content"> ${text} </div>
    `;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement("div"); 
    indicator.className = "message";
    indicator.innerHTML = `
    <div class = "avatar"> AI </div>
    <div class = "typing-indicator">
    <div class = "dot"></div>2
    <div class = "dot"></div>
    <div class = "dot"></div>
    </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
}

function addErrorMessage(text) {
    const message = document.createElement("div");
    message.className = "message";
    message.innerHTML = `
    <div class = "avatar"> AI </div>
    <div class = "message-content" style = "color: red;">
    Error : ${text}
    </div>
    `;
}


});


