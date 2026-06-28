# Skills benchmark — pass rates by arm × scheme

_Each cell is `pass/total (rate%)` for the (arm, scheme) pair across the 50 V5 prompts._

| Arm \ Scheme          | baseline      | Arm avg   |
| --------------------- | ------------- | --------- |
| gemini-3.1-flash-lite | 89/95 (93.7%) | **93.7%** |
| glm-5.1               | 80/95 (84.2%) | **84.2%** |
| haiku-4-5             | 90/95 (94.7%) | **94.7%** |
| kimi-latest           | 68/95 (71.6%) | **71.6%** |
| qwen3.5-flash-02-23   | 86/95 (90.5%) | **90.5%** |
| qwen3.6-flash         | 82/95 (86.3%) | **86.3%** |
| **Scheme avg**        | **86.8%**     |           |

## How to read this

- Look across a row → does any scheme outperform baseline for this model? If yes, that arm benefits from renamed tools.
- Look down a column → does the scheme work uniformly across models, or only on some?
- The bottom row gives the scheme average — the single number that answers "which naming convention should we ship?".
