import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Banner {
    id: string;
    title: string;
    image: string;
    link: string;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
}

export default function BannerManager() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    const handleBannerSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Implementation for saving banner
    };

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banners.map((banner) => (
                            <TableRow key={banner.id}>
                                <TableCell>
                                    <img 
                                        src={banner.image} 
                                        alt={banner.title}
                                        className="w-20 h-12 object-cover rounded"
                                    />
                                </TableCell>
                                <TableCell>{banner.title}</TableCell>
                                <TableCell>
                                    <Switch checked={banner.isActive} />
                                </TableCell>
                                <TableCell>
                                    {banner.startDate.toLocaleDateString()} - 
                                    {banner.endDate.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedBanner(banner)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {selectedBanner ? 'Edit Banner' : 'Add New Banner'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleBannerSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Banner Title</Label>
                            <Input id="title" />
                        </div>

                        <div className="space-y-2">
                            <Label>Banner Image</Label>
                            <ImageUpload 
                                onUpload={(url) => console.log(url)}
                                maxSize={2} // MB
                                aspectRatio={16/9}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link">Link URL</Label>
                            <Input id="link" type="url" />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="active" />
                            <Label htmlFor="active">Active</Label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="date" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            {selectedBanner ? 'Update Banner' : 'Add Banner'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}