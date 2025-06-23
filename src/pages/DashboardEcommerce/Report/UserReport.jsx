import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, CardBody, CardHeader } from "reactstrap";
import userApi from "../../../api/userApi";
import BaseButton from "../../../Components/BASE/BaseButton";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import BaseLoader from "../../../Components/BASE/BaseLoader";
import BaseInput from "../../../Components/BASE/BaseInput";
import { CONSTANTS } from "../../../Components/constants/common";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const UserReport = () => {
  document.title = "User Report";

  const [userReportData, setUserReportData] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");

  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotalRecords, setUserTotalRecords] = useState(0);
  const [noUserData, setNoUserData] = useState(false);

  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortMapping = {
    customer_name: "name",
    email: "email",
    phone_number: "phone_number",
    gender: "gender",
  };

  useEffect(() => {
    fetchReports();
  }, [userPage, userSearch, sortKey, sortOrder]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const userPayload = {
        search: userSearch,
        limit: userLimit,
        page: userPage,
        sortValue: sortOrder,
        sortKey: sortKey,
      };

      const [userResult] = await Promise.allSettled([
        userApi.userReport(userPayload),
      ]);
      if (userResult.status === "fulfilled") {
        const userRes = userResult.value;
        const users = userRes?.data?.data?.users || [];
        setUserReportData(users);
        setUserTotalPages(userRes.data.data.totalPage || 1);
        setUserTotalRecords(userRes.data.data.totalItems || 0);
        setNoUserData(users.length === 0);
      } else {
        const statusCode = userResult?.reason?.response?.status;
        if (statusCode !== 404) {
          toast.error(userResult.reason?.response?.data?.message);
        }

        setUserReportData([]);
        setNoUserData(true);
      }
    } catch (err) {
      const status = err?.response?.status;

      if (status !== 404) {
        toast.error(err?.response?.data?.message);
      }
      setNoUserData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    const backendKey = sortMapping[key];

    if (sortKey === backendKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(backendKey);
      setSortOrder("asc");
    }
    setUserPage(1);
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
            <Card className="shadow-sm">
              <CardHeader className="d-flex justify-content-between align-items-center rounded-top-4 flex-wrap gap-3">
                <h4 className="card-title mb-0">Customer Activity Report</h4>
                <div className="d-flex align-items-center gap-2">
                  <BaseInput
                    id={CONSTANTS.UserSearch}
                    name={CONSTANTS.userSearch}
                    type={CONSTANTS.text}
                    placeholder="Search User.."
                    value={userSearchInput}
                    onChange={(e) => setUserSearchInput(e.target.value)}
                    onIconClick={() => {
                      setUserSearch(userSearchInput);
                      setUserPage(1);
                    }}
                    icon={<Search size={16} />}
                  />

                  {userSearchInput.trim() !== "" && (
                    <BaseButton
                      color="warning"
                      size="sm"
                      className="px-3 mt-3 py-1 d-flex align-items-center"
                      onClick={() => {
                        setUserSearchInput("");
                        setUserSearch("");
                        setUserPage(1);
                      }}
                    >
                      Discard
                    </BaseButton>
                  )}
                </div>
              </CardHeader>

              <CardBody>
                <div className="table-responsive table-card mb-2">
                  <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                    <thead className="text-muted table-light">
                      <tr>
                        <th>No.</th>

                        <th
                          onClick={() => handleSort("customer_name")}
                        >
                          Customer Name
                          {sortKey === "name" &&
                            (sortOrder === "asc" ? (
                              <FaSortUp className="ms-1" />
                            ) : (
                              <FaSortDown className="ms-1" />
                            ))}
                        </th>

                        <th
                          onClick={() => handleSort("email")}
                        >
                          Email
                          {sortKey === "email" &&
                            (sortOrder === "asc" ? (
                              <FaSortUp className="ms-1" />
                            ) : (
                              <FaSortDown className="ms-1" />
                            ))}
                        </th>

                        <th
                          onClick={() => handleSort("phone_number")}
                        >
                          Phone Number
                          {sortKey === "phone_number" &&
                            (sortOrder === "asc" ? (
                              <FaSortUp className="ms-1" />
                            ) : (
                              <FaSortDown className="ms-1" />
                            ))}
                        </th>

                        <th
                          onClick={() => handleSort("gender")}
                        >
                          Gender
                          {sortKey === "gender" &&
                            (sortOrder === "asc" ? (
                              <FaSortUp className="ms-1" />
                            ) : (
                              <FaSortDown className="ms-1" />
                            ))}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5">
                            <div className="d-flex justify-content-center align-items-center my-5">
                              <BaseLoader size={30} />
                            </div>
                          </td>
                        </tr>
                      ) : noUserData ? (
                        <tr>
                          <td colSpan="5">
                            <div className="text-center my-5">
                              <h5>Sorry! No customers found.</h5>
                            </div>
                          </td>
                        </tr>
                      ) : userReportData.length > 0 ? (
                        userReportData.map((item, index) => (
                          <tr key={index}>
                            <td>{(userPage - 1) * userLimit + index + 1}</td>
                            <td>{item.name || "Unknown"}</td>
                            <td>{item.email || "N/A"}</td>
                            <td>{item.phone_number || "N/A"}</td>
                            <td>{item.gender || "N/A"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No customers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

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
      </Container>
    </div>
  );
};

export default UserReport;
