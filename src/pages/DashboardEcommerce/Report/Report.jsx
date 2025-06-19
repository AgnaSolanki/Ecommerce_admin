import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "reactstrap";
import userApi from "../../../api/userApi";
import BaseButton from "../../../Components/BASE/BaseButton";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import BaseLoader from "../../../Components/BASE/BaseLoader";
import BaseInput from "../../../Components/BASE/BaseInput";
import { dateRegex, inputField } from "../../../Components/constants/validation";
import { CONSTANTS } from "../../../Components/constants/common";

const Report = () => {
  document.title = "Report";

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
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [
    orderPage,
    userPage,
    orderSearch,
    userSearch,
    orderStartDate,
    orderEndDate,
  ]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const isValidStart = dateRegex?.test(tempStartDate);
      const isValidEnd = dateRegex?.test(tempEndDate);

      if (isValidStart) {
        setOrderStartDate(tempStartDate);
        setOrderPage(1);
      }
      if (isValidEnd) {
        setOrderEndDate(tempEndDate);
        setOrderPage(1);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [tempStartDate, tempEndDate]);

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
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

 const renderPagination = (page, totalPages, setPage) => {
    const pages = [];

    switch (true) {
      case totalPages <= 5:
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        break;

      case page <= 3:
        pages.push(1, 2, 3, 4, "...", totalPages);
        break;

      case page >= totalPages - 2:
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
        break;

      default:
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
        break;
    }

    return (
      <div className="d-flex justify-content-end mt-3">
        <BaseButton
          size="sm"
          color="primary"
          className="me-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </BaseButton>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="me-2">
              ...
            </span>
          ) : (
            <BaseButton
              key={`page-${item}`}
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
          size="sm"
          color="primary"
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
              <BaseLoader size={20} />
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
                <div className="d-flex align-items-center">
                  <BaseInput
                    id={CONSTANTS.UserSearch}
                    name={CONSTANTS.userSearch}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.User_Search)}
                    value={userSearchInput}
                    onChange={(e) => setUserSearchInput(e.target.value)}
                    onIconClick={() => {
                      setUserSearch(userSearchInput);
                      setUserPage(1);
                    }}
                    icon={<Search size={16} />}
                  />
                </div>
              </CardHeader>

              <CardBody>
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
                <Row>
                  <Col md="12" className="text-start">
                    <h6>
                      Showing {(userPage - 1) * userLimit + 1} to{" "}
                      {Math.min(userPage * userLimit, userTotalRecords)} of{" "}
                      {userTotalRecords} Results
                    </h6>
                  </Col>
                </Row>
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
                >
                  <BaseInput
                    id={CONSTANTS.OrderSearch}
                    name={CONSTANTS.orderSearch}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.order_Search)}
                    value={orderSearchInput}
                    onChange={(e) => setOrderSearchInput(e.target.value)}
                    onIconClick={() => {
                      setOrderSearch(orderSearchInput);
                      setOrderPage(1);
                    }}
                    icon={<Search size={16} />}
                  />
                </div>
              </CardHeader>

              <CardBody>
                <Row className="mb-3">
                  <Row className="mb-3">
                    <Col md="3">
                      <label>Start Date</label>
                      <Input
                        type="date"
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                      />
                    </Col>

                    <Col md="3">
                      <label>End Date</label>
                      <Input
                        type="date"
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                      />
                    </Col>
                  </Row>
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
                <Col md="12" className="text-start">
                  <h6>
                    Showing {(orderPage - 1) * orderLimit + 1} to{" "}
                    {Math.min(orderPage * orderLimit, orderTotalRecords)} of{" "}
                    {orderTotalRecords} Results
                  </h6>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Report;
