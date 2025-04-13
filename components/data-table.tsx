"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { useGetStatuses } from "@/hooks/status/use-get-statuses"
import { useGetTasks } from "@/hooks/task/use-get-tasks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CreateTaskPopover } from '@/components/form/create-task';

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
  description: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Task Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="w-64 truncate" title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Priority",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: "Project",
    cell: ({ row }) => (
      <div className="w-32 truncate" title={row.original.target}>
        {row.original.target}
      </div>
    ),
  },
  {
    accessorKey: "limit",
    header: "Created At",
    cell: ({ row }) => (
      <div className="w-32 truncate" title={row.original.limit}>
        {row.original.limit}
      </div>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Assignee",
    cell: ({ row }) => (
      <div className="w-32 truncate" title={row.original.reviewer}>
        {row.original.reviewer}
      </div>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 hover:bg-transparent">
            <IconDotsVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// Thêm component KanbanCard
function KanbanCard({ item, isDraggingOver }: { item: z.infer<typeof schema>; isDraggingOver?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  // Xác định màu dựa trên loại
  // const getTypeColor = (type: string) => {
  //   switch (type.toLowerCase()) {
  //     case 'technical content':
  //       return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  //     case 'narrative':
  //       return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  //     case 'legal':
  //       return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  //     case 'visual':
  //       return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  //     case 'research':
  //       return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
  //     case 'planning':
  //       return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
  //     case 'financial':
  //       return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  //   }
  // };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-background rounded-lg border shadow-sm p-3 mb-3 ${isDraggingOver ? 'opacity-50' : ''}`}
    >
      <h3 className="font-medium mb-2 truncate text-base">{item.header}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 h-10 overflow-hidden">{item.description}</p>
      <div className="flex justify-between items-center text-xs text-muted-foreground pt-1 border-t border-muted">
        <span className="truncate">{item.reviewer}</span>
        <Badge variant="outline" className="text-xs px-2">{item.type}</Badge>
      </div>
    </div>
  )
}

// Thêm component KanbanColumn
function KanbanColumn({ status, items }: { status: string; items: z.infer<typeof schema>[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const getColumnStyle = (status: string) => {
    switch (status) {
      case "To Do":
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-800/20",
          borderColor: "border-gray-100 dark:border-gray-700",
          icon: <IconLayoutColumns className="h-4 w-4" />,
          headerBg: "bg-gray-100/50 dark:bg-gray-800/40"
        };
      case "In Progress":
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/10",
          borderColor: "border-blue-100 dark:border-blue-800",
          icon: <IconLoader className="h-4 w-4 animate-spin" />,
          headerBg: "bg-blue-100/50 dark:bg-blue-900/20"
        };
      case "In Review":
        return {
          color: "text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-900/10",
          borderColor: "border-amber-100 dark:border-amber-800",
          icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.45801 14.02C2.71201 13.44 2.83901 13.15 2.97101 12.87C3.54101 11.55 3.82601 10.89 3.97101 10.21C4.13901 9.42 4.13901 8.58 3.97101 7.79C3.82601 7.11 3.54101 6.45 2.97101 5.13C2.83901 4.85 2.71201 4.56 2.45801 3.98C2.13901 3.27 1.97901 2.91 1.83901 2.77C1.69901 2.63 1.33901 2.47 0.629013 2.15L0.359013 2C0.129013 1.88 0.0140132 1.82 0.0140132 1.76C0.0140132 1.7 0.129013 1.64 0.359013 1.52L0.629013 1.37C1.33901 1.05 1.69901 0.89 1.83901 0.75C1.97901 0.61 2.13901 0.45 2.45801 0.74C2.71201 1.32 2.83901 1.61 2.97101 1.89C3.54101 3.21 3.82601 3.87 3.97101 4.55C4.13901 5.34 4.13901 6.18 3.97101 6.97C3.82601 7.65 3.54101 8.31 2.97101 9.63C2.83901 9.91 2.71201 10.2 2.45801 10.78C2.13901 11.49 1.97901 11.85 1.83901 11.99C1.69901 12.13 1.33901 12.29 0.629013 12.61L0.359013 12.76C0.129013 12.88 0.0140132 12.94 0.0140132 13C0.0140132 13.06 0.129013 13.12 0.359013 13.24L0.629013 13.39C1.33901 13.71 1.69901 13.87 1.83901 14.01C1.97901 14.15 2.13901 14.31 2.45801 14.02Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>,
          headerBg: "bg-amber-100/50 dark:bg-amber-900/20"
        };
      case "Done":
        return {
          color: "text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/10",
          borderColor: "border-green-100 dark:border-green-800",
          icon: <IconCircleCheckFilled className="h-4 w-4" />,
          headerBg: "bg-green-100/50 dark:bg-green-900/20"
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-800/20",
          borderColor: "border-gray-100 dark:border-gray-700",
          icon: <IconLayoutColumns className="h-4 w-4" />,
          headerBg: "bg-gray-100/50 dark:bg-gray-800/40"
        };
    }
  };

  const columnStyle = getColumnStyle(status);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{status}</h3>
        <span className="text-sm text-muted-foreground">{items.length}</span>
      </div>
      <div 
        ref={setNodeRef} 
        className={`flex flex-col gap-3 min-h-[300px] max-h-[500px] overflow-y-auto p-3 rounded-lg transition-colors duration-200 border ${columnStyle.borderColor} ${
          isOver ? 'bg-[var(--selection)]/10 ring-2 ring-[var(--selection)]' : columnStyle.bgColor
        }`}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <svg className="h-8 w-8 opacity-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12.2H15" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 16.2H12.38" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No tasks</p>
            <CreateTaskPopover>
              <Button variant="outline" size="sm" className="mt-2">
                <IconPlus className="h-3 w-3 mr-1" />
                New task
              </Button>
            </CreateTaskPopover>
          </div>
        ) : (
          items.map((item) => (
            <KanbanCard 
              key={item.id} 
              item={item} 
              isDraggingOver={isOver}
            />
          ))
        )}
      </div>
    </div>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(initialData)
  const { tasks } = useGetTasks()

  React.useEffect(() => {
    if (tasks.length > 0) {
      // Map the task data to match the schema expected by the table
      const mappedData = tasks.map(task => ({
        id: Number(task.IDTask),
        header: task.TaskName,
        type: task.project?.ProjectName || 'Unknown',
        status: task.status?.Status || 'Unknown',
        target: task.StartDay || 'Not set',
        limit: task.EndDay || 'Not set',
        reviewer: task.assignee || 'Unassigned',
        description: task.TaskDescription || 'No description',
      }));
      setData(mappedData);
    }
  }, [tasks]);

  const { statuses, isLoading: statusesLoading } = useGetStatuses();
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  
  // Cấu hình cảm biến kéo thả
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Khoảng cách tối thiểu để bắt đầu kéo
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // Độ trễ để bắt đầu kéo trên thiết bị cảm ứng
      tolerance: 5, // Khoảng cách tối thiểu để bắt đầu kéo
    },
  })
  const keyboardSensor = useSensor(KeyboardSensor)
  const sensors: ReturnType<typeof useSensors> = useSensors(mouseSensor, touchSensor, keyboardSensor)

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
    setIsDragging(true)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id && !isUpdating) {
      setIsUpdating(true)
      
      if (typeof over.id === 'string' && statuses.some(status => status.Status === over.id)) {
        // Cập nhật status khi kéo vào cột mới
        const newStatus = over.id as string;
        setData((prevData) =>
          prevData.map((item) =>
            item.id === active.id ? { ...item, status: newStatus } : item
          )
        )
      } else {
        // Sắp xếp lại thứ tự trong cùng một cột
        setData((prevData) => {
          const oldIndex = dataIds.indexOf(active.id)
          const newIndex = dataIds.indexOf(over.id)
          return arrayMove(prevData, oldIndex, newIndex)
        })
      }
      
      // Reset trạng thái sau khi cập nhật
      setTimeout(() => {
        setIsUpdating(false)
      }, 100)
    }
    
    setActiveId(null)
    setIsDragging(false)
  }

  // Cấu hình hiệu ứng thả
  const dropAnimation = {
    ...defaultDropAnimation,
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  }

  // Sử dụng isDragging để thêm class cho container
  const containerClassName = isDragging ? 'cursor-grabbing' : 'cursor-default';

  return (
    <Tabs
      defaultValue="kanban"
      className={`w-full flex-col justify-start gap-6 ${containerClassName}`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="list">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="kanban">Kanban Board</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="list"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="kanban"
        className="flex flex-col gap-4 px-4 lg:px-6"
      >
        {statusesLoading ? (
          <div className="flex items-center justify-center p-8">
            <IconLoader className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
            autoScroll={true}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statuses.map((status) => (
                <KanbanColumn
                  key={status.IDStatus}
                  status={status.Status}
                  items={data.filter((item) => item.status === status.Status)}
                />
              ))}
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
              {activeId ? (
                <KanbanCard
                  item={data.find((item) => item.id === activeId)!}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </TabsContent>
    </Tabs>
  )
}

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--primary)",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "var(--primary)",
//   },
// } satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  // const { statuses } = useGetStatuses();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-1 py-1.5">
        <span className="truncate font-medium" title={item.header}>
          {item.header}
        </span>
        <span className="truncate text-sm text-muted-foreground" title={item.description}>
          {item.description}
        </span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{item.target}</span>
          <span>&bull;</span>
          <span>{item.reviewer}</span>
        </div>
      </div>
    )
  }

  return (
    <span className="truncate font-medium" title={item.header}>
      {item.header}
    </span>
  )
}
