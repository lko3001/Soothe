import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import aaa from "@tiptap/extension-code-block-lowlight";
import StarterKit from "@tiptap/starter-kit";

import { lowlight } from "lowlight/lib/core";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

export const tipTapExtensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  Image,
  Link,
  Placeholder.configure({
    placeholder: "I was thinking about...",
  }),
  aaa.configure({
    lowlight,
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
];
