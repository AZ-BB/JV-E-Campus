import { cn } from "@/utils/cn";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export default function Breadcrumb({ 
  items, 
  className,
  separator = <ChevronRight className="w-4 h-4 text-admin-textMuted" />
}: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      className={cn("flex items-center space-x-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Item */}
              {isLast ? (
                <span 
                  className="text-admin-text font-medium truncate max-w-[200px]"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <BreadcrumbLink item={item} />
              )}
              
              {/* Separator */}
              {!isLast && (
                <span className="flex items-center" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function BreadcrumbLink({ item }: { item: BreadcrumbItem }) {
  const linkClasses = "text-admin-textMuted hover:text-admin-primary transition-colors duration-200 truncate max-w-[200px] cursor-pointer";
  
  if (item.href) {
    return (
      <Link 
        href={item.href} 
        className={linkClasses}
        title={item.label}
      >
        {item.label}
      </Link>
    );
  }
  
  if (item.onClick) {
    return (
      <button
        onClick={item.onClick}
        className={linkClasses}
        title={item.label}
      >
        {item.label}
      </button>
    );
  }
  
  // Fallback for items without href or onClick
  return (
    <span 
      className="text-admin-textMuted truncate max-w-[200px]"
      title={item.label}
    >
      {item.label}
    </span>
  );
} 