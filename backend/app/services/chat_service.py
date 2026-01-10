import asyncio
from typing import AsyncGenerator
from app.schemas.chat import ChatMode

class ChatService:
    def create_stage_block(self, title: str, status: str, description: str) -> str:
        return f"""
```stage
title: {title}<$>
status: {status}<$>
description: {description}<$>
```
"""

    async def stream_chat_response(self, mode: ChatMode, prompt: str, uri: str = None) -> AsyncGenerator[str, None]:
        # TODO: Integrate with actual LLM (e.g., OpenAI, Gemini, local model)
        # For now, we simulate a streaming response based on the mode
        
        simulated_response = ""
        if mode == ChatMode.graph:
            simulated_response = f"""# Graph Generation
Generating graph visualization for: **'{prompt}'**...

```mermaid
graph TD;
    A[Start] --> B{{Decision}};
    B -->|Yes| C[Result 1];
    B -->|No| D[Result 2];
```
```python
def hello():
    print("Hello, world!")
```

```mermaid
graph TD;
    A[Start] --> B{{Decision}};
    B -->|Yes| C[Result 1];
    B -->|No| D[Result 2];
```

```mermaid
graph TD;
    A[Start] --> B{{Decision}};
    B -->|Yes| C[Result 1];
    B -->|No| D[Result 2];
```
table:
| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 | Column 6 | Column 7 | Column 8 | Column 9 | Column 10 |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|-----------|
| Row 1    | Data 1   | Data 1   | Data 1   | Data 1   | Data 1   | Data 1   | Data 1   | Data 1   | Data 1    |
| Row 2    | Data 2   | Data 2   | Data 2   | Data 2   | Data 2   | Data 2   | Data 2   | Data 2   | Data 2    |
| Row 3    | Data 3   | Data 3   | Data 3   | Data 3   | Data 3   | Data 3   | Data 3   | Data 3   | Data 3    |
| Row 4    | Data 4   | Data 4   | Data 4   | Data 4   | Data 4   | Data 4   | Data 4   | Data 4   | Data 4    |
| Row 5    | Data 5   | Data 5   | Data 5   | Data 5   | Data 5   | Data 5   | Data 5   | Data 5   | Data 5    |
| Row 6    | Data 6   | Data 6   | Data 6   | Data 6   | Data 6   | Data 6   | Data 6   | Data 6   | Data 6    |
| Row 7    | Data 7   | Data 7   | Data 7   | Data 7   | Data 7   | Data 7   | Data 7   | Data 7   | Data 7    |
| Row 8    | Data 8   | Data 8   | Data 8   | Data 8   | Data 8   | Data 8   | Data 8   | Data 8   | Data 8    |
| Row 9    | Data 9   | Data 9   | Data 9   | Data 9   | Data 9   | Data 9   | Data 9   | Data 9   | Data 9    |
| Row 10   | Data 10  | Data 10  | Data 10  | Data 10  | Data 10  | Data 10  | Data 10  | Data 10  | Data 10   |



sql:
```sql
SELECT * FROM table_name;
```

"""
        else:
            simulated_response = f"""# Analysis Result
Analyzing your request: **'{prompt}'**...

## Key Findings
- **Trend**: Positive growth observed in the last quarter.
- **Outliers**: No significant outliers detected.
- **Recommendation**: Continue monitoring the current metrics.

## Detailed Breakdown
Based on the provided parameters, the system has identified...
"""
        # Yield the stage block first
        yield self.create_stage_block(
            title="Processing Request",
            status="running",
            description="Analyzing input and genersdfating response...\n long text the will fill the screen lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        )
        await asyncio.sleep(0.5)

        # Simulate delay and token streaming
        chunks = simulated_response.split(" ")
        for chunk in chunks:
            yield chunk + " "
            await asyncio.sleep(0.1)

        # Yield successful completion stage
        yield self.create_stage_block(
            title="Completed",
            status="finished",
            description="Response generation finished successfully."
        )

chat_service = ChatService()
