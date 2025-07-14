"use client";

import { FaGithub } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <header className="navbar bg-base-100 shadow-sm px-4">
            <div className="flex-none flex items-center gap-2 md:gap-4">
                <Image src="/logo.png" alt="icon" width={24} height={24} />
                <p className="md:block font-sans font-bold text-sm md:text-md lg:text-lg">RzzTSender</p>
                <Link href="https://github.com/raozhaizhu/rzz-ts-tsender" target="_blank">
                    <FaGithub size={24} />
                </Link>
            </div>
            <div className="flex-1"></div>
            <div className="flex-none">
                <ConnectButton />
            </div>
        </header>
    );
};
export default Header;
