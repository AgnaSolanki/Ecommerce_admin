import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import userApi from "../../../api/userApi";
import { toast } from "react-toastify";
import { BigBaseLoader } from "../../../Components/BASE/BaseLoader";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [pieLabels, setPieLabels] = useState([]);
  const [pieLoading, setPieLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState("year");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchPieChartData(timeFrame);
    fetchHighestPurchaseOrders();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userApi.dashboardStatistics();
      if (response?.status === 200 && response?.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPieChartData = async (selectedTimeFrame) => {
    try {
      setPieLoading(true);
      const response = await userApi.orderPieChart({
        timeFrame: selectedTimeFrame,
      });
      if (response?.status === 200 && response?.data?.data) {
        const apiData = response.data.data;
        setPieData(apiData.map((item) => item.value));
        setPieLabels(apiData.map((item) => item.label));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPieLoading(false);
    }
  };

  const fetchHighestPurchaseOrders = async () => {
    try {
      const response = await userApi.highestPurchaseOrder();
      if (response?.status === 200 && response?.data?.data) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
    fetchPieChartData(frame);
  };

  const PieChartComponent = ({ series, labels }) => {
    const options = {
      labels: labels,
      chart: {
        height: 320,
        type: "donut",
      },
      legend: {
        position: "bottom",
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        dropShadow: { enabled: false },
      },
      colors: ["#556ee6", "#34c38f", "#f46a6a", "#f1b44c", "#50a5f1"],
    };

    return (
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={320}
        className="apex-charts"
      />
    );
  };

  if (loading) {
    return (
      <div className="page-content mt-4">
        <Container fluid>
          <Row>
            <Col xs={12} className="text-center">
              <BigBaseLoader />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="page-content mt-4">
        <Container fluid>
          <Row>
            <Col xs={12} className="text-center">
              <BigBaseLoader />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const cardData = [
    {
      label: "Total Orders",
      counter: stats.total_order,
      badgeClass: "success",
      link: "View Orders",
      bgcolor: "primary",
      icon: "ri-shopping-bag-line",
    },
    {
      label: "Cancelled Orders",
      counter: stats.total_cancel_order,
      badgeClass: "danger",
      link: "View Cancelled",
      bgcolor: "danger",
      icon: "ri-close-circle-line",
    },
    {
      label: "Pending Orders",
      counter: stats.total_pending_order,
      badgeClass: "warning",
      link: "View Pending",
      bgcolor: "warning",
      icon: "ri-timer-line",
    },
    {
      label: "Total Customers",
      counter: stats.total_customer,
      badgeClass: "info",
      link: "View Customers",
      bgcolor: "info",
      icon: "ri-user-line",
    },
  ];

  return (
    <div className="page-content mt-4">
      <Container fluid>
        <Row className="mb-3 pb-1">
          <Col xs={12}>
            <div className="d-flex align-items-lg-center flex-lg-row flex-column">
              <div className="flex-grow-1">
                <h4 className="fs-16 mb-1">Welcome!</h4>
                <p className="text-muted mb-0">
                  Here's what's happening with your store today.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {cardData.map((item, key) => (
            <Col xl={3} md={6} key={key}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                        {item.label}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                        +0 %
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                        <span className="counter-value">
                          <CountUp
                            start={0}
                            end={item.counter}
                            duration={2}
                            separator=","
                          />
                        </span>
                      </h4>
                      <Link to="#" className="text-decoration-underline">
                        {item.link}
                      </Link>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span
                        className={
                          "avatar-title rounded fs-3 bg-" +
                          item.bgcolor +
                          "-subtle"
                        }
                      >
                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}

          <Col xl={5}>
            <Card className="card-height-100">
              <CardHeader className="align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">Orders Overview</h4>
                <div className="flex-shrink-0">
                  <UncontrolledDropdown className="card-header-dropdown">
                    <DropdownToggle
                      tag="a"
                      className="text-reset dropdown-btn"
                      role="button"
                    >
                      <span className="text-muted text-capitalize">
                        {timeFrame}{" "}
                        <i className="mdi mdi-chevron-down ms-1"></i>
                      </span>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <DropdownItem
                        onClick={() => handleTimeFrameChange("week")}
                      >
                        Week
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleTimeFrameChange("month")}
                      >
                        Month
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleTimeFrameChange("year")}
                      >
                        Year
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </CardHeader>

              <div
                className="card-body d-flex justify-content-center align-items-center"
                style={{ minHeight: "320px" }}
              >
                {pieLoading ? (
                  <Spinner color="primary" />
                ) : (
                  <PieChartComponent series={pieData} labels={pieLabels} />
                )}
              </div>
            </Card>
          </Col>
          <Col xl={7}>
            <Card>
              <CardHeader className="align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  Top Customers by Purchase Value
                </h4>
              </CardHeader>

              <CardBody>
                {orders.length === 0 ? (
                  <div className="text-center my-4">
                    <BigBaseLoader />
                  </div>
                ) : (
                  <div className="table-responsive table-card">
                    <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                      <thead className="text-muted table-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Customer id</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Total Purchase Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.user?.id || "N/A"}</td>

                            <td>{item.user?.name || "Unknown"}</td>
                            <td>
                              <span className="text-success">
                                ${item.total_price}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
