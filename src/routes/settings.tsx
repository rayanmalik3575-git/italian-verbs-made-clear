import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { resetProgress, useProgress } from "@/lib/progress";
import { PageHeader, Panel, btn } from "@/components/app-shell";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Parlami Italian" },
      { name: "description", content: "Manage your Parlami learning data." },
      { property: "og:title", content: "Settings — Parlami" },
      { property: "og:description", content: "Manage your Parlami learning data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const progress = useProgress();
  const [done, setDone] = useState(false);
  const count = Object.keys(progress).length;
  return (
    <div className="space-y-5">
      <PageHeader title="Settings" />
      <Panel>
        <h2 className="font-bold">Account</h2>
        <p className="mt-1 text-muted-foreground">Accounts aren't available yet. Your progress is saved in this browser only, so it won't follow you to another device.</p>
      </Panel>
      <Panel>
        <h2 className="font-bold">Learning data</h2>
        <p className="mt-1 text-muted-foreground">{count === 0 ? "No saved practice results." : `Saved results for ${count} verb${count === 1 ? "" : "s"}.`}</p>
        <AlertDialog>
          <AlertDialogTrigger disabled={count === 0} className={`${btn.outline} mt-4 text-destructive disabled:opacity-50`}><Trash2 className="h-4 w-4" /> Reset progress</AlertDialogTrigger>
          <AlertDialogContent className="rounded-[20px]">
            <AlertDialogHeader><AlertDialogTitle>Reset all progress?</AlertDialogTitle><AlertDialogDescription>This deletes every saved practice result in this browser. It can't be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel><AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { resetProgress(); setDone(true); }}>Reset</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {done && <p role="status" className="mt-3 text-sm text-success">Progress cleared.</p>}
      </Panel>
    </div>
  );
}
