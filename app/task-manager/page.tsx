"use client";

import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React, { useEffect, useState } from 'react'
import { useGetProjects } from '@/hooks/project/use-get-projects'
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icon } from "@/components/ui-engineer/Icon";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";

export default function ListProject() {
  const [teamId, setTeamId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedTeamId = Cookies.get("IDTeam");
    if (storedTeamId) {
      setTeamId(storedTeamId);
    }
  }, []);
  
  const { projects, isLoading, error } = useGetProjects(teamId || "");

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
          title="Task Manager"
          showNewWorkspace={false}
          rightContent={
            <Button variant="outline" size="sm">
              New Project
            </Button>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {!teamId ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Vui lòng chọn một team để xem các dự án</p>
                  </div>
                ) : isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square">
                        <Card className="h-full">
                          <CardHeader>
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-20 w-full" />
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.IDProject}
                        className="aspect-square"
                      >
                        <Card className="h-full flex flex-col p-6 gap-0 relative">
                          <div className="absolute right-4 top-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                >
                                  <Icon
                                    name="setup-01-solid-standard"
                                    size={20}
                                    className="opacity-70 hover:opacity-100"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                >
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardHeader className="flex-none p-0 space-y-1.5 bg-gradient-to-r from-primary to-transparent bg-clip-text text-transparent">
                            <CardTitle className="text-xl font-semibold">
                              {project.ProjectName}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col flex-1 p-0">
                            <div>
                              <CardDescription className="text-sm font-medium">
                                Project Details
                              </CardDescription>
                              <div className="mt-2 h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
                                <p className="text-sm text-muted-foreground">
                                  {project.ProjectDescription}
                                </p>
                              </div>
                            </div>
                            <div className="mt-auto pt-4 border-t">
                              <Link
                                href={`/task-manager/projects/${project.IDProject}`}
                              >
                                <Button
                                  className="w-full"
                                  variant="outline"
                                >
                                  Open
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
