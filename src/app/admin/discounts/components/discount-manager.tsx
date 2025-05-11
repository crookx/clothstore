import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const discountSchema = z.object({
    code: z.string().min(3),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0),
    minPurchase: z.number().min(0),
    maxUses: z.number().min(1),
    startDate: z.date(),
    endDate: z.date(),
    isActive: z.boolean(),
    products: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional()
});

export default function DiscountManager() {
    const [discounts, setDiscounts] = useState([]);
    const form = useForm<z.infer<typeof discountSchema>>({
        resolver: zodResolver(discountSchema)
    });

    const onSubmit = async (data: z.infer<typeof discountSchema>) => {
        // Implementation for saving discount
    };

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Valid Until</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discounts.map((discount: any) => (
                            <TableRow key={discount.id}>
                                <TableCell>{discount.code}</TableCell>
                                <TableCell>{discount.type}</TableCell>
                                <TableCell>
                                    {discount.type === 'percentage' 
                                        ? `${discount.value}%` 
                                        : `$${discount.value}`}
                                </TableCell>
                                <TableCell>
                                    {discount.usedCount}/{discount.maxUses}
                                </TableCell>
                                <TableCell>
                                    {new Date(discount.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Switch checked={discount.isActive} />
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Create Discount
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}