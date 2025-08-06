import { Form, Input, InputNumber, Select } from "antd";
import React from "react";
import type { EditableCellProps } from "../../models/global";

const EditableCell = <T,>({
  editing,
  col,
  children,
  selectOptions,
  ...restProps
}: React.PropsWithChildren<EditableCellProps<T>>) => {
  let formInput: React.ReactNode = <Input />;
  switch (col?.inputType) {
    case "number":
      formInput = <InputNumber />;
      break;
    case "select":
      formInput = (
        <Select
          options={selectOptions}
          showSearch
          allowClear
          placeholder="Select an option"
        />
      );
      break;
    case "other":
      formInput = col.inputRender?.() || <Input />;
      break;
    default:
      formInput = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={col.dataIndex?.toString()}
          style={{ margin: 0 }}
          rules={[{ required: true }]}
        >
          {formInput}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
