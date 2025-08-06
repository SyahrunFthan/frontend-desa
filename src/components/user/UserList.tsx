import { Card, Table, Typography, type TablePaginationConfig } from "antd";
import type { UserModel, UserTableParams } from "../../models/user";

interface Props {
  tableParams: UserTableParams;
  tableColumns: any;
  dataSource: UserModel[];
  loading: boolean;
  setTableParams: (params: UserTableParams) => void;
}

const UserList = ({
  tableParams,
  tableColumns,
  dataSource,
  loading,
  setTableParams,
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
    <Card>
      <Typography.Title level={3}>List Users</Typography.Title>
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        bordered
        rowKey={"id"}
        size="middle"
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default UserList;
