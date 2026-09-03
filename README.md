# Chat Interface Kit

Here is the tailored Master Prompt specifically optimized to build a professional, production-ready frontend for a chatbot application in Lovable.

> "Build a production-ready, highly polished AI Chatbot application with a modern, minimalist aesthetic inspired by state-of-the-art AI interfaces like ChatGPT and Claude.

> Design & Styling:

>  * Use a sleek, clean color palette: [e.g., dark mode by default with deep charcoal/slate backgrounds, subtle border dividers, and a vibrant indigo or emerald accent color for user messages and primary CTAs].

>  * Ensure flawless typography using clean sans-serif fonts with a clear visual hierarchy.

>  * Apply smooth transitions, auto-scrolling behavior for messages, and subtle hover states for all interactive buttons and settings.

>  * Implement a fully responsive layout optimized for mobile drawers and desktop sidebars.

> Layout & Architecture (Sidebar + Chat Area):

>  * Left Sidebar (Collapsible): Includes a 'New Chat' button at the top, a searchable history list of past chat sessions grouped by time (e.g., 'Today', 'Previous 7 Days'), and user settings/profile at the bottom.

>  * Main Chat Area: >   - Empty State: A welcoming greeting with quick-start prompt suggestion cards (clickable chips).

>    * Active Chat: A message stream featuring distinct styling for user messages versus AI assistant responses (complete with Markdown rendering code blocks, copy buttons, and thumbs up/down feedback icons).

>    * Input Bar: A fixed bottom input area featuring an auto-resizing text area, attachment/file upload button, model selector dropdown, and a distinct send icon button.

> Components & Details:

>  * Use Tailwind CSS and shadcn/ui patterns (dropdowns, dialogs, tooltips).

>  * Use Lucide icons consistently for navigation, actions, and status indicators.

>  * Include realistic placeholder data in the sidebar history so the UI looks lived-in and fully functional immediately."

> 

Tips for Best Results in Lovable:

 * Iterate by Section: If you want custom features like voice input, an AI persona selector, or prompt streaming effects, add them as a follow-up prompt after Lovable generates this core layout.

 * Theme Customization: Swap out the dark mode preference for a clean light mode by changing the background instructions to crisp whites and soft grays if that fits

 your brand better.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://front-buddy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/233a6e41-0379-4084-9ddd-1de1aa914b63).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
