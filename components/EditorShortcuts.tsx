import shortcuts from "../shortcuts.json";

export default function EditorShortcuts({ editor }: any) {
  function checkActive(id: string) {
    switch (id) {
      case "heading":
        return editor.isActive(id, { level: 1 }) ? "hidden" : "";
      default:
        return editor.isActive(id) ? "hidden" : "";
    }
  }
  function setCommand(id: string) {
    switch (id) {
      case "heading":
        return editor.chain().focus().toggleHeading({ level: 1 }).run();
      case "codeblock":
        return editor.chain().focus().toggleCodeBlock().run();
      case "bulletlist":
        return editor.chain().focus().toggleBulletList().run();
      case "orderedlist":
        return editor.chain().focus().toggleOrderedList().run();
      case "image": {
        const url = window.prompt("URL");
        return editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }
  return (
    <>
      {shortcuts.map((shortcut) => (
        <div
          className={`pointer-events-auto flex cursor-pointer flex-row items-center justify-between gap-2 rounded-md bg-r-lightGray p-2 text-r-black focus-within:bg-r-grayHover dark:bg-r-darkLightGray dark:text-r-darkBlack dark:focus-within:bg-r-darkGrayHover  ${checkActive(
            shortcut.id
          )}`}
          onClick={() => setCommand(shortcut.id)}
          key={shortcut.id}
        >
          <div>
            <button className="pointer-events-auto mr-2 rounded-md bg-r-accentWarm p-2 text-xs font-bold leading-none text-r-black focus:outline-none dark:bg-r-darkAccentWarm dark:text-r-darkBlack">
              {shortcut.button}
            </button>
            <span>{shortcut.name}</span>
          </div>
          {shortcut.shortcut.length !== 0 && (
            <span className="hidden rounded-md bg-r-accentWarm/50 p-1 font-roboto_mono text-xs font-black capitalize dark:bg-r-darkAccentWarm/50 md:inline">
              {shortcut.shortcut.join("+")}
            </span>
          )}
        </div>
      ))}
    </>
  );
}
