
import { cn } from "@/lib/utils";
import { Home, MapPin, Library, Lightbulb, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Map View", icon: MapPin, href: "/map" },
    { name: "Resources", icon: Library, href: "/resources" },
    { name: "Insights", icon: Lightbulb, href: "/insights" },
    { name: "Chat", icon: MessageSquare, href: "/chat" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r z-40 transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-4">
        <div className={cn(
          "relative flex items-center gap-2 glass rounded-lg px-3 py-2",
          !isOpen && "justify-center"
        )}>
          <Search className="h-5 w-5 text-muted-foreground" />
          {isOpen && (
            <input
              type="text"
              placeholder="Quick search..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          )}
        </div>
      </div>

      <nav className="px-2 py-4">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start mb-1",
              !isOpen && "justify-center",
              isActivePath(item.href) && "bg-primary/10 text-primary"
            )}
            asChild
          >
            <Link to={item.href}>
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-2">{item.name}</span>}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
