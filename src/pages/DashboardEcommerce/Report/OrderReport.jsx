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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrderReport = () => {
  document.title = "Order Report";

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

  const parseDate = (dateString) => {
    return dateString ? new Date(dateString) : null;
  };
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
  const handleStartDateChange = (date) => {
    if (date === null) {
      setTempStartDate("");
      setOrderStartDate("");
      setOrderPage(1);
    } else {
      const formattedDate = date.toISOString().split("T")[0];
      setTempStartDate(formattedDate);
      setOrderStartDate(formattedDate);
      setOrderPage(1);
    }
  };

  const handleEndDateChange = (date) => {
    if (date === null) {
      setTempEndDate("");
      setOrderEndDate("");
      setOrderPage(1);
    } else {
      const formattedDate = date.toISOString().split("T")[0];
      setTempEndDate(formattedDate);
      setOrderEndDate(formattedDate);
      setOrderPage(1);
    }
  };

  return (
    <div className="page-content mt-4">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card className="shadow-sm">
              <CardHeader className="d-flex justify-content-between align-items-center rounded-top-4 flex-wrap gap-3">
                <h4 className="card-title mb-0">Recent orders report</h4>
                <div className="d-flex align-items-center gap-2">
                  <BaseInput
                    id={CONSTANTS.OrderSearch}
                    name={CONSTANTS.orderSearch}
                    type={CONSTANTS.text}
                    placeholder={CONSTANTS.Order_Search}
                    value={orderSearchInput}
                    onChange={(e) => {
                      setOrderSearchInput(e.target.value);
                      setOrderPage(1);
                      setLoading(true);
                      setOrderSearch(e.target.value.trim());
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
                      <DatePicker
                        selected={parseDate(tempStartDate)}
                        onChange={(date) => handleStartDateChange(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control mb-1 ms-1"
                        isClearable
                        placeholderText="Enter Start Date"
                        maxDate={parseDate(tempEndDate) || new Date()}
                        popperModifiers={[
                          {
                            name: "zIndex",
                            options: {
                              zIndex: 9999,
                            },
                          },
                        ]}
                      />
                    </Col>

                    <Col md="3">
                      <label>End Date</label>
                      <DatePicker
                        selected={parseDate(tempEndDate)}
                        onChange={(date) => handleEndDateChange(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control mb-1 ms-1"
                        isClearable
                        placeholderText="Enter End Date"
                        minDate={parseDate(tempStartDate) || null}
                        maxDate={new Date()}
                        popperModifiers={[
                          {
                            name: "zIndex",
                            options: {
                              zIndex: 9999,
                            },
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </Row>

                <div className="table-responsive table-card mb-2">
                  <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                    <thead className="text-muted table-light">
                      <tr>
                        <th>No.</th>

                        <th className="cursor" onClick={() => handleSort("id")}>
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
                          className="cursor"
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
