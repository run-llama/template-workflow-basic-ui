import { useEffect, useState } from "react";
import { useWorkflow, useHandler } from "@llamaindex/ui";

export default function Home() {
  const [handlerId, setHandlerId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const workflow = useWorkflow("default");
  const handler = useHandler(handlerId);

  async function handleRunWorkflow() {
    setIsCreating(true);
    try {
      const h = await workflow.createHandler({});
      setHandlerId(h.handler_id);
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    if (!handlerId) return;
    const subscription = handler.subscribeToEvents({
      onData: (event) => {
        // handle stream events here
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [handler.state.handler_id]);

  // final result available here, as well as error status, etc.
  const result = handler.state.result?.data?.result as string | undefined;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl text-center text-black/80 dark:text-white/80 flex flex-col gap-4">
        <p className="text-lg">
          This is a minimal UI starter. Click the button to run the backend
          workflow and display its result.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={isCreating}
            onClick={handleRunWorkflow}
            className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold shadow-sm border-black/10 bg-black/5 text-black hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            Run Workflow
          </button>
        </div>
        <div className="text-sm">
          {handlerId && (
            <div>
              Handler: <code>{handlerId}</code>
            </div>
          )}
          {handlerId && (
            <div className="mt-1">
              Status: <code>{handler.state.status}</code>
            </div>
          )}
          {result && (
            <div className="mt-2">
              Result: <code>{result}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
