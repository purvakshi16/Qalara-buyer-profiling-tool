import { LogOut, Plus, Users } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button, SecondaryButton } from "./ui";

export function AppShell() {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-clay-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/buyers" className="flex items-center gap-3 font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-clay-500 text-white">Q</span>
            <span>Buyer Profiling</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/buyers">
              <SecondaryButton><Users size={16} /> Buyers</SecondaryButton>
            </Link>
            <Link to="/buyers/new">
              <Button><Plus size={16} /> New Profile</Button>
            </Link>
            <SecondaryButton onClick={logout}><LogOut size={16} /> Sign out</SecondaryButton>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
