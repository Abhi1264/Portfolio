import React from "react";
import { RichTextEditor as MantineRTE, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Link, ImageExtension],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <MantineRTE
      editor={editor}
      className="bg-neutral-950 border-purple-500/40 text-white rounded-md"
    >
      <MantineRTE.Toolbar sticky>
        <MantineRTE.ControlsGroup>
          <MantineRTE.Bold />
          <MantineRTE.Italic />
          <MantineRTE.Underline />
          <MantineRTE.Strikethrough />
          <MantineRTE.Link />
          {/* Image control is not available by default in MantineRTE, you may need to implement a custom control if needed */}
        </MantineRTE.ControlsGroup>
        <MantineRTE.ControlsGroup>
          <MantineRTE.H1 />
          <MantineRTE.H2 />
          <MantineRTE.H3 />
          <MantineRTE.Blockquote />
        </MantineRTE.ControlsGroup>
        <MantineRTE.ControlsGroup>
          <MantineRTE.BulletList />
          <MantineRTE.OrderedList />
        </MantineRTE.ControlsGroup>
        <MantineRTE.ControlsGroup>
          <MantineRTE.Code />
          <MantineRTE.CodeBlock />
        </MantineRTE.ControlsGroup>
        <MantineRTE.ControlsGroup>
          <MantineRTE.Undo />
          <MantineRTE.Redo />
        </MantineRTE.ControlsGroup>
      </MantineRTE.Toolbar>
      <MantineRTE.Content />
    </MantineRTE>
  );
};
