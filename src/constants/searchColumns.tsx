import { Button, DatePicker, Input, Select, Space, type InputRef } from "antd";
import {
  ClearOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import type { ColumnType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export function searchColumns<T>(
  placeHolder: string,
  onSearch: (value: string) => void
): ColumnType<T> {
  const searchInput = useRef<InputRef | null>(null);

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${placeHolder}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            confirm();
            onSearch(selectedKeys[0] as string);
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              confirm();
              onSearch(selectedKeys[0] as string);
            }}
          >
            Search
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              clearFilters?.();
              close();
              confirm();
              onSearch("");
            }}
          >
            Reset
          </Button>
          <Button icon={<CloseOutlined />} onClick={close}>
            Cancel
          </Button>
        </Space>
      </div>
    ),
  };
}

export function searchDateColumns<T>(
  placeHolder: string,
  onSearch: (value: string) => void
): ColumnType<T> {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} className="flex flex-col">
        <DatePicker
          placeholder={`Pilih ${placeHolder}`}
          value={selectedKeys[0] ? dayjs(selectedKeys[0] as string) : null}
          onChange={(date: Dayjs | null) => {
            if (date) {
              setSelectedKeys([date.format("YYYY-MM-DD")]);
            } else {
              setSelectedKeys([]);
            }
          }}
        />
        <Space className="mt-2">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              confirm();
              onSearch(selectedKeys[0] as string);
            }}
          >
            Cari
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              clearFilters?.();
              close();
              confirm();
              onSearch("");
            }}
          >
            Reset
          </Button>
          <Button icon={<CloseOutlined />} onClick={close}>
            Batal
          </Button>
        </Space>
      </div>
    ),
  };
}

export function selectFilterColumn<T>(
  placeholder: string,
  options: { label: string; value: string }[],
  onSearch: (value: string) => void
): ColumnType<T> {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} className="flex flex-col">
        <Select
          allowClear
          showSearch
          placeholder={`Pilih ${placeholder}`}
          style={{ width: "100%", marginBottom: 8 }}
          value={selectedKeys[0]}
          onChange={(value) => setSelectedKeys(value ? [value] : [])}
          options={options}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          className="w-[100%]"
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              confirm();
              onSearch(selectedKeys[0] as string);
            }}
          >
            Cari
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              clearFilters?.();
              close();
              confirm();
              onSearch("");
            }}
          >
            Reset
          </Button>
          <Button icon={<CloseOutlined />} onClick={close}>
            Batal
          </Button>
        </Space>
      </div>
    ),
  };
}
