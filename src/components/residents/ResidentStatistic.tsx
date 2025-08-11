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
      <Col sm={24} xs={24} lg={12} xl={12} xxl={12}>
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
      <Col sm={24} xs={24} md={24} lg={12} xl={12} xxl={12}>
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
