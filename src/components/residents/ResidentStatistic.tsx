import { Card, Col, Row, Typography } from "antd";
import type {
  ProfesionStatistic,
  ReligionStatistic,
} from "../../models/resident";
import { Column } from "@ant-design/charts";

interface Props {
  profesions: ProfesionStatistic[];
  religions: ReligionStatistic[];
}

const ResidentStatistic = ({ profesions, religions }: Props) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card>
          <Typography.Title level={3}>
            Statistics By Occupation
          </Typography.Title>

          <Column
            data={profesions}
            xField={"job"}
            yField={"total"}
            seriesField={"job"}
            autoFit={true}
            legend={true}
            colorField={"job"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Typography.Title level={3}>Statistics By Religion</Typography.Title>

          <Column
            data={religions}
            xField={"name"}
            yField={"total"}
            legend={true}
            autoFit={true}
            colorField={"name"}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ResidentStatistic;
