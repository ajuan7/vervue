"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const ROLES = ["Software Engineer", "Product Manager", "Data Analyst", "Cyber Security"];

// Handling UI highlighting for selected role. No proper logic involved
export function RoleSelector({ onSelect }: { onSelect: (role: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Choose a role</h2>

      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <Button
            key={role}
            variant={selected === role ? "default" : "outline"}
            onClick={() => {
              setSelected(role);
              onSelect(role);
            }}
          >
            {role}
          </Button>
        ))}
      </div>
    </div>
  );
}
