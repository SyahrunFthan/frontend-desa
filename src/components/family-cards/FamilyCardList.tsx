import { Card, Form, Table, Typography } from "antd";
import type {
  FamilyCardModel,
  FamilyCardTableParams,
} from "../../models/familyCard";
import { editTableFamilyCardColumns } from "../../constants/familyCardColumns";
import { useEffect, useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import {
  familyCardDeleted,
  familyCardUpdated,
} from "../../services/familyCard";
import EditableCell from "../other/EditTableCell";

interface Props {
  tableParams: FamilyCardTableParams;
  dataSource: FamilyCardModel[];
  loading: boolean;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  setTableParams: (params: FamilyCardTableParams) => void;
  fetchFamilyCard: () => void;
}

const FamilyCardList = ({
  dataSource,
  tableParams,
  setTableParams,
  loading,
  notificationApi,
  fetchFamilyCard,
  messageApi,
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [formEdit] = Form.useForm<FamilyCardModel>();
  const [editingRecord, setEditingRecord] = useState<
    FamilyCardModel | undefined
  >();

  const handleDelete = (id: string) => {
    familyCardDeleted({
      fetchFamilyCard,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const columns = editTableFamilyCardColumns({
    tableParams,
    handleDelete,
    processing,
    setTableParams,
    editingRecord,
    setEditingRecord,
  });

  useEffect(() => {
    if (!editingRecord) return;
    formEdit.setFieldsValue({
      id: editingRecord.id,
      family_id: editingRecord.family_id,
      address: editingRecord.address,
      total_family: editingRecord.total_family,
    });
  }, [editingRecord, formEdit]);

  return (
    <Card>
      <Typography.Title level={3}>List Family Card</Typography.Title>

      <Form
        form={formEdit}
        onFinish={(values) => {
          const data = {
            family_id: values.family_id || "",
            total_family: values.total_family ?? 0,
            address: values.address || "",
            id: editingRecord?.id || "",
          };

          familyCardUpdated({
            messageApi,
            data,
            notificationApi,
            setProcessing,
            setEditingRecord,
            id: editingRecord?.id || "",
            form: formEdit,
            fetchData: fetchFamilyCard,
          });
        }}
      >
        <Table
          components={{ body: { cell: EditableCell<FamilyCardModel> } }}
          columns={columns}
          size="middle"
          scroll={{ x: "max-content" }}
          dataSource={dataSource}
          pagination={tableParams.pagination}
          bordered
          loading={loading}
          rowKey={"id"}
        />
      </Form>
    </Card>
  );
};

export default FamilyCardList;
