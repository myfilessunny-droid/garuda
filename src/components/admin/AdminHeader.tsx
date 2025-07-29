import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  loginTime: string;
};

interface AdminHeaderProps {
  adminUser: AdminUser;
  onLogout: () => void;
}

const AdminHeader = ({ adminUser, onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main
          </button>
          <div>
            <h1 className="text-xl font-semibold text-primary">
              Garuda Dhruvam Foundation
            </h1>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{adminUser.email}</p>
            <p className="text-xs text-muted-foreground">{adminUser.role}</p>
          </div>
          
          <Avatar>
            <AvatarFallback className="bg-primary text-white">
              {adminUser.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;