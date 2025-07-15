import basicSetup from "../wallet-setup/basic.setup";
import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import { symbol } from "zod";

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test("has title", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/RzzTSender/);
});

test("should show the form when wallet connected,otherwise show placeholder", async ({
    page,
    context,
    metamaskPage,
    extensionId,
}) => {
    await page.goto("/");

    await expect(page.getByText("Please connect a wallet...")).toBeVisible();

    const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
    await page.getByTestId("rk-connect-button").click();
    await page.getByTestId("rk-wallet-option-metaMask").waitFor({
        state: "visible",
        timeout: 3000,
    });

    await page.getByTestId("rk-wallet-option-metaMask").click();
    await metamask.connectToDapp();

    const customNetwork = {
        name: "Anvil",
        rpcUrl: "http://127.0.0.1:8545",
        chainId: 31337,
        symbol: "ETH",
    };
    await metamask.addNetwork(customNetwork);

    await expect(page.getByText("Token Address")).toBeVisible();
});
