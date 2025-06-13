import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import userApi from "../../../api/userApi";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await userApi.dashboardStatistics();
    
            if (response?.status === 200 && response?.data?.data) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content mt-4">
                <Container fluid>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4>Loading dashboard...</h4>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    // ✅ Correct check for empty object
    if (!stats || Object.keys(stats).length === 0) {
        return (
            <div className="page-content mt-4">
                <Container fluid>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h4>No data available.</h4>
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
            prefix: "",
            suffix: "",
            separator: ",",
            decimals: 0,
            badge: "",
            badgeClass: "success",
            percentage: "+0",
            link: "View Orders",
            bgcolor: "primary",
            icon: "ri-shopping-bag-line",
        },
        {
            label: "Cancelled Orders",
            counter: stats.total_cancel_order,
            prefix: "",
            suffix: "",
            separator: ",",
            decimals: 0,
            badge: "",
            badgeClass: "danger",
            percentage: "+0",
            link: "View Cancelled",
            bgcolor: "danger",
            icon: "ri-close-circle-line",
        },
        {
            label: "Pending Orders",
            counter: stats.total_pending_order,
            prefix: "",
            suffix: "",
            separator: ",",
            decimals: 0,
            badge: "",
            badgeClass: "warning",
            percentage: "+0",
            link: "View Pending",
            bgcolor: "warning",
            icon: "ri-timer-line",
        },
        {
            label: "Total Customers",
            counter: stats.total_customer,
            prefix: "",
            suffix: "",
            separator: ",",
            decimals: 0,
            badge: "",
            badgeClass: "info",
            percentage: "+0",
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
                                                {item.badge ? (
                                                    <i className={"fs-13 align-middle " + item.badge}></i>
                                                ) : null}{" "}
                                                {item.percentage} %
                                            </h5>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                        <div>
                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                                <span className="counter-value" data-target={item.counter}>
                                                    <CountUp
                                                        start={0}
                                                        prefix={item.prefix}
                                                        suffix={item.suffix}
                                                        separator={item.separator}
                                                        end={item.counter}
                                                        decimals={item.decimals}
                                                        duration={2}
                                                    />
                                                </span>
                                            </h4>
                                            <Link to="#" className="text-decoration-underline">
                                                {item.link}
                                            </Link>
                                        </div>
                                        <div className="avatar-sm flex-shrink-0">
                                            <span className={"avatar-title rounded fs-3 bg-" + item.bgcolor + "-subtle"}>
                                                <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                            </span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
