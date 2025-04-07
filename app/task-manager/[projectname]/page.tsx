"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from "@/components/ui/button";
import { deslugifyProjectName } from '@/lib/utils';
import { DataTable } from '@/components/data-table';
import data from '../data.json';

export default function Project() {
  const params = useParams();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const slugifiedName = params.projectname as string;
  const isInitialized = useRef(false);

  useEffect(() => {
    // Chỉ chạy một lần khi component mount
    if (!isInitialized.current) {
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
      
      isInitialized.current = true;
    }
  }, [slugifiedName]);

  const handleBackToProjects = () => {
    router.push('/task-manager');
  };

  // Sử dụng projectId để tạo một key duy nhất cho DataTable
  const tableKey = projectId ? `project-${projectId}` : 'default-project';

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
              <DataTable key={tableKey} data={data} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
