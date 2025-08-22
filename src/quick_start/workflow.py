import asyncio

from cowsay import cowsay
from workflows import Workflow, step
from workflows.events import StartEvent, StopEvent
from workflows.server import WorkflowServer


class CowWorkflow(Workflow):
    """A dummy workflow! with only one step sending back the input given."""

    @step()
    async def run_step(self, ev: StartEvent) -> StopEvent:
        message = str(ev.get("message", ""))
        return StopEvent(result=cowsay("moo! " + message))


class DragonWorkflow(Workflow):
    """A dummy workflow! with only one step sending back the input given."""

    @step()
    async def run_step(self, ev: StartEvent) -> StopEvent:
        message = str(ev.get("message", ""))
        return StopEvent(result=cowsay(message + " BURNINATE!!!", cow="dragon"))


app = WorkflowServer()
app.add_workflow("cow", CowWorkflow(timeout=None))
app.add_workflow("dragon", DragonWorkflow(timeout=None))


if __name__ == "__main__":

    async def main():
        print(await CowWorkflow().run(message="Hello!"))

    asyncio.run(main())
