import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import './RichTextEditor.css'; // for styling
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

export default function RichTextEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
        TextStyle,
        Color,
        StarterKit,
        Placeholder.configure({
            placeholder: 'Opisi dogadjaj...',
      }),
    ],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-editor rounded p-2" style={{ minHeight: 150, border:'1px solid #c13584' }}>
        <div className='mb-2' style={{borderBottom:'1px solid #c13584', padding:'2px'}}>
            <button
                type="button"
                className={`btn btn-sm me-2 ${editor?.isActive('bold') ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{width:'30px', color:'white', backgroundColor: editor?.isActive('bold')? '#c13584' : ''}}
                onClick={() => editor?.chain().focus().toggleBold().run()}
            ><b>B</b></button>
            <button
                type="button"
                className={`btn btn-sm me-2 ${editor?.isActive('italic') ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                style={{width:'30px', color:'white', backgroundColor: editor?.isActive('italic')? '#c13584' : ''}}
                title="Italic (Ctrl/Cmd + I)"
            ><em>I</em>
            </button>
            <button
                type="button"
                className={`btn btn-sm me-2 ${editor?.isActive('bulletList') ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{color:'white', backgroundColor: editor?.isActive('bulletList')? '#c13584' : ''}}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                title="Bullet List">
                &#8226; List
            </button>
        </div>
        <EditorContent editor={editor} />
    </div>
  );
}

