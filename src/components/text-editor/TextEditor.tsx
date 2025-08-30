import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  RedoOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Divider, Space, Tooltip } from "antd";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>("");

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = value ?? "";
    if (next !== lastHtmlRef.current && next !== el.innerHTML) {
      el.innerHTML = next;
      lastHtmlRef.current = next;
    }
  }, [value]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastHtmlRef.current = html;
    onChange?.(html);
  }, [onChange]);

  const execCommand = useCallback(
    (command: string, val?: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      document.execCommand(command, false, val);
      emitChange();
    },
    [emitChange]
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <Space wrap size="small">
          <Space.Compact>
            <Tooltip title="Bold">
              <Button
                size="small"
                icon={<BoldOutlined />}
                onClick={() => execCommand("bold")}
              />
            </Tooltip>
            <Tooltip title="Italic">
              <Button
                size="small"
                icon={<ItalicOutlined />}
                onClick={() => execCommand("italic")}
              />
            </Tooltip>
            <Tooltip title="Underline">
              <Button
                size="small"
                icon={<UnderlineOutlined />}
                onClick={() => execCommand("underline")}
              />
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" style={{ height: 24 }} />

          <Space.Compact>
            <Tooltip title="Heading 1">
              <Button
                size="small"
                onClick={() => execCommand("formatBlock", "<h1>")}
              >
                H1
              </Button>
            </Tooltip>
            <Tooltip title="Heading 2">
              <Button
                size="small"
                onClick={() => execCommand("formatBlock", "<h2>")}
              >
                H2
              </Button>
            </Tooltip>
            <Tooltip title="Heading 3">
              <Button
                size="small"
                onClick={() => execCommand("formatBlock", "<h3>")}
              >
                H3
              </Button>
            </Tooltip>
            <Tooltip title="Paragraph">
              <Button
                size="small"
                onClick={() => execCommand("formatBlock", "<p>")}
              >
                P
              </Button>
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" style={{ height: 24 }} />

          <Space.Compact>
            <Tooltip title="Bullet List">
              <Button
                size="small"
                icon={<UnorderedListOutlined />}
                onClick={() => execCommand("insertUnorderedList")}
              />
            </Tooltip>
            <Tooltip title="Numbered List">
              <Button
                size="small"
                icon={<OrderedListOutlined />}
                onClick={() => execCommand("insertOrderedList")}
              />
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" style={{ height: 24 }} />

          <Space.Compact>
            <Tooltip title="Align Left">
              <Button
                size="small"
                icon={<AlignLeftOutlined />}
                onClick={() => execCommand("justifyLeft")}
              />
            </Tooltip>
            <Tooltip title="Align Center">
              <Button
                size="small"
                icon={<AlignCenterOutlined />}
                onClick={() => execCommand("justifyCenter")}
              />
            </Tooltip>
            <Tooltip title="Align Right">
              <Button
                size="small"
                icon={<AlignRightOutlined />}
                onClick={() => execCommand("justifyRight")}
              />
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" style={{ height: 24 }} />

          <Space.Compact>
            <Tooltip title="Undo">
              <Button
                size="small"
                icon={<UndoOutlined />}
                onClick={() => execCommand("undo")}
              />
            </Tooltip>
            <Tooltip title="Redo">
              <Button
                size="small"
                icon={<RedoOutlined />}
                onClick={() => execCommand("redo")}
              />
            </Tooltip>
          </Space.Compact>
        </Space>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        className="min-h-[120px] p-3 outline-none focus:ring-0"
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline
        style={{ lineHeight: "1.6", fontSize: 14 }}
      />
    </div>
  );
};

export default RichTextEditor;
