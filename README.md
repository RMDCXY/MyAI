<h1 style="text-align: center;">MyAI模板 - 创建自己的AI，网页部署，更好分享</h1>

_欢迎访问[MyAI示例站点](https://cxybbs.top/ai)_

<img alt="MyAI Sample Website Screenshot" src="https://github.com/user-attachments/assets/7e0b0b8e-e01a-4c6f-8c12-d3a1aab0f52c" />

> MyAI是一个高个性化的Web项目，皆在帮助大家更轻松的为自己的网站添加一个AI对话功能。本文档将会一步步引导您创建出自己的MyAI，让大家更好、更容易体验到您的AI！

---
## * 准备工作
您需要准备好一个域名，并将域名托管到Cloudflare上。如果您没有米买域名，可以通过以下两期教程快速获得一个免费域名。您还需要准备好MyAI网页的背景图片，分为电脑端和手机端两张。您还可以准备好一个霍格沃茨环境（可选），用于加速访问Cloudflare。

[dpdns.org免费域名注册+托管教程](https://www.bilibili.com/video/BV13pGJzpEpT/?share_source=copy_web&vd_source=3392b84c6a87a67bdce0fd9ca9fdbf67)

[us.kg免费域名注册+托管教程](https://www.bilibili.com/video/BV1AjiBYVEoF/?share_source=copy_web&vd_source=3392b84c6a87a67bdce0fd9ca9fdbf67)

## ①第一步 克隆仓库
> Tip:MyAI依赖于Cloudflare Pages运行，为了编辑方便，建议使用克隆仓库到本地的方法。

首先，您需要将本仓库克隆到本地。您可以点击仓库的绿色`code`按钮，再点击`Download ZIP`按钮将整个仓库以ZIP形式下载到本地。或者，您还可以使用Git克隆、前往本仓库的Releases下载，等等。在将仓库克隆完成之后，您应该会在您的计算机上的MyAI文件夹内看到`index.html`和`script.js`两个文件。当您完成这一步之后，就可以进行下一步了。

## ②第二步 硅基流动
打开[硅基流动官网](https://siliconflow.cn/)，点击右上角`登录`，并注册或登录现有账户。

登录或注册完成之后，应该会自动跳转到模型广场页面。如果没有，请[点我](https://cloud.siliconflow.cn/me/models)打开模型广场。

打开模型广场，点击左侧的**API密钥**，再点击页面上方的`🔑新建API密钥`，为新的密钥取一个名字，点击确定，API密钥就创建成功了。

## ③第三步 修改配置
> 通过该步骤，您可以最大限度地个性化您的MyAI。

### - 1.修改背景图片

> 注：在本步骤的重命名图片操作中，扩展名无需更改。

将两张准备工作中准备好的电脑端、手机端背景图片分别重命名为`pc.png`和`mob.png`，复制到MyAI文件夹的根目录下。

### - 2.启用或禁用研究模式

MyAI附带了研究模式，在用户聊天时启用研究模式，回答会更长且更专业。

研究模式是默认启用的，如果您不想要研究模式，请打开`myai.json`，将第`8`行的`true`改为`false`。反之，如果您想重新启用研究模式，将第`8`行的`false`改回`true`即可。

### - 3.修改提示词

打开`script.js`，在这里我们需要修改两个提示词，分别是**默认提示词**和**研究模式提示词**。让我们一步步操作。
> Tip:如果您禁用了研究模式，可以不修改研究模式提示词。

#### -- 1.默认提示词

打开`script.js`，转到第`47`行，将双引号内的内容换成您希望的AI提示词。

> Tip:如果您不会写提示词，您可以参考以下提示词，或者复制以下提示词替换。
```
你的名字叫做“(替换为您的AI名字)”，是一个AI助理。你和用户交流需要和聊天一样，回答要简洁明了，态度要积极乐观。你的回答绝对不能使用任何Markdown格式，回答的字数尽量控制在50字以内，在非用户要求情况的下输出只能使用中文。注意，你不是多模态模型，不能生成图片、视频等，当用户和你提出这类要求时，你需要拒绝用户。现在，你需要严格按照以上要求来处理用户的问题：
```

#### -- 2.研究模式提示词

打开`script.js`，转到第`48`行，将双引号内的内容换成您希望的研究模式AI提示词。

> Tip:如果您不会写提示词，您可以参考以下提示词，或者复制以下提示词替换。
```
你的名字叫做“(替换为您的AI名字)”，是一个AI助理。你和用户交流需要和写研究报告一样，专业而详细，态度要积极乐观，回答的字数控制在100~300字以内。你的回答绝对不能使用任何Markdown格式，在非用户要求情况的下输出只能使用中文。注意，你不是多模态模型，不能生成图片、视频等，当用户和你提出这类要求时，你需要拒绝用户。现在，你需要严格按照以上要求来处理用户的问题：
```

### - 4.修改页面

打开`myai.json`，转到第`2`行，修改其中双引号内的内容为您想要的页面大标题。转到第`3`行，将其中双引号内的内容修改为您想要的输入框提示文本。再转到第`5`行，将双引号内的内容更换为您想要的AI欢迎语（打开网页时AI方自动发送的文本）。再转到第`6`行，修改双引号内的内容为您想要的页面标题。再转到第`9`行，修改双引号内的内容为您想要的关于信息。
> （注意！如果想要写多行关于信息，**不要直接换行！不要直接换行！**，请在需要换行的地方添加`\n`换行符！
例如，`abcdef`在`c`和`d`之间需要换行，写成`abc\ndef`）

### - 5.自定义页面图标

准备好您想要更改的图标图片。打开[RealFaviconGenerator](https://realfavicongenerator.net/)（此站点为英文站点，如果看不懂可以打开翻译工具），点击右侧的**选择您的网站图标图像**，上传准备的图标图片，并根据需要调整相关配置。注意，在最下面的一个输入框需要填写`/favicon/`。完成配置之后点击**下一步**,会跳转到新页面，点击**下载**按钮，会下载一个zip压缩包。然后在MyAI文件夹下创建一个`favicon`文件夹，将下载下来的压缩包解压到MyAI文件夹下的`favicon`文件夹下。这样，图标就修改好了。**注意要检查有没有文件夹嵌套之类的情况！，最终的MyAI文件夹结构应该和下图一样：**
```
MyAI
|--favicon
| |(网站图标文件...)
|index.html
|myai.json
|script.js
|(其它文件...)
```

## ④第四步 创建代理
> 为了您的API密钥的安全，我们需要通过Cloudflare Worker创建一个代理转发流量到硅基流动。

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

## ⑤第五步 正式部署
打开[Cloudflare](https://dash.cloudflare.com)，登录或注册现有账户。然后在左侧边栏中找到**计算 (Workers)**，点击进入，然后点击蓝色的`创建`按钮，在**开始使用**下方，选择**Pages**，点击**使用直接上传**旁边的`开始使用`。在**项目名称**的输入框中，填写一个适合的名称（例如`my-ai`），点击`创建项目`，选择`📂上传文件夹`，再将整个MyAI文件夹上传上去，就部署完成啦！
部署完成之后，您还需要前往Pages的**自定义域**部分，添加一个自定义域（您托管在Cloudflare上的域名），注意，这一步是必须的！

在部署完成之后，我们还需要进行一下最后的配置。依旧打开[Cloudflare](https://dash.cloudflare.com)，然后在左侧边栏中找到**计算 (Workers)**，点击进入，打开**第六步**创建的Worker，进入**设置**，点击下方**变量与机密**旁边的`＋ 添加`按钮，会弹出添加页面，在类型处选择**密钥**，变量名称填写`SILICONFLOW_API_KEY`，值处需要前往[硅基流动API密钥页面](https://cloud.siliconflow.cn/me/account/ak)，复制第三步创建的API密钥填入，最后点击部署，API密钥的配置就完成了。
API密钥配置完成之后，我们还需要配置Worker路由。依旧打开Worker的设置，点击**域和路由**旁边的`＋ 添加`按钮，选择**路由**，在**区域**部分选择您托管在Cloudflare上的域名，路由按以下模板填写，再点击`添加路由`，就可以啦！
```
（下面两条路由都填写，将example.com换成您的域名，*星号不要更改！）

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

**Q:** 我的API密钥会有安全风险吗？
> **A:** 放心，您的API密钥绝对安全。MyAI使用Cloudflare Worker进行请求中转，您的API密钥被安全的存储在Cloudflare环境变量中，且为密钥类型。即使您的Cloudflare账户被盗或密码泄露，API密钥也绝对没有安全风险。

**Q:** MyAI可以生成图片视频吗？
> **A:** 目前MyAI暂时不能生成图片视频，因为MyAI只能接入单一模态模型。所以，我们建议您在AI提示词中注明AI不能生成音视频。

**Q:** MyAI有上下文功能吗？
> **A:** 目前MyAI暂时没有上下文功能，也就是和AI对话时，AI无法回忆刚才聊了什么。在未来可能会添加这个功能，敬请期待 o((>ω< ))o

如果您还有其它问题，可以向本仓库创建一个Issue，也可以[向我发邮件](mailto:rmdcxypgm@outlook.com)询问。

## * 可选 拓展操作
>ℹ在拓展操作做完之后，需要重新部署一遍Cloudflare Pages。

### * 测试效果
> 在做完您想要的拓展操作之后，如果您不确定效果是否正确，您可以按照该步骤先测试效果之后再进行部署。

首先您需要准备安装好[VSCode](https://code.visualstudio.com)。安装好之后按下`Ctrl+Shift+X`，打开拓展商店，然后点击上方的搜索框，搜索**Live Server**，选择由**Ritwick Dey**发布的拓展安装。安装完成之后，再按下`Ctrl+Shift+E`打开VSCode的资源管理器，将您的MyAI文件夹拖入，再右键其中的`index.html`文件，选择`Open with Live Server`，就会自动打开浏览器，您就可以看到效果啦！

> Tip:Live Server足够智能，当您修改完成网页保存之后，浏览器网页也会自动刷新。

> 由于浏览器安全限制，直接打开html文件，会因为无法访问json文件而无法看到真实效果。使用Live Server的本地服务器才能够看到真实的MyAI效果。

注意，在VSCode被关闭后，Live Server也会被关闭，需要保持VSCode运行才能看到效果！

### - 1.添加返回按钮
如果您想要将MyAI添加在您的网站的一个子页面，一个返回按钮是必不可少的。MyAI已经为您准备好了返回按钮，您只需要打开`myai.json`，先将`false`字段改为`true`，然后再将第3个双引号内的内容改为需要返回到的URL即可。这样，在MyAI页面的左上角就会有一个返回按钮啦！

### - 2.自定义错误信息
打开MyAI文件夹，使用您喜欢的文本编辑器打开文件夹下的`script.js`，分别修改第`184`、`187`、`189`行的单引号中的内容。**（注：要记得检查前面单引号有没有遗漏哦！）**

### - 3.自定义输入框提示文本
打开MyAI文件夹，使用您喜欢的文本编辑器打开文件夹下的`myai.json`，转到第`3`行，将`输入您的消息...`字段更改为您想要的提示文本。**（注：要记得检查英文双引号有没有漏掉哦！）**

### - 4.自定义AI模型

#### -- 1.替换默认模型
打开[硅基流动模型广场](https://cloud.siliconflow.cn/me/models)。在这里，找到您想要替换的默认模型。找到以后，点击您想要替换的AI模型，再点击模型名称右侧的复制按钮将模型名称复制下来。接着，打开MyAI文件夹下的`script.js`，转到第`42`行，将引号中的字段替换为刚才复制的AI模型。**（注：要记得检查英文单引号有没有漏掉哦！）**

#### -- 2.替换备用模型
打开[硅基流动模型广场](https://cloud.siliconflow.cn/me/models)。在这里，找到您想要替换的备用模型。找到以后，点击您想要替换的AI模型，再点击模型名称右侧的复制按钮将模型名称复制下来。接着，打开MyAI文件夹下的`script.js`，转到第`43`行，将引号中的字段替换为刚才复制的AI模型。**（注：要记得检查英文单引号有没有漏掉哦！）**
在修改完`script.js`后，再打开MyAI文件夹下的`myai.json`，转到第`5`行，替换其中`Deepseek-R1深度思考`字段为您替换的备用模型名称（可自定义）。

> ⚠注意！部分模型可能需要💴，您可以打开筛选器，筛选免费的AI模型。当然，如果您有一些💴的话，您也可以在左边侧边栏打开**余额充值**进行充值。

### - 5.自定义页面字体
首先获取到您想要更改的字体的字体文件（以woff2类型字体为首选，woff和ttf、otf其次），将字体文件复制到MyAI文件夹根目录下，并复制字体文件的名称（包括拓展名）。然后打开`index.html`，将第`25`行的`font_file`字段换成刚才复制到字体文件名。接着，您需要根据您的字体文件类型修改`25`行的`woff2`字段为：

|字体类型|操作|
|---|---|
|woff2|无需更改|
|woff|修改为`woff`|
|ttf|修改为`truetype`|
|otf|修改为`opentype`|

### - 6.自定义主题色
使用您喜欢的编辑器打开MyAI文件夹下的`myai.json`，转到第`7`行，将双引号中的字段修改为您想要的主题色。
以下是合法的主题色输入范例：
|英文颜色单词|十六进制|
|---|---|
|blue|#114514|

如果您不知道如何获取想要颜色的十六进制值，您可以使用[工具](https://www.bing.com/search?q=%E6%8B%BE%E8%89%B2%E5%99%A8)快速获取。

---

# 感谢您使用MyAI！
> 欢迎[在哔哩哔哩上关注我](https://space.bilibili.com/3493142110144946)(doge)