import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  InputGroup,
  Input,
  InputGroupText,
} from "reactstrap";
import userApi from "../../../api/userApi";
import BaseButton from "../../../Components/BASE/BaseButton";
import { Search } from "lucide-react";

const Report = () => {
  const [orderReportData, setOrderReportData] = useState([]);
  const [userReportData, setUserReportData] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearchInput, setOrderSearchInput] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");

  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit] = useState(10);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderTotalRecords, setOrderTotalRecords] = useState(0);
  const [orderStartDate, setOrderStartDate] = useState("");
  const [orderEndDate, setOrderEndDate] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotalRecords, setUserTotalRecords] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [orderPage, userPage, orderSearch, userSearch]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        search: orderSearch,
        limit: orderLimit,
        page: orderPage,
        sortValue: "asc",
        sortKey: "id",
        startDate: orderStartDate
          ? `${orderStartDate}T00:00:00.000Z`
          : "2024-01-01T00:00:00.000Z",
        endDate: orderEndDate
          ? `${orderEndDate}T23:59:59.999Z`
          : "2025-12-31T23:59:59.999Z",
      };

      const userPayload = {
        search: userSearch,
        limit: userLimit,
        page: userPage,
        sortValue: "asc",
        sortKey: "id",
      };

      const [orderResponse, userResponse] = await Promise.all([
        userApi.orderReport(orderPayload),
        userApi.userReport(userPayload),
      ]);

      if (orderResponse?.status === 200 && orderResponse?.data?.data?.orders) {
        setOrderReportData(orderResponse.data.data.orders);
        setOrderTotalPages(orderResponse.data.data.totalPage || 1);
        setOrderTotalRecords(orderResponse.data.data.totalOrders || 0);
      }

      if (userResponse?.status === 200 && userResponse?.data?.data?.users) {
        setUserReportData(userResponse.data.data.users);
        setUserTotalPages(userResponse.data.data.totalPage || 1);
        setUserTotalRecords(userResponse.data.data.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = (page, totalPages, setPage) => {
    let pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (page >= totalPages - 2) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [1, "...", page - 1, page, page + 1, "...", totalPages];
      }
    }

    return (
      <div className="d-flex justify-content-end flex-wrap mt-4">
        <BaseButton
          color="primary"
          size="sm"
          className="me-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </BaseButton>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={index} className="me-2">
              ...
            </span>
          ) : (
            <BaseButton
              key={index}
              size="sm"
              color={item === page ? "dark" : "secondary"}
              className="me-2"
              onClick={() => setPage(item)}
            >
              {item}
            </BaseButton>
          )
        )}

        <BaseButton
          color="primary"
          size="sm"
          className="ms-2"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </BaseButton>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-content mt-4">
        <Container fluid>
          <Row>
            <Col xs={12} className="text-center mt-5">
              <h4>Loading Reports...</h4>
              <Spinner color="primary" />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content mt-4">
      <Container fluid>
        <Row className="mb-5">
          <Col xl={12}>
            <Card className="shadow-sm ">
              <CardHeader className="d-flex justify-content-between align-items-center rounded-top-4 flex-wrap gap-3">
                <h4 className="card-title mb-0">Customer Activity Report</h4>
                <div
                  className="d-flex align-items-center"
                  style={{ minWidth: "300px" }}
                >
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Search Users..."
                      className="form-control"
                      value={userSearchInput}
                      onChange={(e) => setUserSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setUserSearch(userSearchInput);
                          setUserPage(1);
                        }
                      }}
                    />
                    <InputGroupText style={{ cursor: "pointer" }}>
                      <Search size={16} />
                    </InputGroupText>
                  </InputGroup>
                </div>
              </CardHeader>

              <CardBody>
                <Row>
                  <Col md="3">
                    <label>Start Date</label>
                    <Input
                      type="date"
                      value={orderStartDate}
                      onChange={(e) => {
                        setOrderStartDate(e.target.value);
                        setOrderPage(1);
                      }}
                    />
                  </Col>

                  <Col md="3">
                    <label>End Date</label>
                    <Input
                      type="date"
                      value={orderEndDate}
                      onChange={(e) => {
                        setOrderEndDate(e.target.value);
                        setOrderPage(1);
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md="12" className="text-end">
                    <h6>
                      Showing {(userPage - 1) * userLimit + 1} to{" "}
                      {Math.min(userPage * userLimit, userTotalRecords)} of{" "}
                      {userTotalRecords} Results
                    </h6>
                  </Col>
                </Row>

                {userReportData.length === 0 ? (
                  <div className="text-center my-4">
                    <h5>No data available</h5>
                  </div>
                ) : (
                  <div className="table-responsive table-card">
                    <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                      <thead className="text-muted table-light">
                        <tr>
                          <th>#</th>
                          <th>Customer Name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Gender</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userReportData.map((item, index) => (
                          <tr key={index}>
                            <td>{(userPage - 1) * userLimit + index + 1}</td>
                            <td>{item.name || "Unknown"}</td>
                            <td>{item.email || "N/A"}</td>
                            <td>{item.phone_number || "N/A"}</td>
                            <td>{item.gender || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {renderPagination(userPage, userTotalPages, setUserPage)}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl={12}>
            <Card className="shadow-sm ">
              <CardHeader className="d-flex justify-content-between align-items-center rounded-top-4 flex-wrap gap-3">
                <h4 className="card-title mb-0">Recent Orders Report</h4>
                <div
                  className="d-flex align-items-center"
                  style={{ minWidth: "300px" }}
                >
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Search Orders..."
                      className="form-control"
                      value={orderSearchInput}
                      onChange={(e) => setOrderSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setOrderSearch(orderSearchInput);
                          setOrderPage(1);
                        }
                      }}
                    />
                    <InputGroupText style={{ cursor: "pointer" }}>
                      <Search size={16} />
                    </InputGroupText>
                  </InputGroup>
                </div>
              </CardHeader>

              <CardBody>
                <Row className="mb-3">
                  <Col md="12" className="text-end">
                    <h6>
                      Showing {(orderPage - 1) * orderLimit + 1} to{" "}
                      {Math.min(orderPage * orderLimit, orderTotalRecords)} of{" "}
                      {orderTotalRecords} Results
                    </h6>
                  </Col>
                </Row>

                {orderReportData.length === 0 ? (
                  <div className="text-center my-4">
                    <h5>No data available</h5>
                  </div>
                ) : (
                  <div className="table-responsive table-card">
                    <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                      <thead className="text-muted table-light">
                        <tr>
                          <th>#</th>
                          <th>Order ID</th>
                          <th>Customer Name</th>
                          <th>Order Name</th>
                          <th>Order Amount</th>
                          <th>Total Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderReportData.map((item, index) => (
                          <tr key={index}>
                            <td>{(orderPage - 1) * orderLimit + index + 1}</td>
                            <td>{item.id}</td>
                            <td>{item.name || "Unknown"}</td>
                            <td>{item.order_name || "N/A"}</td>
                            <td>${item.order_amount || 0}</td>
                            <td>{item.total_items || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {renderPagination(orderPage, orderTotalPages, setOrderPage)}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Report;
