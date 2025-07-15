"use client";

import AirDropForm from "./airdrop-form";
import { useAccount } from "wagmi";
import SpringMotion from "./spring-motion";

const HomeContent = () => {
    const { isConnected } = useAccount();
    return (
        <>
            {isConnected ? (
                <AirDropForm />
            ) : (
                <SpringMotion>
                    <div
                        className="min-h-[calc(100vh-128px)] flex justify-center items-center
                text-2xl lg:text-4xl font-mono font-bold
                "
                    >
                        Please connect a wallet... 💡
                    </div>
                </SpringMotion>
            )}
        </>
    );
};
export default HomeContent;
