import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, AlertTriangle } from "lucide-react";

interface Props {
  onResult: (text: string) => void;
  onError?: (err: string) => void;
  timeoutMs?: number;
}

export function QRScanner({ onResult, onError, timeoutMs = 30000 }: Props) {
  const elId = "qr-reader-region";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<"loading" | "scanning" | "denied" | "timeout" | "error">("loading");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let stopped = false;
    let timer: number | undefined;
    const scanner = new Html5Qrcode(elId);
    scannerRef.current = scanner;

    const start = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (stopped) return;
            stopped = true;
            scanner.stop().catch(() => {});
            onResult(decoded);
          },
          () => {}
        );
        setStatus("scanning");
        timer = window.setTimeout(() => {
          if (stopped) return;
          stopped = true;
          scanner.stop().catch(() => {});
          setStatus("timeout");
          onError?.("Scanner timeout — please try again.");
        }, timeoutMs);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Camera error";
        setErrMsg(msg);
        if (/permission|denied|notallowed/i.test(msg)) {
          setStatus("denied");
          onError?.("Camera permission denied.");
        } else {
          setStatus("error");
          onError?.(msg);
        }
      }
    };
    start();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      scanner.stop().catch(() => {});
      try { scanner.clear(); } catch {}
    };
  }, [onResult, onError, timeoutMs]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black">
        <div id={elId} className="aspect-square w-full" />
        {status === "scanning" && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-60 w-60 rounded-xl border-2 border-primary/60 shadow-glow" />
          </div>
        )}
        {status === "loading" && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <Camera className="h-8 w-8 animate-pulse" />
          </div>
        )}
      </div>
      {(status === "denied" || status === "error" || status === "timeout") && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            {status === "denied" && "Camera permission denied. Please enable it in your browser settings."}
            {status === "timeout" && "Scanner timed out. Try refreshing and scanning again."}
            {status === "error" && (errMsg || "Camera could not be opened.")}
          </div>
        </div>
      )}
    </div>
  );
}