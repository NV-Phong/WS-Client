import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

/**
 * Chuyển đổi tên project thành định dạng URL-friendly
 * Ví dụ: "Nguyễn Văn Phong" -> "nguyen-van-phong"
 * @param name Tên project cần chuyển đổi
 * @returns Tên project đã được chuyển đổi thành định dạng URL-friendly
 */
export function slugifyProjectName(name: string = ''): string {
  // Chuyển đổi các ký tự tiếng Việt thành không dấu
  const withoutAccents = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  
  // Thay thế các ký tự đặc biệt và khoảng trắng bằng dấu gạch ngang
  return withoutAccents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Chuyển đổi tên project từ định dạng URL-friendly trở lại định dạng gốc
 * Ví dụ: "nguyen-van-phong" -> "Nguyen Van Phong"
 * @param slug Tên project ở định dạng URL-friendly
 * @returns Tên project đã được chuyển đổi trở lại định dạng gốc
 */
export function deslugifyProjectName(slug: string): string {
  // Chuyển đổi dấu gạch ngang thành khoảng trắng và viết hoa chữ cái đầu
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
