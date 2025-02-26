
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-primary">Hamilton Health Hub</h1>
        </div>
        
        <Tabs defaultValue="dashboard" className="hidden md:block">
          <TabsList className="grid grid-cols-5 w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">EN</Button>
          <Button variant="ghost" size="sm">Help</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
