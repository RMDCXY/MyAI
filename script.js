document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const modelToggle = document.getElementById('model-toggle');
    const typingIndicator = document.getElementById('typing-indicator');
    
    // 硅基流动API配置
    const apiConfig = {
        apiKey: 'sk_API_KEY', // 替换为硅基流动API密钥
        defaultModel: 'Qwen/Qwen2.5-7B-Instruct',   // 默认模型名称
        alternativeModel: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B' // 高级模型名称
    };
    
    // 提示词
    const systemPrompt = "你的名字是MyAI,是一个AI助手。现在，你需要处理以下用户的问题：";
    
    let chatHistory = [];
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;
        
        addMessageToChat('user', message);
        
        messageInput.value = '';
        
        typingIndicator.style.display = 'block';
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        const selectedModel = modelToggle.checked ? apiConfig.alternativeModel : apiConfig.defaultModel;
        const requestData = {
            model: selectedModel,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...chatHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                {
                    role: 'user',
                    content: message
                }
            ]
        };
        
        chatHistory.push({
            role: 'user',
            content: message
        });
        
        fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiConfig.apiKey}`
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            typingIndicator.style.display = 'none';
            
            const aiResponse = data.choices[0].message.content;
            
            addMessageToChat('assistant', aiResponse);
            chatHistory.push({
                role: 'assistant',
                content: aiResponse
            });
            
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => {

            typingIndicator.style.display = 'none';
            // 错误消息
            addMessageToChat('assistant', `抱歉，发生错误: ${error.message}`);
            
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            console.error('API请求错误:', error);
        });
    }
    
    function addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `message-bubble ${role}-bubble`;
        bubbleDiv.textContent = content;
        
        messageDiv.appendChild(bubbleDiv);
        
        chatContainer.insertBefore(messageDiv, typingIndicator);
    }
    
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});