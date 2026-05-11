import { createFormationSubmit, deleteFormationSubmit } from "@/actions/formations";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type { Formation, PositionSlot } from "@/types";

type FormationRow = Formation & {
  position_slots: PositionSlot[];
};

export default async function FormationsPage() {
  const supabase = await createClient();
  const { data: formations = [], error } = await supabase
    .from("formations")
    .select("*, position_slots(*)")
    .order("is_default", { ascending: false })
    .order("name");

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Formations"
        description="Formation templates define the position slots used later when assigning period lineups."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Create custom formation</h2>
          <form action={createFormationSubmit} className="grid gap-3">
            <Input name="name" placeholder="Formation name, e.g. 4-2-3-1" required />
            <Textarea
              name="slots"
              defaultValue={"GK,50,90\nLB,15,70\nCB1,35,70\nCB2,65,70\nRB,85,70"}
            />
            <p className="text-xs leading-5 text-slate-400">
              Use one slot per line: position code, x coordinate, y coordinate. Coordinates run from 0 to 100.
            </p>
            <Button type="submit">Create formation</Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Formation list</h2>
          {error ? <p className="text-sm text-accent-red">{error.message}</p> : null}
          <div className="grid gap-4">
            {(formations as unknown as FormationRow[]).map((formation) => (
              <div key={formation.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{formation.name}</h3>
                    <p className="text-sm text-slate-400">{formation.position_slots.length} slots</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {formation.is_default ? <Badge tone="blue">Default</Badge> : null}
                    {!formation.is_default ? (
                      <form action={deleteFormationSubmit}>
                        <input type="hidden" name="id" value={formation.id} />
                        <Button type="submit" variant="danger" className="min-h-8 px-3 py-1">Delete</Button>
                      </form>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {formation.position_slots
                    .sort((a, b) => a.y - b.y || a.x - b.x)
                    .map((slot) => (
                      <span key={slot.id} className="rounded border border-slate-800 px-2 py-1 text-xs text-slate-300">
                        {slot.position_code} ({slot.x}, {slot.y})
                      </span>
                    ))}
                </div>
              </div>
            ))}
            {formations?.length === 0 ? <p className="text-sm text-slate-400">No formations found. Run the Supabase schema seed first.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
