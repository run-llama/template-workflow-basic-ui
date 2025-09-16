import { useState } from "react";
import { useWorkflowTask, useWorkflowTaskCreate } from "@llamaindex/ui";

export default function Home() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const createHandler = useWorkflowTaskCreate();
  return (
    <div className="aurora-container relative min-h-screen overflow-hidden bg-background text-foreground">
      <main className="relative mx-auto flex min-h-screen max-w-2xl px-6 flex-col gap-4 items-center justify-center">
        <div className="text-center mb-4 text-black/80 dark:text-white/80 text-lg">
          This is a basic starter app for LlamaDeploy. It's running a simple
          workflow on the backend, and vite with react on the frontend with
          llama-ui to call the workflow. Customize this app with your own
          workflow and UI.
        </div>
        <div className="flex flex-row gap-4 items-start justify-center w-full">
          {taskId ? (
            <HandlerOutput handlerId={taskId} />
          ) : (
            <Output>
              <span className="text-black/60 dark:text-white/60">
                Workflow result will show here.
              </span>
            </Output>
          )}
          <RunButton
            disabled={createHandler.isCreating}
            onClick={() =>
              createHandler
                .createTask("default", {
                  message: `${new Date().toLocaleTimeString()} PING`,
                })
                .then((task) => setTaskId(task.handler_id))
            }
          >
            <GreenDot />
            Run
          </RunButton>
        </div>
      </main>
    </div>
  );
}

const GreenDot = () => {
  return (
    <span className="mr-2 size-2 rounded-full bg-emerald-500/80 shadow-[0_0_20px_2px_rgba(16,185,129,0.35)] transition group-hover:bg-emerald-400/90"></span>
  );
};

function RunButton({
  disabled,
  children,
  onClick,
}: {
  disabled: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold shadow-sm backdrop-blur transition active:scale-[.99]
      border-black/10 bg-black/5 text-black hover:bg-black/10 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20
      dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:focus:ring-white/30 cursor-pointer"
    >
      {children}
    </button>
  );
}

function HandlerOutput({ handlerId }: { handlerId: string }) {
  // stream events and result from the workflow
  const taskData = useWorkflowTask(handlerId);

  // read workflow events here
  const pongs = taskData.events.filter((event) =>
    event.type.match(/PongEvent$/),
  ) as { type: string; data: { message: string } }[];
  const completed = taskData.events.find((event) =>
    event.type.match(/WorkflowCompletedEvent$/),
  ) as { type: string; data: { timestamp: string } } | undefined;

  return (
    <div className="flex flex-col gap-4 w-full min-h-60">
      <Output>{completed ? completed.data.timestamp : "Running... "}</Output>
      {pongs.map((pong, index) => (
        <span
          className="text-black/60 dark:text-white/60 text-sm m-0"
          key={pong.data.message}
          style={{
            animation: "fade-in-left 80ms ease-out both",
            willChange: "opacity, transform",
          }}
        >
          {pong.data.message}
        </span>
      ))}
    </div>
  );
}

function Output({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-live="polite"
      className="w-full rounded-xl border bg-black/5 p-4 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]
      border-black/10 dark:border-white/10 dark:bg-white/5"
    >
      <pre className="whitespace-pre-wrap break-words font-mono text-xs text-black/80 dark:text-white/80">
        {children}
      </pre>
    </div>
  );
}
