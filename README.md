# Eric Gu — Portfolio Website

A lightweight static portfolio: no build step, framework, or dependency install required.

## Add a project

1. Copy [`projects/project-template.html`](projects/project-template.html) and rename it, for example `projects/line-follower.html`.
2. Replace the title, introduction, facts and case-study sections with the project details.
3. Duplicate a card in the CAD, Robotics, or Programming `project-list` in [`index.html`](index.html) and point its `href` to the new file.
4. Edit the strings inside `project-tags` to describe that project, for example `Concept Design`, `Manufacturing`, or `Competition`.

Keep the group's `data-project-type` set to `cad`, `robotics`, or `programming` so new cards inherit the correct discipline colour.

The dark/light preference is saved locally in the browser. Before publishing, replace the example email and social links in `index.html` with your public contact details.
