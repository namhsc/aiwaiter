# URGENT: Fix Double-Escaped Newlines in aiResponses.ts

## Problem
Lines 625-727 in `/utils/aiResponses.ts` contain `\\n` (double backslash + n) which displays as literal text "\n" instead of actual newlines in the chat.

## What needs to change
In the source code, you need to replace the **double backslashes** with **single backslashes**.

Example:
- ❌ WRONG: `` `Text\\\\n\\\\nMore text` `` (displays as "Text\\n\\nMore text")  
- ✅ RIGHT: `` `Text\n\nMore text` `` (displays with proper line breaks)

## Sections affected
1. **Salads** (lines 625-627)
2. **Soups** (lines 635-638)
3. **Quick items** (lines 656-661)
4. **Lunch specials** (lines 676-682)
5. **Traditional** (lines 699-704)
6. **Bavarian** (lines 718-723)

## Instructions
Manually edit `/utils/aiResponses.ts` and change EVERY instance of:
- `\\\\n\\\\n` → `\n\n`
- `\\\\n` → `\n`

In lines 618-726.

## Also remove these lines while editing:
- Line 661: `` `💡 **Quick order:** Say \"Pretzel now\" or \"Fast Bratwurst\"\\\\n\\\\nWhat would you like?` ``
  - Change to: `` `All prepared fresh but served quickly!\n\nWhat would you like?` ``

- Line 682: `` `💡 **Quick order:** Say \"Lunch Schnitzel\" or \"Bratwurst special\"\\\\n\\\\nWhich appeals to you?` ``
  - Change to: `` `Available until 3 PM daily!\n\nWhich appeals to you?` ``

## Quick Test
After fixing, say "salads" in the chat - it should display with proper line breaks, not literal "\n" characters.
