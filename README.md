# MyAI模板 - 创建自己的AI，网页部署，更好分享

_欢迎访问[MyAI示例站点](https://cxybbs.top/ai)_


> 本文档将会一步步引导您创建出自己的MyAI，让大家更好、更容易体验到您的AI！

---
## * 准备工作
您需要准备好一个域名，并将域名托管到Cloudflare上。如果您没有米买域名，可以通过以下两期教程快速获得一个免费域名。您还需要准备好MyAI网页的背景图片，分为电脑端和手机端两张。您还可以准备好一个霍格沃茨环境（可选），用于加速访问Cloudflare。

[dpdns.org免费域名注册+托管教程](https://www.bilibili.com/video/BV13pGJzpEpT/?share_source=copy_web&vd_source=3392b84c6a87a67bdce0fd9ca9fdbf67)

[us.kg免费域名注册+托管教程](https://www.bilibili.com/video/BV1AjiBYVEoF/?share_source=copy_web&vd_source=3392b84c6a87a67bdce0fd9ca9fdbf67)

## ①第一步 克隆仓库
> Tips:MyAI依赖于Cloudflare Pages运行，为了编辑方便，建议使用克隆仓库到本地的方法。

首先，您需要将本仓库克隆到本地。您可以点击仓库的绿色`code`按钮，再点击`Download ZIP`按钮将整个仓库以ZIP形式下载到本地。或者，您还可以使用Git克隆、前往本仓库的Releases下载，等等。在将仓库克隆完成之后，您应该会在您的计算机上的MyAI文件夹内看到`index.html`和`script.js`两个文件。当您完成这一步之后，就可以进行下一步了。

## ②第二步 调整背景
> 注：在本步骤的重命名图片操作中，扩展名无需更改。

将两张准备工作中准备好的电脑端、手机端背景图片分别重命名为`pc.png`和`mob.png`，复制到MyAI文件夹的根目录下。

## ③第三步 硅基流动
打开[硅基流动官网](https://siliconflow.cn/)，点击右上角`登录`，并注册或登录现有账户。

登录或注册完成之后，应该会自动跳转到模型广场页面。如果没有，请[点我](https://cloud.siliconflow.cn/me/models)打开模型广场。

打开模型广场，点击左侧的**API密钥**，再点击页面上方的`🔑新建API密钥`，为新的密钥取一个名字，点击确定，API密钥就创建成功了。

## ④第四步 修改JS
转到第`16`行，将双引号内的内容换成您希望的AI提示词。

> Tips:如果您不会写提示词，您可以参考以下提示词，或者复制以下提示词替换。
```
你的名字叫做“(替换为您的AI名字)”，是一个AI助理。你和用户交流需要和聊天一样，回答要简洁明了，态度要积极乐观。你的回答绝对不能使用任何Markdown格式，回答的字数尽量控制在50字以内，在非用户要求情况的下输出只能使用中文。注意，你不是多模态模型，不能生成图片、视频等，当用户和尼提出这类要求时，你需要拒绝用户。现在，你需要严格按照以上要求来处理用户的问题：
```

## ⑤第五步 修改页面
打开MyAI文件夹，使用您喜欢的文本编辑器打开文件夹下的`myai.json`，转到第`2`行，修改其中的`MyAI模板`字段为您想要的页面大标题。再转到第`5`行，将其中的`欢迎使用MyAI模板！(≧∇≦)ﾉ`字段更换为您想要的AI欢迎语（打开网页时AI方自动发送的文本）。再转到第`6`行，修改其中的`MyAI`字段为您想要的页面标题。

## ⑥第六步 创建代理
> 为了您的API密钥的安全，我们需要通过Cloudflare Worker创建一个AI代理转发流量到硅基流动。

打开[Cloudflare](https://dash.cloudflare.com)，登录或注册现有账户。然后在左侧边栏中找到**计算 (Workers)**，点击进入，然后点击蓝色的`创建`按钮，点击最下面的**从 Hello,World! 开始**旁边的`开始使用`按钮，在**Worker 名称**输入框内为Worker取一个合适的名字（例如`ai-proxy-service`），点击`部署`，Worker就创建完成了。完成之后，点击右上角的`编辑代码`按钮，会打开Worker代码的编辑器，在左侧的编辑器中，粘贴以下代码，并点击右上角`部署`按钮。创建AI代理Worker的工作，就完成了。
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 只处理 /ai-proxy 路径的请求
    if (!url.pathname.startsWith('/ai-proxy')) {
      return new Response('Not Found', { status: 404 });
    }

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // 只允许 POST 请求
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        error: 'Method not allowed',
        allowed_methods: ['POST']
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 解析请求数据
      const requestData = await request.json();
      
      // 调试日志 - 记录请求数据
      console.log("请求数据:", JSON.stringify(requestData, null, 2));
      
      // 调用硅基流动 API
      const apiResponse = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.SILICONFLOW_API_KEY}`
        },
        body: JSON.stringify(requestData)
      });
      
      // 调试日志 - 记录 API 状态
      console.log(`API 状态: ${apiResponse.status}`);
      
      // 获取响应文本（避免直接解析 JSON）
      const responseText = await apiResponse.text();
      
      // 调试日志 - 记录响应文本
      console.log("API 响应:", responseText.substring(0, 300)); // 只记录前300字符
      
      // 如果 API 返回错误，直接转发
      if (!apiResponse.ok) {
        return new Response(responseText, {
          status: apiResponse.status,
          headers: {
            "Content-Type": apiResponse.headers.get("Content-Type") || "text/plain",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      
      // 尝试解析为 JSON
      try {
        const jsonData = JSON.parse(responseText);
        return new Response(JSON.stringify(jsonData), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e) {
        // 如果解析失败，返回原始文本
        return new Response(responseText, {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      
    } catch (error) {
      // 详细的错误响应
      return new Response(JSON.stringify({
        error: "代理服务器错误",
        message: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
}
```

## ⑦第七步 正式部署
打开[Cloudflare](https://dash.cloudflare.com)，登录或注册现有账户。然后在左侧边栏中找到**计算 (Workers)**，点击进入，然后点击蓝色的`创建`按钮，在**开始使用**下方，选择**Pages**，点击**使用直接上传**旁边的`开始使用`。在**项目名称**的输入框中，填写一个适合的名称（例如`my-ai`），点击`创建项目`，选择`📂上传文件夹`，再将整个MyAI文件夹上传上去，就部署完成啦！
部署完成之后，您还需要前往Pages的**自定义域**部分，添加一个自定义域（您托管在Cloudflare上的域名），注意，这一步是必须的！

在部署完成之后，我们还需要进行一下最后的配置。依旧打开[Cloudflare](https://dash.cloudflare.com)，然后在左侧边栏中找到**计算 (Workers)**，点击进入，打开**第六步**创建的Worker，进入**设置**，点击下方**变量与机密**旁边的`＋ 添加`按钮，会弹出添加页面，在类型处选择**密钥**，变量名称填写`SILICONFLOW_API_KEY`，值处需要前往[硅基流动API密钥页面](https://cloud.siliconflow.cn/me/account/ak)，复制第三步创建的API密钥填入，最后点击部署，API密钥的配置就完成了。
API密钥配置完成之后，我们还需要配置Worker路由。依旧打开Worker的设置，点击**域和路由**旁边的`＋ 添加`按钮，选择**路由**，在**区域**部分选择您托管在Cloudflare上的域名，路由按以下模板填写，再点击`添加路由`，就可以啦！
```
（将example.com换成您的域名）
https://*.example.com/ai-proxy*
https://example.com/ai-proxy*
```

## √ 完成！
✨当您看到这一步之后，您的MyAI就已经部署完成啦！

🤔如果您有一些疑问，可以查看以下的常见的问题解答：

**Q:** 在我的MyAI中与AI对话是完全免费的吗？
> **A:** 是的。MyAI模板默认配置的AI模型都是免费的。如果您觉得默认配置的AI能力不好，可以参考以下第3个拓展操作更换AI模型。

**Q:** 别人可以随意使用我的MyAI进行对话吗？
> **A:** 是的。只要别人知道您部署后的MyAI的网页URL，无需进行登录等操作即可直接和AI对话。

如果您还有其它问题，可以向本仓库创建一个issue，也可以[向我发邮件](mailto:rmdcxypgm@outlook.com)询问。

## * 可选 拓展操作
>ℹ在拓展操作做完之后，需要重新部署一遍Cloudflare Pages。

### 1.自定义错误信息
打开MyAI文件夹，使用您喜欢的文本编辑器打开文件夹下的`script.js`，分别修改第`129`、`132`、`134`行的引号中的内容。**（注：要记得检查前面单引号有没有遗漏哦！）**

### 2.自定义输入框提示文本
打开MyAI文件夹，使用您喜欢的文本编辑器打开文件夹下的`myai.json`，转到第`3`行，将`输入您的消息...`字段更改为您想要的提示文本。**（注：要记得检查英文双引号有没有漏掉哦！）**

### 3.自定义AI模型

#### 1.替换默认模型
打开[硅基流动模型广场](https://cloud.siliconflow.cn/me/models)。在这里，找到您想要替换的默认模型。找到以后，点击您想要替换的AI模型，再点击模型名称右侧的复制按钮将模型名称复制下来。接着，打开MyAI文件夹下的`script.js`，转到第`11`行，将引号中的字段替换为刚才复制的AI模型。**（注：要记得检查英文单引号有没有漏掉哦！）**

#### 2.替换备用模型
打开[硅基流动模型广场](https://cloud.siliconflow.cn/me/models)。在这里，找到您想要替换的备用模型。找到以后，点击您想要替换的AI模型，再点击模型名称右侧的复制按钮将模型名称复制下来。接着，打开MyAI文件夹下的`script.js`，转到第`12`行，将引号中的字段替换为刚才复制的AI模型。**（注：要记得检查英文单引号有没有漏掉哦！）**
在修改完`script.js`后，再打开MyAI文件夹下的`myai.json`，转到第`5`行，替换其中`Deepseek-R1深度思考`字段为您替换的备用模型名称（可自定义）。

> ⚠注意！部分模型可能需要💴，您可以打开筛选器，筛选免费的AI模型。当然，如果您有一些💴的话，您也可以在左边侧边栏打开**余额充值**进行充值。

### 4.自定义页面字体
首先获取到您想要更改的字体的字体文件（以woff2类型字体为首选，woff和ttf、otf其次），将字体文件复制到MyAI文件夹根目录下，并复制字体文件的名称（包括拓展名）。然后打开`index.html`，将第`25`行的`font_file`字段换成刚才复制到字体文件名。接着，您需要根据您的字体文件类型修改`25`行的`woff2`字段为：

|字体类型|操作|
|---|---|
|woff2|无需更改|
|woff|修改为`woff`|
|ttf|修改为`truetype`|
|otf|修改为`opentype`|

### 5.返回按钮
如果您是将MyAI使用在您的网站中的一个子页面，您可以将以下代码添加到`index.html`的`234`和`235`行之间，以在页面中添加一个返回按钮。**（将`https://example.com/`替换为您的网站首页网址）**
```
<a href="https://example.com/" style="text-align: left;item-align: left;"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1024 1024"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"/><path fill="#000000" d="m237.248 512l265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"/></svg></a>
```

### 6.自定义主题色

### 7.自定义网站图标

准备好您想要更改的图标图片。打开[RealFaviconGenerator](https://realfavicongenerator.net/)（此站点为英文站点，如果看不懂可以打开翻译工具），点击右侧的**选择您的网站图标图像**，上传刚才准备的图标图片，并根据需要调整相关配置。注意，在最下面的一个输入框需要填写`/favicon/`。完成配置之后点击**下一步**,会跳转到新页面，点击**下载**按钮，会下载一个zip压缩包。然后在MyAI文件夹下创建一个`favicon`文件夹，将下载下来的压缩包解压到MyAI文件夹下的`favicon`文件夹下。这样，图标就修改好了。**注意要检查有没有文件夹嵌套之类的情况！，最终的MyAI文件夹结构应该和下图一样：**
```
MyAI
|--favicon
| |(网站图标文件...)
|index.html
|myai.json
|script.js
|(其它文件...)
```