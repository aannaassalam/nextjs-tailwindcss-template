/* eslint-disable react/display-name */
import assets from "@/json/assets";
import styled from "@emotion/styled";
import {
  BubbleMenu,
  EditorProvider,
  FloatingMenu,
  useCurrentEditor
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Stack } from "@chakra-ui/react";
import { createField } from "@saas-ui/react";
import { forwardRef } from "react";

// define your extension array
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  //   TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    }
  }),
  Underline
];

const Toolbar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" gap={0.2}>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "rich_text_button is-active"
            : "rich_text_button"
        }
      >
        <Image src={assets.bold_icon} alt="Bold" width={20} height={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "rich_text_button is-active"
            : "rich_text_button"
        }
      >
        <Image src={assets.italic_icon} alt="Italic" width={20} height={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline")
            ? "rich_text_button is-active"
            : "rich_text_button"
        }
      >
        <Image
          src={assets.underline_icon}
          alt="Underline"
          width={20}
          height={20}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "rich_text_button is-active"
            : "rich_text_button"
        }
      >
        <Image src={assets.h1_icon} alt="H1" width={20} height={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "rich_text_button is-active"
            : "rich_text_button"
        }
      >
        <Image src={assets.h2_icon} alt="H2" width={20} height={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "rich_text_button is-active"
            : "rich_text_button"
        }
      >
        <Image src={assets.h3_icon} alt="H3" width={20} height={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "rich_text_button is-active"
            : "rich_text_button"
        }
      >
        <Image
          src={assets.list_unordered_icon}
          alt="List unordered"
          width={20}
          height={20}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="rich_text_button"
      >
        <Image src={assets.undo_icon} alt="Undo" width={20} height={20} />
      </button>
    </Stack>
  );
};

const RichTextEditor = createField(
  forwardRef<any, any>((props, ref) => {
    const { value, onChange, ...rest } = props;

    return (
      <EditorProvider
        {...rest}
        extensions={extensions}
        content={value}
        slotBefore={<Toolbar />}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML().toString());
        }}
      ></EditorProvider>
    );
  }),
  {
    isControlled: true
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
