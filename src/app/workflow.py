import asyncio

from workflows import Context, Workflow, step
from workflows.events import StartEvent, StopEvent
import logging

logger = logging.getLogger(__name__)


class PingEvent(StartEvent):
    message: str


class PongEvent(StopEvent):
    message: str


class DefaultWorkflow(Workflow):
    @step
    async def start(self, event: PingEvent, context: Context) -> PongEvent:
        logger.info(f"Received message: {event.message}")
        return PongEvent(message=f"PONG for '{event.message}'")


workflow = DefaultWorkflow()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    async def main():
        print(await DefaultWorkflow().run(message="Hello!"))

    asyncio.run(main())
