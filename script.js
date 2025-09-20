document.addEventListener('DOMContentLoaded', function() {
    // Cookie工具函数
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value)) + expires + '; path=/';
    }
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                try {
                    return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }
    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    }

    // 获取DOM元素
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const modelToggle = document.getElementById('model-toggle');
    const researchModeToggle = document.getElementById('research-mode-toggle');
    const typingIndicator = document.getElementById('typing-indicator');
    
    // 硅基流动API配置
    const apiConfig = {
        defaultModel: 'THUDM/GLM-4-9B-0414',   // 默认模型名称
        alternativeModel: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B' // 高级模型名称
    };
    
    // 提示词
    let systemPromptDefault = "你的名字是MyAI,是一个AI助手。现在，你需要处理以下用户的问题：";
    let systemPromptResearch = "你的名字是MyAI,是一个AI助手。你处理用户的问题需要专业且详细。现在，你需要处理以下用户的问题：";

    // 从JSON加载提示词
    fetch('myai.json')
        .then(response => response.json())
        .then(data => {
            if (data['system-prompt']) {
                systemPromptDefault = data['system-prompt'];
            }
            if (data['research-system-prompt']) {
                systemPromptResearch = data['research-system-prompt'];
            }
        }).catch(error => console.error("Failed to load prompts from myai.json", error));

    
    // 聊天历史
    let chatHistory = [];

    // 恢复历史对话
    function restoreHistoryFromCookie() {
        const logs = getCookie('logs');
        if (Array.isArray(logs)) {
            chatHistory = logs;
            chatHistory.forEach(msg => {
                addMessageToChat(msg.role, msg.content);
            });
        }
    }

    // 保存历史到cookie
    function saveHistoryToCookie() {
        setCookie('logs', chatHistory, 30);
    }
    
    // 发送消息函数
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;
        
        // 添加用户消息到聊天界面
        addMessageToChat('user', message);
        
        // 添加到聊天历史
        chatHistory.push({
            role: 'user',
            content: message
        });
        saveHistoryToCookie();
        
        // 清空输入框
        messageInput.value = '';
        
        // 显示"正在输入"指示器
        typingIndicator.style.display = 'block';
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 根据研究模式选择提示词
        const systemPrompt = researchModeToggle.checked ? systemPromptResearch : systemPromptDefault;

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
                }))
            ]
        };
        
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
            if (result.ok && result.json && result.json.choices && result.json.choices[0] && result.json.choices[0].message) {
                // 成功且是 JSON
                const aiResponse = result.json.choices[0].message.content;
                
                addMessageToChat('assistant', aiResponse);
                chatHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });
                saveHistoryToCookie();
            } else {
                // 其他错误
                throw new Error(`服务返回非预期响应: ${result.text ? result.text.substring(0, 100) + '...' : '空响应'}`);
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
            } else {
                errorMessage = `请求失败: ${error.message}`;
            }
            
            addMessageToChat('assistant', errorMessage);
            chatHistory.push({
                role: 'assistant',
                content: errorMessage
            });
            saveHistoryToCookie();
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // 记录详细错误到控制台
            console.error('API请求错误详情:', error);
        });
    }
    
    // 复制按钮SVG
    let copyIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ffffff" d="M21 8.94a1.3 1.3 0 0 0-.06-.27v-.09a1 1 0 0 0-.19-.28l-6-6a1 1 0 0 0-.28-.19a.3.3 0 0 0-.09 0a.9.9 0 0 0-.33-.11H10a3 3 0 0 0-3 3v1H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-1h1a3 3 0 0 0 3-3zm-6-3.53L17.59 8H16a1 1 0 0 1-1-1ZM15 19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1v7a3 3 0 0 0 3 3h5Zm4-4a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3v3a3 3 0 0 0 3 3h3Z"/></svg>';
    let checkIconSVG = '<svg viewBox="0 0 24 24" width="25" height="25" fill="#16a34a" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2 18.6 6.8z"/></svg>';

    // 添加消息到聊天界面
    function addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `message-bubble ${role}-bubble`;
        bubbleDiv.textContent = content;
        // AI气泡添加复制按钮
        if (role === 'assistant') {
            bubbleDiv.style.position = 'relative';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = copyIconSVG;
            copyBtn.title = '复制';
            copyBtn.onclick = function(e) {
                e.stopPropagation();
                navigator.clipboard.writeText(content).then(() => {
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = checkIconSVG;
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = copyIconSVG;
                    }, 2500);
                });
            };
            bubbleDiv.appendChild(copyBtn);
        }
        messageDiv.appendChild(bubbleDiv);
        // 在"正在输入"指示器之前插入新消息
        chatContainer.insertBefore(messageDiv, typingIndicator);
    }

    // 清除历史记录
    const clearLogsLink = document.getElementById('clear-logs-link');
    if (clearLogsLink) {
        clearLogsLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('确定要清除历史记录吗？该操作不可逆，清除后历史记录无法恢复！')) {
                eraseCookie('logs');
                chatHistory = [];
                // 清空聊天界面（保留欢迎语和typing-indicator）
                const messages = chatContainer.querySelectorAll('.message');
                messages.forEach(msg => msg.remove());
            }
        });
    }
    
    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);
    // 输入框回车事件
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 页面加载时恢复历史
    restoreHistoryFromCookie();
});