import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BannerManager from './banner-manager';
import PageEditor from './page-editor';
import NavigationEditor from './navigation-editor';

export default function CMSDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Content Management</h1>
            
            <Tabs defaultValue="banners">
                <TabsList>
                    <TabsTrigger value="banners">Banners</TabsTrigger>
                    <TabsTrigger value="pages">Pages</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                </TabsList>

                <TabsContent value="banners">
                    <BannerManager />
                </TabsContent>

                <TabsContent value="pages">
                    <PageEditor />
                </TabsContent>

                <TabsContent value="navigation">
                    <NavigationEditor />
                </TabsContent>
            </Tabs>
        </div>
    );
}