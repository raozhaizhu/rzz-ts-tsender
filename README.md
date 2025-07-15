# 要做啥

1. NextJS 前端页面 ✅

    - 静态就行
    - 用 Shadcn 搞个好的钱包互动界面
    - 校验类型安全性,使用 zod 解决很多问题

2. ERC20 TOKEN 投放功能 `将直接使用现有的Anvil配置数据进行测试` ✅

    - 实现货币投放,支持主网和 zksync 和我们的测试 anvil
    - 货币投放可以对多个账号进行不同金额的多笔投放

    - ```solidity
      function airdropERC20(){
      address tokenAddress,
      address[] calldata recipients,
      uint256[] calldata amounts,
      uint256 totalAmount
      }
      ```

3. 进行测试,单元和端到端,简单展示 ✅

    - 端到端测试 `用playwright+synpress`

        1. 首页信息展示

            1. 如果钱包在线,看到图表
            2. 否则,看到提示(提示页面用 motion 顺便搞点动效)

    - 单元测试 `用vitest`

        1. util 工具函数,计算总金额
            1. 测试各类情况(如输入不正确,空值,边缘情况)是否符合我们预期
            2. 如果不符合,测试应该报错
            3. 所有测试应当通过

4. 部署到 vercel

## 技术栈

-   NextJs
-   Tailwind
-   Shadcn
-   Solidity `主要是测试`
-   Foundry `主要是测试`
-   zod
-   viem
-   wagmi
-   rainbowkit
-   tanstack/react-query
-   vitest
-   playwright
-   synpress
-   vercel
