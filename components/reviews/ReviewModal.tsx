"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

type Item = {
  medicineId?: string;
  quantity: number;
  medicine?: { id: string; name: string };
};

export default function ReviewModal({
  open,
  onOpenChange,
  orderId,
  item,
  onDone,
  alreadyReviewed,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orderId: string;
  item: Item | null;
  onDone: () => void;
  alreadyReviewed: boolean;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const medicineId = useMemo(() => {
    if (!item) return "";
    return item.medicineId ?? item.medicine?.id ?? "";
  }, [item]);

  const medicineName = item?.medicine?.name ?? "Medicine";

  const submit = async () => {
    if (!medicineId) return alert("Medicine id missing");
    if (!comment.trim()) return alert("Comment লিখো");
    if (rating < 1 || rating > 5) return alert("Rating 1-5 হতে হবে");

    setBusy(true);
    try {
      
      await api("/reviews", {
        method: "POST",
        body: {
          medicineId,
          orderId,
          rating,
          comment: comment.trim(),
        },
      });

      onOpenChange(false);
      setComment("");
      setRating(5);
      onDone();
    } catch (e: any) {
      alert(e?.message || "Review submit failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-slate-300">
        <DialogHeader>
          <DialogTitle>Review: {medicineName}</DialogTitle>
        </DialogHeader>

        {alreadyReviewed ? (
          <div className="p-3 text-sm border rounded-lg bg-muted/30">
           <p>You have already review this medicine!</p>
          </div>
        ) : (
          <>
            {/* rating */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Rating</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const v = idx + 1;
                  const active = v <= rating;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRating(v)}
                      className="p-1"
                      aria-label={`rate ${v}`}
                    >
                      <Star className={`h-5 w-5 ${active ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                    </button>
                  );
                })}
                <span className="ml-2 text-xs opacity-70">{rating}/5</span>
              </div>
            </div>

            {/* comment */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Comment</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="“Share your experience — how was the medicine quality, delivery time, or packaging?”
"
                className="min-h-[110px]"
              />
              <p className="text-xs opacity-70">Tip: 10-200 characters .</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={busy}>
                {busy ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
