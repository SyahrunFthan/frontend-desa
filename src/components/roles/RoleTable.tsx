import type { TablePaginationConfig } from "antd/es/table";
import Table from "antd/es/table";
import type { RoleModel, RoleTableParams } from "../../models/role";
import type { MessageInstance } from "antd/es/message/interface";

import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  tableParams: RoleTableParams;
  dataSource: RoleModel[];
  loading: boolean;
  columns: any;
  fetchData: () => void;
  setTableParams: (tableParams: RoleTableParams) => void;
}

const RoleTable = ({
  tableParams,
  setTableParams,
  loading,
  dataSource,
  columns,
}: Props) => {
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  return (
    <Table
      columns={columns}
      bordered
      size="middle"
      rowKey={"id"}
      dataSource={dataSource}
      loading={loading}
      pagination={tableParams.pagination}
      onChange={handleTableChange}
    />
  );
};

export default RoleTable;
