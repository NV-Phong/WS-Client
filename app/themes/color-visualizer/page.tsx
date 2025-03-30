"use client"
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Copy, Download, Palette } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface ColorVariable {
  name: string;
  value: string;
}

export default function Themes() {
  const { theme, setTheme } = useTheme();
  const [cssInput, setCssInput] = useState("");
  const [colorVariables, setColorVariables] = useState<ColorVariable[]>([]);
  const [selectedTheme, setSelectedTheme] = useState(theme || "light");

  useEffect(() => {
    setSelectedTheme(theme || "light");
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  const parseCSS = (css: string) => {
    const variables = Array.from(css.matchAll(/--([^:]+):\s*([^;]+);/g))
      .map(match => ({
        name: match[1].trim(),
        value: match[2].trim(),
      }));
    setColorVariables(variables);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard!");
  };

  const exportCSS = () => {
    const css = `:root {\n${colorVariables.map(v => `  --${v.name}: ${v.value};`).join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    toast.success("Đã sao chép CSS vào clipboard!");
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl bg-background w-full">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              CSS Color Visualizer
            </h1>
            <p className="text-muted-foreground mt-2">
              Phân tích và quản lý biến màu CSS của bạn
            </p>
          </div>
          <Tabs 
            value={selectedTheme} 
            className="w-[300px]" 
            onValueChange={handleThemeChange}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
              <TabsTrigger value="pastel-pink">Pastel Pink</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-lg">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="css-input" className="text-lg font-semibold">CSS Variables</Label>
                  <Button variant="outline" size="sm" onClick={exportCSS} className="gap-2">
                    <Download className="h-4 w-4" />
                    Xuất CSS
                  </Button>
                </div>
                <Textarea
                  id="css-input"
                  placeholder="Nhập CSS variables vào đây..."
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  className="h-[500px] font-mono text-sm resize-none"
                />
              </div>
              <Button onClick={() => parseCSS(cssInput)} className="w-full gap-2">
                <Palette className="h-4 w-4" />
                Phân tích màu sắc
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Kết quả phân tích</h2>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {colorVariables.length} biến màu
                </span>
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid grid-cols-1 gap-4">
                  {colorVariables.map((variable, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <div
                            className="w-16 h-16 rounded-lg border shadow-sm"
                            style={{ backgroundColor: variable.value }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(variable.value)}
                              className="text-white hover:bg-white/20"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="font-mono text-sm font-medium">{variable.name}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {variable.value}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
