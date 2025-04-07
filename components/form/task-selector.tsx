"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Tag, Clock, CheckCircle, CircleDot, Bug, FileText, Code, Palette, Lightbulb, Settings, Shield, Star, Zap, User2, Flag } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TaskSelectorProps {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}

export function TaskSelector({
  value,
  onValueChange,
  options,
  placeholder,
}: TaskSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Hàm lấy icon dựa trên giá trị
  const getIcon = (value: string) => {
    // Loại bỏ các option có value là "limit", "reviewer", "target"
    if (value === "limit" || value === "reviewer" || value === "target") {
      return null;
    }

    // Icon cho Priority
    if (placeholder.toLowerCase().includes("priority")) {
      switch (value.toLowerCase()) {
        case "urgent":
          return <Flag className="mr-2 h-4 w-4 text-red-500" />;
        case "high":
          return <Flag className="mr-2 h-4 w-4 text-orange-500" />;
        case "medium":
          return <Flag className="mr-2 h-4 w-4 text-yellow-500" />;
        case "low":
          return <Flag className="mr-2 h-4 w-4 text-blue-500" />;
        default:
          return <Flag className="mr-2 h-4 w-4 text-gray-500" />;
      }
    }

    // Icon cho Assignee
    if (placeholder.toLowerCase().includes("assignee")) {
      return <User2 className="mr-2 h-4 w-4 text-blue-500" />;
    }

    // Đổi "task type" thành "tag" và thêm màu cho các tag
    if (placeholder.toLowerCase().includes("task type")) {
      switch (value.toLowerCase()) {
        case "bug":
          return <Bug className="mr-2 h-4 w-4 text-red-500" />;
        case "feature":
          return <Star className="mr-2 h-4 w-4 text-yellow-500" />;
        case "documentation":
          return <FileText className="mr-2 h-4 w-4 text-blue-500" />;
        case "enhancement":
          return <Zap className="mr-2 h-4 w-4 text-purple-500" />;
        case "design":
          return <Palette className="mr-2 h-4 w-4 text-pink-500" />;
        case "development":
          return <Code className="mr-2 h-4 w-4 text-green-500" />;
        case "idea":
          return <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />;
        case "security":
          return <Shield className="mr-2 h-4 w-4 text-indigo-500" />;
        case "maintenance":
          return <Settings className="mr-2 h-4 w-4 text-gray-500" />;
        default:
          return <Tag className="mr-2 h-4 w-4 text-blue-500" />;
      }
    }

    // Icon cho các status
    if (placeholder.toLowerCase().includes("status")) {
      switch (value.toLowerCase()) {
        case "todo":
          return <Clock className="mr-2 h-4 w-4 text-yellow-500" />;
        case "in progress":
          return <CircleDot className="mr-2 h-4 w-4 text-blue-500" />;
        case "in review":
          return <FileText className="mr-2 h-4 w-4 text-purple-500" />;
        case "done":
          return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
        default:
          return null;
      }
    }

    return null;
  };

  // Lọc bỏ các option có value là "limit", "reviewer", "target"
  const filteredOptions = options.filter(
    option => !["limit", "reviewer", "target"].includes(option.value)
  );

  // Đổi placeholder từ "task type" thành "tag"
  const displayPlaceholder = placeholder.toLowerCase().includes("task type") 
    ? placeholder.replace(/task type/i, "tag") 
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? (
              <div className="flex items-center">
                {getIcon(value)}
                {filteredOptions.find((option) => option.value === value)?.label}
              </div>
            )
            : displayPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[200px] p-0 z-[60]" 
        align="start"
        sideOffset={5}
      >
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={`Search ${displayPlaceholder.toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            <CommandGroup>
              {filteredOptions
                .filter((option) =>
                  option.label.toLowerCase().includes(search.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onValueChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center">
                      {getIcon(option.value)}
                      {option.label}
                    </div>
                    {value === option.value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 