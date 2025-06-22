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
import { dateRegex } from "../../../Components/constants/validation";
import { CONSTANTS } from "../../../Components/constants/common";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const OrderReport = () => {
  document.title = "Report";

  const [orderReportData, setOrderReportData] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderSearchInput, setOrderSearchInput] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit] = useState(10);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderTotalRecords, setOrderTotalRecords] = useState(0);
  const [orderStartDate, setOrderStartDate] = useState("");
  const [orderEndDate, setOrderEndDate] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [noOrderData, setNoOrderData] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [
    orderPage,
    orderSearch,
    orderStartDate,
    orderEndDate,
    sortKey,
    sortOrder,
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
        sortValue: sortOrder,
        sortKey: sortKey,
        startDate: orderStartDate
          ? `${orderStartDate}T00:00:00.000Z`
          : "2024-01-01T00:00:00.000Z",
        endDate: orderEndDate
          ? `${orderEndDate}T23:59:59.999Z`
          : "2025-12-31T23:59:59.999Z",
      };

      const [orderResult] = await Promise.allSettled([
        userApi.orderReport(orderPayload),
      ]);

      if (orderResult.status === "fulfilled") {
        const orderRes = orderResult.value;
        const orders = orderRes?.data?.data?.orders || [];
        setOrderReportData(orders);
        setOrderTotalPages(orderRes.data.data.totalPage || 1);
        setOrderTotalRecords(orderRes.data.data.totalOrders || 0);
        setNoOrderData(orders.length === 0);
      } else {
        const status = orderResult?.reason?.response?.status;

        // Suppress toast for 404 errors
        if (status !== 404) {
          toast.error(orderResult.reason?.response?.data?.message);
        }

        setOrderReportData([]);
        setNoOrderData(true);
      }
    } catch (err) {
      const status = err?.response?.status;

      if (status !== 404) {
        toast.error(err?.response?.data?.message);
      }

      setOrderReportData([]);
      setNoOrderData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setOrderPage(1);
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
        <Row>
          <Col xl={12}>
            <Card className="shadow-sm">
              <CardHeader className="d-flex justify-content-between align-items-center rounded-top-4 flex-wrap gap-3">
                <h4 className="card-title mb-0">Recent Orders Report</h4>
                <div className="d-flex align-items-center gap-2">
                  <BaseInput
                    id={CONSTANTS.OrderSearch}
                    name={CONSTANTS.orderSearch}
                    type={CONSTANTS.text}
                    placeholder="Search order..."
                    value={orderSearchInput}
                    onChange={(e) => setOrderSearchInput(e.target.value)}
                    onIconClick={() => {
                      setOrderSearch(orderSearchInput);
                      setOrderPage(1);
                    }}
                    icon={<Search size={16} />}
                  />

                  {orderSearchInput.trim() !== "" && (
                    <BaseButton
                      color="warning"
                      size="sm"
                      className="px-3 mt-3 py-1 d-flex align-items-center"
                      onClick={() => {
                        setOrderSearchInput("");
                        setOrderSearch("");
                        setOrderPage(1);
                      }}
                    >
                      Discard
                    </BaseButton>
                  )}
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

                <div className="table-responsive table-card mb-2">
                  <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                    <thead className="text-muted table-light">
                      <tr>
                        <th>No.</th>

                        <th
                          onClick={() => handleSort("id")}
                        >
                          Order ID
                          {sortKey === "id" &&
                            (sortOrder === "asc" ? (
                              <FaSortUp className="ms-1" />
                            ) : (
                              <FaSortDown className="ms-1" />
                            ))}
                        </th>

                        <th>Customer Name</th>

                        <th
                          onClick={() => handleSort("order_name")}
                        >
                          Order Name
                          {sortKey === "order_name" &&
                            (sortOrder === "asc" ? (
                              <FaSortUp className="ms-1" />
                            ) : (
                              <FaSortDown className="ms-1" />
                            ))}
                        </th>

                        <th>Order Amount</th>
                        <th>Total Items</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6">
                            <div className="d-flex justify-content-center align-items-center my-5">
                              <BaseLoader size={30} />
                            </div>
                          </td>
                        </tr>
                      ) : noOrderData ? (
                        <tr>
                          <td colSpan="6">
                            <div className="text-center my-5">
                              <h5>Sorry! No orders found.</h5>
                            </div>
                          </td>
                        </tr>
                      ) : orderReportData.length > 0 ? (
                        orderReportData.map((item, index) => (
                          <tr key={index}>
                            <td>{(orderPage - 1) * orderLimit + index + 1}</td>
                            <td>{item.id}</td>
                            <td>{item.name || "Unknown"}</td>
                            <td>{item.order_name || "N/A"}</td>
                            <td>${item.order_amount || 0}</td>
                            <td>{item.total_items || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

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

export default OrderReport;
