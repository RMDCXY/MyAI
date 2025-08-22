document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const modelToggle = document.getElementById('model-toggle');
    const typingIndicator = document.getElementById('typing-indicator');
    
    // 硅基流动API配置
    const apiConfig = {
        defaultModel: 'Qwen/Qwen2.5-7B-Instruct',   // 默认模型名称
        alternativeModel: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B' // 高级模型名称
    };
    
    // 提示词
    const systemPrompt = "你的名字是MyAI,是一个AI助手。现在，你需要处理以下用户的问题：";
    
    // 聊天历史
    let chatHistory = [];
    
    // 发送消息函数
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;
        
        // 添加用户消息到聊天界面
        addMessageToChat('user', message);
        
        // 清空输入框
        messageInput.value = '';
        
        // 显示"正在输入"指示器
        typingIndicator.style.display = 'block';
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 准备API请求数据
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
        
        // 添加到聊天历史
        chatHistory.push({
            role: 'user',
            content: message
        });
        
        // 发送请求到Cloudflare Worker代理
        fetch('/ai-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            // 1. 首先读取为文本
            return response.text().then(text => {
                // 2. 尝试解析为 JSON
                try {
                    if (text) {
                        return {
                            json: JSON.parse(text),
                            status: response.status,
                            ok: response.ok
                        };
                    } else {
                        throw new Error('响应为空');
                    }
                } catch (e) {
                    // 3. 解析失败时返回文本
                    return {
                        text: text,
                        status: response.status,
                        ok: response.ok,
                        parseError: e
                    };
                }
            });
        })
        .then(result => {
            // 隐藏"正在输入"指示器
            typingIndicator.style.display = 'none';
            
            // 处理不同类型的响应
            if (result.ok && result.json) {
                // 成功且是 JSON
                const aiResponse = result.json.choices[0]?.message?.content;
                
                if (aiResponse) {
                    addMessageToChat('assistant', aiResponse);
                    chatHistory.push({
                        role: 'assistant',
                        content: aiResponse
                    });
                } else {
                    throw new Error('AI响应结构异常');
                }
            } else if (result.text) {
                // 有文本响应但非 JSON
                throw new Error(`服务返回非预期响应: ${result.text.substring(0, 100)}...`);
            } else {
                // 其他错误
                throw new Error(`请求失败 (${result.status})`);
            }
            
            // 滚动到最新消息
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => {
            // 隐藏"正在输入"指示器
            typingIndicator.style.display = 'none';
            
            // 错误提示
            let errorMessage = '服务暂时不可用，请稍后再试。';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = '网络连接失败，请检查网络。';
            } else if (error.message.includes('响应结构异常')) {
                errorMessage = '出现错误。AI响应格式异常';
            }
            
            addMessageToChat('assistant', errorMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // 记录详细错误到控制台
            console.error('API请求错误详情:', error);
        });
    }
    
    // 添加消息到聊天界面
    function addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `message-bubble ${role}-bubble`;
        bubbleDiv.textContent = content;
        
        messageDiv.appendChild(bubbleDiv);
        
        // 在"正在输入"指示器之前插入新消息
        chatContainer.insertBefore(messageDiv, typingIndicator);
    }
    
    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);
    
    // 输入框回车事件
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});