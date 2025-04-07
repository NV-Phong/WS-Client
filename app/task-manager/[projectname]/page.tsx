"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deslugifyProjectName } from '@/lib/utils';

export default function Project() {
  const params = useParams();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const slugifiedName = params.projectname as string;

  useEffect(() => {
    const storedProjectId = Cookies.get("IDProject");
    const storedProjectName = Cookies.get("ProjectName");
    if (storedProjectId) {
      setProjectId(storedProjectId);
    }
    if (storedProjectName) {
      setProjectName(storedProjectName);
    } else {
      // Fallback to deslugify if cookie is not available
      setProjectName(deslugifyProjectName(slugifiedName));
    }
  }, [slugifiedName]);

  const handleBackToProjects = () => {
    router.push('/task-manager');
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader 
          title={`PROJECT • ${projectName}`}
          showNewWorkspace={false}
          rightContent={
            <Button variant="outline" size="sm" onClick={handleBackToProjects}>
              Back to Projects
            </Button>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {!projectId ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Không tìm thấy thông tin dự án</p>
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Project ID: {projectId}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Project Name: {projectName}</p>
                      <p>Project ID from Cookie: {projectId}</p>
                      <p>URL Slug: {slugifiedName}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
