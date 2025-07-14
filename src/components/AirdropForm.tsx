"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useAccount, useChainId, useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { isAddress } from "viem";
import { useMemo } from "react";
import { calculateTotal } from "@/utils/calculateTotal/calculateTotal";

const AirDropFormSchemaClient = z.object({
    tokenAddress: z
        .string()
        .min(1, {
            message: "tokenAddress is required.",
        })
        .refine((val) => isAddress(val), { message: "Must be a valid Ethereum address" }),
    recipients: z
        .string()
        .min(1, {
            message: "recipients is required.",
        })
        .refine((val) => isAddress(val), { message: "Must be a valid Ethereum address" }),
    amounts: z.string().min(1, {
        message: "amounts is required.",
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

    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);

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
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });

        const tSenderAddress = chainsToTSender[chainId]["tsender"];
        console.log("*** tSenderAddress:", tSenderAddress, "***");

        const approvedAmount = await getApprovedAmount(tSenderAddress);
        console.log("*** approvedAmount:", approvedAmount, "***");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>T-Sender</CardTitle>
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
                        <Button type="submit" className="w-full">
                            Send Tokens
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default AirDropForm;
