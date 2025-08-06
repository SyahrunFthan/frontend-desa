import { Card, Table, Typography, type TablePaginationConfig } from "antd";
import type { ResidentModel, ResidentTableParams } from "../../models/resident";
import { residentFamilyColumns } from "../../constants/familyCardColumns";

interface Props {
  dataSource: ResidentModel[];
  tableParams: ResidentTableParams;
  loading: boolean;
  setTableParams: (params: ResidentTableParams) => void;
}

const FamilyCardListResident = ({
  dataSource,
  tableParams,
  setTableParams,
  loading,
}: Props) => {
  const handleTableChange = (paginatin: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: paginatin.current,
        pageSize: paginatin.pageSize,
      },
    });
  };

  return (
    <Card>
      <Typography.Title level={3}>List Family</Typography.Title>

      <Table
        columns={residentFamilyColumns()}
        bordered
        rowKey={"id"}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default FamilyCardListResident;
