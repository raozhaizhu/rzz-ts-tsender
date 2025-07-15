"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { formatEther, isAddress } from "viem";
import { useMemo } from "react";
import { calculateTotal } from "@/utils";

const AirDropFormSchemaClient = z.object({
    tokenAddress: z
        .string()
        .min(1, {
            message: "tokenAddress are required.",
        })
        .refine((val) => isAddress(val), { message: "Must be a valid Ethereum address" }),
    recipients: z.string().min(1, {
        message: "recipients are required.",
    }),
    amounts: z.string().min(1, {
        message: "amounts are required.",
    }),
});

export function AirDropForm() {
    const form = useForm<z.infer<typeof AirDropFormSchemaClient>>({
        resolver: zodResolver(AirDropFormSchemaClient),
        defaultValues: {
            tokenAddress: "",
            recipients: "",
            amounts: "",
        },
    });
    const { control } = form;
    const tokenAddress = useWatch({ control, name: "tokenAddress" });
    const amounts = useWatch({ control, name: "amounts" });
    const recipients = useWatch({ control, name: "recipients" });

    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
    const { isPending, writeContractAsync } = useWriteContract();

    const getApprovedAmount = async (tSenderAddress: string | null): Promise<number> => {
        if (!tSenderAddress) {
            toast("No address found, please use a supported chain");
            return 0;
        }

        const res = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress],
        });

        return res as number;
    };

    async function onSubmit(data: z.infer<typeof AirDropFormSchemaClient>) {
        toast("You submitted the following values", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 whitespace-pre-wrap">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });

        const tSenderAddress = chainsToTSender[chainId]["tsender"];
        console.log("*** tSenderAddress:", tSenderAddress, "***");

        const approvedAmount = await getApprovedAmount(tSenderAddress);
        console.log("*** approvedAmount:", approvedAmount, "***");

        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress, BigInt(total)],
            });
            console.log("*** approvalHash:", approvalHash, "***");

            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash,
            });
            console.log("*** approvalReceipt:", approvalReceipt, "***");
        } else {
            const res = await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipients
                        .split(/[\n,]+/)
                        .map((addr) => addr.trim())
                        .filter((addr) => addr !== ""),
                    amounts
                        .split(/[\n,]+/)
                        .map((amt) => amt.trim())
                        .filter((amt) => amt !== ""),
                    BigInt(total),
                ],
            });
            toast("Succeed! The hash is: ", {
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 whitespace-pre-wrap">
                        <code className="text-white">{JSON.stringify(res, null, 2)}</code>
                    </pre>
                ),
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">T-Sender</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        {/* tokenAddress */}
                        <FormField
                            control={form.control}
                            name="tokenAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Token Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0x" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* recipients */}
                        <FormField
                            control={form.control}
                            name="recipients"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipients</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0x123...,0x456..." {...field} className="h-32" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* amounts */}
                        <FormField
                            control={form.control}
                            name="amounts"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amounts</FormLabel>
                                    <FormControl>
                                        <Input placeholder="100,200,30..." {...field} className="h-32" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Card>
                            <CardHeader>
                                <CardTitle>Transaction Details</CardTitle>
                                <CardContent>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <div className="flex justify-between items-center">
                                            <p className=" text-black/50">Token Name:</p>
                                            <p className="font-mono">Mock Token</p>
                                        </div>
                                        <div className="flex justify-between items-center ">
                                            <p className=" text-black/50">Amount (wei):</p>
                                            <p className="font-mono">{total}</p>
                                        </div>
                                        <div className="flex justify-between items-center ">
                                            <p className=" text-black/50">Amount (tokens):</p>
                                            <p className="font-mono">{Number(formatEther(BigInt(total))).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </CardHeader>
                        </Card>
                        {/* submit-button */}
                        <Button type="submit" className="w-full">
                            {isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-md"></span>
                                    <span> Confirming in wallet...</span>
                                </>
                            ) : (
                                "Send Tokens"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default AirDropForm;
