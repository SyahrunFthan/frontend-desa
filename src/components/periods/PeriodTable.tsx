import { Form, Table } from "antd";
import { useState } from "react";
import type { PeriodTableParams } from "../../models/period";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

interface Props {
  tableParams: PeriodTableParams;
  setTableParams: (params: PeriodTableParams) => void;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
}

const PeriodTable = ({ tableParams, setTableParams }: Props) => {
  const [processing, setProcessing] = useState(false);
  return <Form></Form>;
};

export default PeriodTable;
