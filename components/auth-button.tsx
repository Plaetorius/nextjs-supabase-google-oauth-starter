import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/action";

export async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">
        {user.email}
      </span>
      <form action={signOut}>
        <Button type="submit" size="sm" variant="outline">
          Sign Out
        </Button>
      </form>
    </div>
  );
}
