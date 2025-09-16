import asyncio
import time

from workflows import Context, Workflow, step
from workflows.events import StartEvent, StopEvent, Event
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class PingEvent(StartEvent):
    message: str


class PongEvent(Event):
    message: str


class WorkflowCompletedEvent(StopEvent):
    timestamp: str


class DefaultWorkflow(Workflow):
    @step
    async def start(self, event: PingEvent, context: Context) -> WorkflowCompletedEvent:
        start = time.monotonic()
        logger.info(f"Received message: {event.message}")
        for i in range(5):
            logger.info(f"Processing message: {event.message} {i}")
            elapsed = (time.monotonic() - start) * 1000
            context.write_event_to_stream(
                PongEvent(message=f"+{elapsed:.0f}ms PONG {i + 1}/5 ")
            )
            await asyncio.sleep(0.2)
        return WorkflowCompletedEvent(
            timestamp="workflow completed at "
            + datetime.now().isoformat(timespec="seconds")
        )


workflow = DefaultWorkflow()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    async def main():
        print(await DefaultWorkflow().run(message="Hello!"))

    asyncio.run(main())
